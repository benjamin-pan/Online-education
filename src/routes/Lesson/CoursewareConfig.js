import React, { PureComponent, Fragment } from "react";
import { connect } from "dva";
import {
  Card,
  Col,
  Row,
  Button,
  message,
  Divider,
  Spin,
  Table,
  Tag
} from "antd";
import { routerRedux } from "dva/router";

import { DragDropContext, DragSource, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";

import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import TableModal from "../../components/_public/TableModal";
import MyTree from "../../components/_public/MyTree";
import LessonPreview from "../../components/_public/LessonPreview";
import Katex from "../../components/_public/Katex";
import styles from "./CoursewareConfig.less";
import {
  getParamUrl,
  katexShow,
  getMathJax,
  minHeight,
  heightTwoMain
} from "../../utils/formatDataSource";
import { length } from "../../components/Ellipsis/index";

// import Preview from '../../components/Preview'

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return "downward";
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return "upward";
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
    const style = { ...restProps.style, cursor: "move" };
    let className = restProps.className;
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      );
      if (direction === "downward") {
        className += " drop-over-downward";
      }
      if (direction === "upward") {
        className += " drop-over-upward";
      }
    }
    return connectDragSource(
      connectDropTarget(
        <tr {...restProps} className={className} style={style} />
      )
    );
  }
}

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
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
  }
};

