import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Button, message, Divider,Spin,Table,Tag } from 'antd';
import { routerRedux } from 'dva/router';

import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableModal from '../../components/_public/TableModal';
import MyTree from '../../components/_public/MyTree'
import LessonPreview from '../../components/_public/LessonPreview';
import Katex from '../../components/_public/Katex';
import styles from './CoursewareConfig.less';
import { getParamUrl, katexShow,getMathJax, minHeight,heightTwoMain } from '../../utils/formatDataSource';


function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}
class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };
    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === 'downward') {
        className += ' drop-over-downward';
      }
      if (direction === 'upward') {
        className += ' drop-over-upward';
      }
    }
    return connectDragSource(
      connectDropTarget(
        <tr
          {...restProps}
          className={className}
          style={style}
        />
      )
    );
  }
}
const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};
const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveRow(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);






@connect(({ lesson, loading }) => ({
  lesson,
  treeLoading: loading.effects['lesson/kjConfig'],
  saveLoading: loading.effects['lesson/coursewareAdd'],
}))
class CoursewareConfig extends PureComponent {

  state= {
    visible: false,
    previewShow: false,
    selectedRowKeys: [],
    current: {},  // 点击添加后，所属的题型
    checkedKeys: [],
    totalKeys: [],
    treeList: [],
    content: [],
    lessonId: '',
    detailInfoLoading: false,
  }
  components = {
    body: {
      row: DragableBodyRow,
    },
  }
  moveRow = (dragIndex, hoverIndex, questions, type) => {
    const { lessonId, checkedKeys, totalKeys, content } = this.state;
    const dragRow = questions[dragIndex];
    const newQuestions = update(questions, {$splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]});