const DragableBodyRow = DropTarget("row", rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource("row", rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(BodyRow)
);

@connect(({ lesson, loading }) => ({
  lesson,
  treeLoading: loading.effects["lesson/kjConfig"],
  saveLoading: loading.effects["lesson/coursewareAdd"]
}))
class CoursewareConfig extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewShow: false,
      visible: false,
      selectedRowKeys: [],
      current: {}, // 点击添加后，所属的题型
      checkedKeys: [],
      totalKeys: [],
      treeList: [],
      content: [],
      lessonId: "",
      detailInfoLoading: false
    };
  }

  // state = {
  //   previewShow: true,
  //   visible: false,
  //   selectedRowKeys: [],
  //   current: {},  // 点击添加后，所属的题型
  //   checkedKeys: [],
  //   totalKeys: [],
  //   treeList: [],
  //   content: [],
  //   lessonId: '',
  //   detailInfoLoading: false,
  // }
  components = {
    body: {
      row: DragableBodyRow
    }
  };
  moveRow = (dragIndex, hoverIndex, questions, type) => {
    const { lessonId, checkedKeys, totalKeys, content } = this.state;
    const dragRow = questions[dragIndex];
    const newQuestions = update(questions, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]]
    });

    const parent = content.find(c => c.key === questions[0].parentKey);
    if (type === 1) {
      parent.demoQuestions = newQuestions;
    } else if (type === 2) {
      parent.testQuestions = newQuestions;
    }
    this.setState({ detailInfoLoading: true });
    this.handleCurrentOperate(
      lessonId,
      checkedKeys,
      totalKeys,
      content,
      "move"
    ).then(() => {
      this.setQuestionParentKey(content);
      console.log("content", content);
      this.setState({
        content: [...content],
        detailInfoLoading: false
        // previewShow: true,
      });
    });
  };

  componentDidMount() {
    const {
      dispatch,
      location: { search }
    } = this.props;
    const params = getParamUrl(search);
    this.setState({ lessonId: params.lessonId });
    dispatch({
      type: "lesson/initCourseware",
      payload: {
        lessonId: params.lessonId
      }
    }).then(() => {
      const { initCourse } = this.props.lesson;
      const { content = [], selected, total } = initCourse;
      this.setQuestionParentKey(content);
      this.setState({
        content: content,
        checkedKeys: selected,
        totalKeys: total
      });
    });
    dispatch({
      type: "lesson/kjConfig"
    });
  }

  setQuestionParentKey = content => {
    const questionMark = [];
    let currentSection = "";
    content.map((c, i) => {
      if (c.type === 2) {
        questionMark.push({
          sectionKey: c.key,
          demoQuestions: [],
          testQuestions: []
        });
        currentSection = c.key;
      }
      if (c.type === 5) {
        const { demoQuestions, testQuestions } = c;
        if (demoQuestions) {
          demoQuestions.map(d => {
            d.parentKey = c.key;
            d.ptype = 1;
          });
        }
        if (testQuestions) {
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
      s.demoQuestions.map((q, i) => (q.sort = i + 1));
      s.testQuestions.map((q, i) => (q.sort = i + 1));
    });
  };
  demoContent = (c, parentId) => {
    return {
      id: c.id,
      key: c.uniqueKey,
      title: c.title,
      content: c.content,
      type: c.type,
      pageMark: 0,
      originParentId: parentId,
      demoQuestions: [],
      testQuestions: []
    };
  };
  getStyleTitle = typeId => {
    switch (typeId) {
      case 1:
        return styles.zhangTitle;
      default:
        return styles.jieTitle;
    }
  };
  getStyleContent = typeId => {
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
    const exist = selectedRowKeys.find(
      s => s.questionTypeId === current.content.id && s.typeId === current.type
    );
    exist.data.page = page;
    let params = {};
    if (hard !== "-1") {
      params.hard = hard;
    }
    if (use !== "-1") {
      params.use = use;
    }
    dispatch({
      type: "lesson/questionList",
      payload: {
        existIdStr: this.getCurrentExistIds(),
        page,
        pageSize,
        ...params
      }
    });
  };
  questionModalCancel = () => {
    this.setState({
      visible: false
    });
  };
  questionModalOk = (questions, rowKeys) => {
    const { current, lessonId, checkedKeys, totalKeys, content } = this.state;
    questions.map(q => {
      q.parentKey = current.content.key;
      q.ptype = current.type;
    });
    if (current.type === 1) {
      current.content.demoQuestions.push(...questions);
    } else if (current.type === 2) {
      current.content.testQuestions.push(...questions);
    }
    this.setState({ detailInfoLoading: true });
    this.handleCurrentOperate(
      lessonId,
      checkedKeys,
      totalKeys,
      content,
      "add"
    ).then(() => {
      setTimeout(() => {
        this.setQuestionParentKey(content);
        this.setState({
          detailInfoLoading: false,
          content: [...content]
        });
      }, 500);
    });
  };
  handleRowChange = newRows => {
    const { current, selectedRowKeys } = this.state;
    const exist = selectedRowKeys.filter(
      s => s.questionTypeId === current.content.id && s.typeId === current.type
    )[0];
    exist.data.data = newRows;
    this.setState({
      selectedRowKeys: [...selectedRowKeys]
    });
  };

  handleCurrentOperate = (lessonId, select, total, data, action) => {
    const selectedKey = select.join(",");
    const totalKey = total.join(",");
    return this.props.dispatch({
      type: "lesson/coursewareTreeCheck",
      payload: {
        lessonId,
        selectedKey,
        totalKey,
        data,
        action
      }
    });
  };

  handleTree = (select, total) => {
    const { treeList = [] } = this.props.lesson;
    const content = [];
    this.setState({ detailInfoLoading: true });
    // 封装选中的数据
    this.saveContent(treeList, total, content, 0);
    this.handleCurrentOperate(
      this.state.lessonId,
      select,
      total,
      content,
      "check"
    ).then(() => {
      const data = this.props.lesson.operateCourseware;
      this.setQuestionParentKey(data);
      setTimeout(() => {
        this.setState({
          checkedKeys: select,
          totalKeys: total,
          content: data,
          detailInfoLoading: false
        });
      }, 500);
    });
  };
  handlePageLine = (c, i) => {
    const { content } = this.state;
    c.pageMark = i;
    this.setState({
      content: [...content]
    });
  };
  showQuesitonModal = (v, i) => {
    // i =1 例题  i=2 习题
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    const exist = selectedRowKeys.find(
      s => s.questionTypeId === v.id && s.typeId === i
    );
    if (exist) {
      exist.data.data = [];
      exist.data.page = 1;
    } else {
      selectedRowKeys.push({
        questionTypeId: v.id,
        typeId: i,
        data: {
          data: [],
          page: 1
        }
      });
    }
    dispatch({
      type: "lesson/questionList",
      payload: {
        existIdStr: this.getCurrentExistIds()
      }
    }).then(() => {
      this.setState({
        visible: true,
        current: {
          content: v,
          type: i
        },
        selectedRowKeys
      });
    });
  };
  deleteQuestion = (c, type, qId) => {
    const { lessonId, checkedKeys, totalKeys, content } = this.state;
    const current = content.find(d => d.key === c.parentKey);
    if (!current) {
      console.log(content);
      return;
    }
    if (c.ptype === 1) {
      // 删除例题
      current.demoQuestions = current.demoQuestions.filter(q => q.id !== qId);
    } else {
      // 删除习题
      current.testQuestions = current.testQuestions.filter(q => q.id !== qId);
    }
    this.setState({ detailInfoLoading: true });
    this.handleCurrentOperate(
      lessonId,
      checkedKeys,
      totalKeys,
      content,
      "delete"
    ).then(() => {
      setTimeout(() => {
        this.setQuestionParentKey(content);
        this.setState({
          detailInfoLoading: false,
          content: [...content]
        });
      }, 500);
    });
  };
  saveContent = (treeList, total, content, parentId) => {
    treeList.map(t => {
      if (total.includes(t.uniqueKey)) {
        if (t.sons) {
          const data = this.demoContent(t, parentId);
          this.setDataQuestion(data);
          content.push(data);
          this.saveContent(t.sons, total, content, t.id);
        } else {
          const data = this.demoContent(t, parentId);
          this.setDataQuestion(data);
          content.push(data);
        }
      }
    });
  };
  setDataQuestion = data => {
    const { content } = this.state;
    if (content.length === 0) {
      return;
    }
    if (data.type === 5) {
      const value = content.filter(c => c.key === data.key);
      if (value.length !== 0) {
        data.demoQuestions = value[0].demoQuestions;
        data.testQuestions = value[0].testQuestions;
      }
    }
  };
  save = content => {
    this.setState({
      previewShow: false
    });
    // marks.map(value => {
    //   content[value].pageMark = 1;
    // })
    // this.setState({
    //   content: content
    // });
    const { checkedKeys, totalKeys } = this.state;
    const {
      dispatch,
      location: { search }
    } = this.props;
    const params = getParamUrl(search);
    const lessonId = params.lessonId;
    if (checkedKeys.length === 0) {
      message.warn("请先选择内容", 2);
      return;
    }
    const selectedTrees = checkedKeys.join(",");
    const totalTrees = totalKeys.join(",");
    dispatch({
      type: "lesson/coursewareAdd",
      payload: {
        data: content,
        lessonId,
        selectedTrees,
        totalTrees
      }
    });
  };
  cancel = () => {
    this.setState({
      checkedKeys: [],
      totalKeys: [],
      content: [],
      visible: false,
      previewShow: false,
      current: {},
      selectedRowKeys: []
    });
  };
  preview = () => {
    this.setState({ previewShow: true });
  };
  closePreview = () => {
    this.setState({ previewShow: false });
  };

  setMarkLines(content, marks) {
    // console.log(marks);
    // let content = [...this.state.content];
    // marks.map(value => {
    //   content[value].pageMark = 1;
    // })
    // this.setState({
    //   previewShow: false,
    //   content: content
    // });
    // console.log(this.state.content);
  }

  toggleMarkLines(index) {
    console.log(123, index);
    let content = [...this.state.content];
    content[index].pageMark = (content[index].pageMark + 1) % 2;
    this.setState({
      content: content
    });
  }

  breakContent(arr) {
    // TODO 拆分为方法
    let finishArr = [];
    let content = [...this.state.content];
    arr.map(val => {
      // 数据分为公式，图片和文字数组
      let contentArr = content[val.index].content.match(
        /\\\[((?!\[).)+\]|((?!\\\[((?!\\\[).)+\]).)+/g
      );
      let newContentArr = [];
      contentArr.map(value => {
        if (/\#\{((?!\#\{).)+\}|((?!\#\{((?!\#\{).)+\}).)+/g.test(value))
          return value
            .match(/\#\{((?!\#\{).)+\}|((?!\#\{((?!\#\{).)+\}).)+/g)
            .map(val => {
              newContentArr.push(val);
            });
        else newContentArr.push(value);
      });
      // 把文字文本整合到图片或者公式后面
      newContentArr.map((value, index) => {
        if (!(/^\#\{.+\}$/.test(value) || /^\\\[.+\\\]$/.test(value))) {
          if (index > 0) {
            newContentArr[index - 1] += newContentArr[index];
            newContentArr.splice(index, 1);
          }
        }
      });
      // 还原dom数据
      let newStringArr = [];
      let length = newContentArr.length;
      let preValue = null;
      Array(...val.breaks, length).map((value, index) => {
        if (index === 0)
          newStringArr[val.breaks.length - index] = newContentArr.slice(
            length - value
          );
        else
          newStringArr[val.breaks.length - index] = newContentArr.slice(
            length - value,
            preValue
          );
        preValue = length - value;
      });
      finishArr.push(newStringArr);
    });
    // 最终数据分割
    for (let i = arr.length - 1; i >= 0; i--) {
      finishArr[i].map((v, j) => {
        let needSplice = JSON.parse(JSON.stringify(content[arr[j].index]));
        needSplice.content = v.join("");
        needSplice.markLines = 1;
        if (j === 0) content[arr[i].index] = needSplice;
        else content.splice(arr[i].index + j, 0, needSplice);
      });
    }
    // 最终回传数据
    console.log(content);
    this.setState({
      content: content
    });
  }

  // getContentArr (val) {
  //   let content = [...this.dataSource];
  //   let contentArr = content[val].content.match(/\\\[((?!\[).)+\]|((?!\\\[((?!\\\[).)+\]).)+/g);
  //   let newContentArr = [];
  //   contentArr.map(value => {
  //     if (/\#\{((?!\#\{).)+\}|((?!\#\{((?!\#\{).)+\}).)+/g.test(value)) return value.match(/\#\{((?!\#\{).)+\}|((?!\#\{((?!\#\{).)+\}).)+/g).map(val => {
  //       newContentArr.push(val);
  //     });
  //     else newContentArr.push(value);
  //   })
  //   return newContentArr
  // }
  //
  // createSring (arr, breaks) {
  //   let newStringArr = [];
  //   let length = arr.length;
  //   let preValue = null;
  //   breaks.map((value, index) => {
  //     newStringArr[breaks.length - index] = arr.slice(arr.length - value, preValue);
  //   })
  //   console.log(newStringArr);
  // }

  getQuestionList = (hard, use) => {
    const { dispatch } = this.props;
    let params = {};
    if (hard !== "-1") {
      params.hard = hard;
    }
    if (use !== "-1") {
      params.use = use;
    }
    dispatch({
      type: "lesson/questionList",
      payload: {
        questiontypeId: "",
        type: this.state.currentAdd,
        existIdStr: this.getCurrentExistIds(),
        ...params
      }
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
        title: "标号",
        key: "sort",
        width: "5%",
        render: item => {
          if (item.ptype === 1) {
            return <Tag color="cyan">例{item.sort}</Tag>;
          } else if (item.ptype === 2) {
            return (
              <Tag color="cyan">
                习题
                {item.sort}
              </Tag>
            );
          }
        }
      },
      {
        title: "题干",
        dataIndex: "stem",
        key: "stem",
        width: "90%",
        render: value => {
          return <Katex value={value} />;
        }
      },
      {
        title: "操作",
        key: "action",
        width: "5%",
        render: item => {
          return (
            <div>
              <a
                href="javascript:;"
                onClick={() => this.deleteQuestion(item, 1, item.id)}
              >
                删除
              </a>
            </div>
          );
        }
      }
    ];
  };
  moveCeil = (question, action) => {
    if (action === "top") {
    } else {
    }
  };
  expandedRowRender = record => {
    console.log(record);
    return (
      <div>
        <Row hidden={record.optionVoList.length === 0}>
          <Col span={24}>
            <strong>选项：</strong>
          </Col>
          {record.optionVoList.map((o, i) => (
            <Col span={24} key={i + 1}>
              <Katex value={o.content} />
            </Col>
          ))}
        </Row>
        <br hidden={record.optionVoList.length === 0} />
        <Row>
          <Col span={24}>
            <strong>参考答案：</strong>
          </Col>
          {record.answerVoList.map((a, i) => (
            <Col span={24} key={i + 1}>
              <strong>
                答案
                {i + 1}：
              </strong>
              <Katex value={this.getQuestionAnswer(record, a)} />
            </Col>
          ))}
        </Row>
        <br />
        <Row>
          <Col span={24}>
            <strong>题目分析：</strong>
          </Col>
          {record.analysisVoList.map((a, i) => (
            <Col span={24} key={i + 1}>
              <strong>
                分析
                {i + 1}：
              </strong>
              <Katex value={a.content} />
            </Col>
          ))}
        </Row>
      </div>
    );
  };
  getQuestionAnswer = (question, answer) => {
    if (question.type === 1) {
      const option = question.optionVoList.find(
        o => o.id + "" === answer.content
      );
      return option ? option.content : "";
    } else {
      return answer.content;
    }
  };

  render() {
    const { treeList = [], questionListInfo } = this.props.lesson;
    const { content, current, selectedRowKeys } = this.state;
    const currentSelect =
      Object.keys(current).length !== 0
        ? selectedRowKeys.filter(
            s =>
              s.questionTypeId === current.content.id &&
              s.typeId === current.type
          )
        : [];
    const data =
      currentSelect.length === 0
        ? {
            data: [],
            page: 1
          }
        : currentSelect[0].data;
    return (
      <PageHeaderLayout gutter={24}>
        <Col span={9}>
          <Card bordered={true} style={{ minHeight: minHeight }}>
            <MyTree
              dataSource={treeList}
              checkedKeys={this.state.checkedKeys}
              handleCheck={this.handleTree}
              loading={this.props.treeLoading}
            />
          </Card>
        </Col>
        <Col span={15}>
          <Card style={{ marginBottom: "10px", textAlign: "right" }}>
            <Button
              type="primary"
              size="small"
              onClick={() =>
                this.props.dispatch(
                  routerRedux.push(
                    `/lesson/3/lesson-info?lessonId=${this.state.lessonId}`
                  )
                )
              }
            >
              返回
            </Button>
          </Card>
          <Card bordered={false} style={{ minHeight: heightTwoMain }}>
            <Spin tip="Loading..." spinning={this.state.detailInfoLoading}>
              {this.state.content.map((c, i) => {
                return (
                  <div key={i}>
                    <div style={{ marginBottom: "6px" }}>
                      <Row>
                        <Col span={22}>
                          <Katex value={c.content} />
                        </Col>
                        <Col span={2} style={{ textAlign: "right" }}>
                          <span>
                            <a
                              href="javascript:;"
                              onClick={() => this.handlePageLine(c, 1)}
                              hidden={c.pageMark === 1}
                            >
                              在此处分页
                            </a>
                            <a
                              href="javascript:;"
                              onClick={() => this.handlePageLine(c, 0)}
                              hidden={c.pageMark === 0}
                            >
                              取消分页
                            </a>
                          </span>
                        </Col>
                      </Row>
                    </div>
                    <div className={this.getStyleContent(c.type)}>
                      <div hidden={c.type !== 5} className="coursewareTable">
                        <Row>
                          <Col span={12} style={{ fontSize: "15px" }}>
                            <strong>例题</strong>
                          </Col>
                          <Col span={12} style={{ textAlign: "right" }}>
                            <a
                              href="javascript:;"
                              onClick={() => this.showQuesitonModal(c, 1)}
                            >
                              添加
                            </a>
                          </Col>
                        </Row>
                        <Table
                          columns={this.columns()}
                          dataSource={c.demoQuestions}
                          showHeader={false}
                          size="small"
                          pagination={false}
                          expandedRowRender={this.expandedRowRender}
                          components={this.components}
                          onRow={(record, index) => ({
                            index,
                            moveRow: (dragIndex, hoverIndex) =>
                              this.moveRow(
                                dragIndex,
                                hoverIndex,
                                c.demoQuestions,
                                1
                              )
                          })}
                        />
                        <Row>
                          <Col span={12} style={{ fontSize: "15px" }}>
                            <strong>习题</strong>
                          </Col>
                          <Col span={12} style={{ textAlign: "right" }}>
                            <a
                              href="javascript:;"
                              onClick={() => this.showQuesitonModal(c, 2)}
                            >
                              添加
                            </a>
                          </Col>
                        </Row>
                        <Table
                          columns={this.columns()}
                          dataSource={c.testQuestions}
                          showHeader={false}
                          size="small"
                          pagination={false}
                          components={this.components}
                          onRow={(record, index) => ({
                            index,
                            moveRow: (dragIndex, hoverIndex) =>
                              this.moveRow(
                                dragIndex,
                                hoverIndex,
                                c.testQuestions,
                                2
                              )
                          })}
                        />
                      </div>
                    </div>
                    <div hidden={c.pageMark === 0}>
                      <Divider className={styles.hrLine} />
                    </div>
                  </div>
                );
              })}
            </Spin>
          </Card>
          <Card style={{ textAlign: "right" }} bordered={false}>
            <button
              type="primary"
              className="ant-btn ant-btn-primary"
              // style={{marginRight: '20px'}}
              onClick={this.preview}
            >
              预览
            </button>
            {/*<Button type="primary" onClick={this.save} loading={this.props.saveLoading}>保存</Button>*/}
          </Card>
        </Col>

        <TableModal
          visible={this.state.visible}
          onClickModal={this.questionModalCancel}
          onClickSubmit={this.questionModalOk}
          dataSource={questionListInfo}
          getPageData={this.getQuestionPage}
          defaultRows={data}
          defaultRowChange={this.handleRowChange}
          getQuestionList={this.getQuestionList}
        />

        <LessonPreview
          visible={this.state.previewShow}
          setMarkLines={this.setMarkLines.bind(this)}
          breakContent={this.breakContent.bind(this)}
          onClose={this.closePreview}
          toggleMarkLines={this.toggleMarkLines.bind(this)}
          expandedRowRender={this.expandedRowRender}
          save={this.save}
          dataSource={this.state.content}
        />
      </PageHeaderLayout>
    );
  }
}

const Demo = DragDropContext(HTML5Backend)(CoursewareConfig);
export default Demo;