    const parent = content.find(c => c.key === questions[0].parentKey);
    if(type === 1) {
      parent.demoQuestions = newQuestions;
    }
    else if(type === 2) {
      parent.testQuestions = newQuestions;
    }
    this.setState({detailInfoLoading: true});
    this.handleCurrentOperate(lessonId, checkedKeys, totalKeys, content, 'move')
    .then(() => {
      this.setQuestionParentKey(content);
      this.setState({
        content: [...content],
        detailInfoLoading: false,
      });
    });
  }

  componentDidMount() {
    const { dispatch, location: { search } } = this.props;
    const params = getParamUrl(search);
    this.setState({lessonId: params.lessonId});
    dispatch({
      type: 'lesson/initCourseware',
      payload: {
        lessonId: params.lessonId,
      },
    }).then(() => {
      const { initCourse } = this.props.lesson;
      const { content=[], selected, total } = initCourse;
      this.setQuestionParentKey(content);
      this.setState({
        content: content,
        checkedKeys: selected,
        totalKeys: total,
      })
    });
    dispatch({
      type: 'lesson/kjConfig',
    });
  }
  setQuestionParentKey = (content) => {
    const questionMark = [];
    let currentSection = '';
    content.map((c, i) => {
      if(c.type === 2) {
        questionMark.push({
          sectionKey: c.key,
          demoQuestions: [],
          testQuestions: [],
        });
        currentSection = c.key;
      }
      if(c.type === 5) {
        const { demoQuestions, testQuestions } = c;
        if(demoQuestions) {
          demoQuestions.map(d => {
            d.parentKey = c.key;
            d.ptype = 1;
          });
        }
        if(testQuestions) {
          testQuestions.map(d => {
            d.parentKey = c.key;
            d.ptype = 2;
          });
        }
        const demo = questionMark.find(q => q.sectionKey === currentSection);
        demo.demoQuestions.push(...demoQuestions);
        demo.testQuestions.push(...testQuestions);
      }
    });
    questionMark.map(s => {
      s.demoQuestions.map((q, i) => q.sort = (i+1));
      s.testQuestions.map((q, i) => q.sort = (i+1));
    });
  }
  demoContent = (c, parentId) => {
    return {
      id: c.id,
      key: c.uniqueKey,
      title: c.title,
      content: c.content,
      type: c.type,
      pageMark: 0,
      originParentId: parentId,
      demoQuestions:[],
      testQuestions:[],
    };
  };
  getStyleTitle = (typeId) => {
    switch (typeId) {
      case 1:
        return styles.zhangTitle;
      default:
        return styles.jieTitle;
    }
  };
  getStyleContent = (typeId) => {
    switch (typeId) {
      case 1:
        return styles.zhangContent;
      default:
        return styles.jieContent;
    }
  };
  getQuestionPage = (page, pageSize, hard, use) => {
    const { dispatch } = this.props;
    const { selectedRowKeys, current } = this.state;
    const exist = selectedRowKeys.find(s => s.questionTypeId === current.content.id && s.typeId === current.type);
    exist.data.page = page;
    let params = {};
    if(hard !== '-1') {
      params.hard = hard;
    }
    if(use !== '-1') {
      params.use = use;
    }
    dispatch({
      type: 'lesson/questionList',
      payload: {
        existIdStr: this.getCurrentExistIds(),
        page,
        pageSize,
        ...params,
      },
    });
  };
  questionModalCancel = () => {
    this.setState({
      visible: false,
    });
  };
  questionModalOk = (questions, rowKeys) => {
    const { current, lessonId, checkedKeys, totalKeys, content } = this.state;
    questions.map(q => {
      q.parentKey = current.content.key;
      q.ptype = current.type;
    });
    if(current.type === 1) {
      current.content.demoQuestions.push(...questions);
    }
    else if(current.type === 2) {
      current.content.testQuestions.push(...questions);
    }
    this.setState({detailInfoLoading: true});
    this.handleCurrentOperate(lessonId, checkedKeys, totalKeys, content, 'add')
    .then(() => {
      setTimeout(() => {
        this.setQuestionParentKey(content);
        this.setState({
          detailInfoLoading: false,
          content: [...content],
        });
      }, 500);
    });
  };
  handleRowChange = (newRows) => {
    const { current, selectedRowKeys } = this.state;
    const exist = selectedRowKeys.filter(s => s.questionTypeId === current.content.id && s.typeId === current.type)[0];
    exist.data.data = newRows;
    this.setState({
      selectedRowKeys: [...selectedRowKeys],
    });
  };

  handleCurrentOperate = (lessonId, select, total, data, action) => {
    const selectedKey = select.join(",");
    const totalKey = total.join(",");
    return this.props.dispatch({
      type: 'lesson/coursewareTreeCheck',
      payload: {
        lessonId,
        selectedKey,
        totalKey,
        data,
        action,
      }
    });
  }

  handleTree = (select, total) => {
    const { treeList = [], } = this.props.lesson;
    const content = [];
    this.setState({detailInfoLoading: true});
     // 封装选中的数据
    this.saveContent(treeList, total, content, 0);
    this.handleCurrentOperate(this.state.lessonId, select, total, content, 'check')
    .then(() => {
      const data = this.props.lesson.operateCourseware;
      this.setQuestionParentKey(data);
      setTimeout(() => {
          this.setState({
            checkedKeys: select,
            totalKeys: total,
            content: data,
            detailInfoLoading: false,
          });
      }, 500);
    })
  };
  handlePageLine = (c, i) => {
    const { content } = this.state;
    c.pageMark = i;
    this.setState({
      content: [...content],
    });
  };
  showQuesitonModal = (v, i) => {

    // i =1 例题  i=2 习题
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const exist = selectedRowKeys.find(s => s.questionTypeId === v.id && s.typeId === i);
    if(exist) {
      exist.data.data = [];
      exist.data.page = 1;
    }
    else {
      selectedRowKeys.push({
        questionTypeId: v.id,
        typeId: i,
        data: {
          data: [],
          page: 1,
        },
      })
    }
    dispatch({
      type: 'lesson/questionList',
      payload: {
        existIdStr: this.getCurrentExistIds(),
      },
    }).then(() => {
      this.setState({
        visible: true,
        current: {
          content: v,
          type: i,
        },
        selectedRowKeys,
      });
    });
  };
  deleteQuestion = (c, type, qId) => {
    const { lessonId, checkedKeys, totalKeys, content } = this.state;
    const current = content.find(d => d.key === c.parentKey);
    if(!current){
      console.log(content)
      return;
    }
    if(c.ptype === 1) { // 删除例题
      current.demoQuestions = current.demoQuestions.filter(q => q.id !== qId);
    }
    else { // 删除习题
      current.testQuestions = current.testQuestions.filter(q => q.id !== qId);
    }
    this.setState({detailInfoLoading: true});
    this.handleCurrentOperate(lessonId, checkedKeys, totalKeys, content, 'delete')
    .then(() => {
      setTimeout(() => {
        this.setQuestionParentKey(content);
        this.setState({
          detailInfoLoading: false,
          content: [...content],
        })
      }, 500);
    });

  };
  saveContent = (treeList, total, content, parentId) => {
    treeList.map(t => {
      if(total.includes(t.uniqueKey)) {
        if(t.sons) {
          const data = this.demoContent(t, parentId);
          this.setDataQuestion(data);
          content.push(data);
          this.saveContent(t.sons, total, content, t.id);
        }
        else {
          const data = this.demoContent(t, parentId);
          this.setDataQuestion(data);
          content.push(data);
        }
      }
    });
  };
  setDataQuestion = (data) => {
    const { content } = this.state;
    if(content.length === 0) {
      return;
    }
    if(data.type === 5) {
      const value = content.filter(c => c.key === data.key);
      if(value.length !== 0) {
        data.demoQuestions = value[0].demoQuestions;
        data.testQuestions = value[0].testQuestions;
      }
    }
  };
  cancel = () => {
    this.setState({
      checkedKeys: [],
      totalKeys: [],
      content: [],
      visible: false,
      previewShow: false,
      current: {},
      selectedRowKeys: [],
    });
  };
  preview = () => {
    this.setState({previewShow: true});
  };
  previewOk = () => {
    this.setState({previewShow: false});
  };
  previewCancel = () => {
    this.setState({previewShow: false});
  };
  getQuestionList = (hard, use) => {
    const { dispatch } = this.props;
    let params = {};
    if(hard !== '-1') {
      params.hard = hard;
    }
    if(use !== '-1') {
      params.use = use;
    }
    dispatch({
      type: 'lesson/questionList',
      payload: {
        questiontypeId: "",
        type: this.state.currentAdd,
        existIdStr: this.getCurrentExistIds(),
        ...params,
      },
    });
  };
  getCurrentExistIds = () => {
    const { content } = this.state;
    const arr = [];
    content.filter(c => c.type === 5).map(c => {
      c.demoQuestions.map(q => arr.push(q.id));
      c.testQuestions.map(q => arr.push(q.id));
    });
    return arr.join(",");
  };
  columns = () => {
    return [
      {
        title: '标号',
        key: 'sort',
        width: '5%',
        render: (item) => {
          if(item.ptype === 1) {
            return (<Tag color="cyan">例{item.sort}</Tag>)
          }
          else if(item.ptype === 2){
            return (<Tag color="cyan">习题{item.sort}</Tag>)
          }
        }
      },
      {
        title: '题干',
        dataIndex: 'stem',
        key: 'stem',
        width: '90%',
        render: (value) => {
          return (<Katex value={value}/>)
        }
      },{
        title: '操作',
        key: 'action',
        width: '5%',
        render: (item) => {
          return (
            <div>
              <a href="javascript:;" onClick={ () => this.deleteQuestion(item, 1, item.id)}>删除</a>
            </div>
          )
        }
      }
    ];
  };
  moveCeil = (question, action) => {
    if(action === 'top') {

    } else {

    }
  };
  expandedRowRender = (record) => {
    console.log(record)
    return (
    <div>
      <Row hidden={record.optionVoList.length === 0}>
        <Col span={24}><strong>选项：</strong></Col>
        {
          record.optionVoList.map((o, i) => <Col span={24} key={i+1}><Katex value={o.content}/></Col>)
        }
      </Row>
      <br hidden={record.optionVoList.length === 0}/>
      <Row>
        <Col span={24}><strong>参考答案：</strong></Col>
        {
          record.answerVoList.map((a, i) => <Col span={24} key={i+1}><strong>答案{i+1}：</strong><Katex value={this.getQuestionAnswer(record, a)}/></Col>)
        }
      </Row>
      <br />
      <Row>
        <Col span={24}><strong>题目分析：</strong></Col>
        {
          record.analysisVoList.map((a, i) => <Col span={24} key={i+1}><strong>分析{i+1}：</strong><Katex value={a.content}/></Col>)
        }
      </Row>
    </div>
    )
  };
  getQuestionAnswer = (question, answer) => {
    if(question.type === 1) {
      const option = question.optionVoList.find(o => o.id+'' === answer.content);
      return option ? option.content : '';
    }
    else {
      return answer.content;
    }
  };

  render() {
    const { treeList = [], questionListInfo, } = this.props.lesson;
    const { content, current, selectedRowKeys } = this.state;
    const currentSelect =  Object.keys(current).length !== 0 ?
      selectedRowKeys.filter(s => s.questionTypeId === current.content.id && s.typeId === current.type) : [];
    const data = currentSelect.length === 0 ? {
        data: [],
        page: 1,
      } : currentSelect[0].data;
    return (
      <PageHeaderLayout gutter={24} >
        <Col span={9}>
          <Card bordered={true} style={{minHeight: minHeight}}>
            <MyTree dataSource = { treeList } checkedKeys = {this.state.checkedKeys} handleCheck = {this.handleTree} loading={this.props.treeLoading}/>
          </Card>
        </Col>
        <Col span={15}>
          <Card style={{marginBottom: '10px', textAlign: 'right'}}>
            <Button type='primary' size='small' onClick={() => this.props.dispatch(routerRedux.push(`/lesson/3/lesson-info?lessonId=${this.state.lessonId}`))}>返回</Button>
          </Card>
          <Card bordered={false} style={{minHeight: heightTwoMain}}>
           <Spin tip="Loading..." spinning={this.state.detailInfoLoading}>
            {
              this.state.content.map((c, i) => {
                return (
                  <div key={c.key}>
                    <div style={{marginBottom: '6px'}}>
                      <Row>
                        <Col span={22}>
                          <Katex value={c.content}/>
                        </Col>
                        <Col span={2} style={{textAlign: 'right'}}>
                        <span>
                          <a href="javascript:;" onClick={() => this.handlePageLine(c, 1) } hidden={ c.pageMark === 1 }>设置分页线</a>
                          <a href="javascript:;" onClick={() => this.handlePageLine(c, 0) } hidden={ c.pageMark === 0 }>取消分页线</a>
                        </span>
                        </Col>
                      </Row>
                    </div>
                    <div className={this.getStyleContent(c.type)}>
                      <div hidden={c.type !== 5} className='coursewareTable'>
                        <Row>
                          <Col span={12} style={{fontSize: '15px'}}><strong>例题</strong></Col>
                          <Col span={12} style={{textAlign: 'right'}}>
                            <a href="javascript:;" onClick={ () => this.showQuesitonModal(c, 1)}>添加</a>
                          </Col>
                        </Row>
                        <Table columns={this.columns()}
                               dataSource={c.demoQuestions}
                               showHeader={false}
                               size='small'
                               pagination={false}
                               expandedRowRender={this.expandedRowRender}
                               components={this.components}
                               onRow={(record, index) => ({
                                  index,
                                  moveRow: (dragIndex, hoverIndex) => this.moveRow(dragIndex, hoverIndex, c.demoQuestions, 1),
                               })}
                               />
                        <Row>
                            <Col span={12} style={{fontSize: '15px'}}><strong>习题</strong></Col>
                            <Col span={12} style={{textAlign: 'right'}}>
                              <a href="javascript:;" onClick={ () => this.showQuesitonModal(c, 2) }>添加</a>
                            </Col>
                        </Row>
                        <Table columns={this.columns()}
                               dataSource={c.testQuestions}
                               showHeader={false}
                               size='small'
                               pagination={false}
                               components={this.components}
                               onRow={(record, index) => ({
                                  index,
                                  moveRow: (dragIndex, hoverIndex) => this.moveRow(dragIndex, hoverIndex, c.testQuestions, 2),
                               })}
                               />
                      </div>
                    </div>
                    <div hidden={ c.pageMark === 0 }>
                      <Divider className={styles.hrLine}/>
                    </div>
                  </div>
                )
              })
            }
           </Spin>
          </Card>
        </Col>

        <TableModal visible={this.state.visible}
                    onClickModal={this.questionModalCancel}
                    onClickSubmit={this.questionModalOk}
                    dataSource={ questionListInfo }
                    getPageData={this.getQuestionPage}
                    defaultRows={data}
                    defaultRowChange={this.handleRowChange}
                    getQuestionList={this.getQuestionList}/>

        <LessonPreview visible={this.state.previewShow} onOk={this.previewOk} onCancel={this.previewCancel}
                       dataSource={this.state.content}/>
      </PageHeaderLayout>

    );
  }
}

const Demo = DragDropContext(HTML5Backend)(CoursewareConfig);
export default Demo;
