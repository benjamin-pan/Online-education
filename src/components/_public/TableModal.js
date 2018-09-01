/* eslint-disable class-methods-use-this */
/**
 * Created by zhouhuan on 2018/5/15.
 */
import React from 'react';
import MathJax from 'react-mathjax-preview-ext'

import { Modal, Button, Table,Tag,message,Radio,Row, Col  } from 'antd';

import { katexShow } from '../../utils/formatDataSource';

class TableModal extends React.Component {

  state = {
    loading: false,
    hard: '-1',
    use: '-1',
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount = () => {

  };

  handleChange = (value) => {
    const {current: page, pageSize } = value;

    const { hard, use } = this.state;

    // 获取分页数据
    this.props.getPageData(page, pageSize, hard, use);

  }

  handleOk = () => {

    const { selectedRows = [], selectedRowKeys } = this.state;

    const { defaultRows:{data} } = this.props;


    if(selectedRows.length === 0) {
      message.warn('未选择任何题目', 2);
      return ;
    }

    this.props.onClickModal(false);
    this.props.onClickSubmit(selectedRows, selectedRowKeys);

    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      hard: '-1',
      use: '-1',
    });

  };

  handleCancel = () => {

    this.props.onClickModal(false);

    this.setState({
      selectedRowKeys: [],
      hard: '-1',
      use: '-1',
    });
  };
  handleStem = (stem) =>{
      const  regxRule = /\$\{(.*)\}/gi;
      const stemMath = stem.props;
      let  stemMathStr =  stemMath;
      while (regxRule.exec(stemMathStr)){
        console.log(RegExp.$1);
        stemMathStr = stemMathStr.replace("\${"+RegExp.$1+"\}","<img src='http://mpic.tiankong.com/474/ee4/474ee4eae7c56bb86c8e51a1f02a1278/640.jpg@!670w'");
      }
      return stem
  }

  columns() {
    const columns = [{
      title: 'stem',
      dataIndex: 'stem',
      key: 'stem',
      width: '90%',
      render: (value) => {
         let abc = value.replace(/\\\[|\\\]/gi,"$");
        const imageUrl = "http://116.62.66.158/pic/";
        return (
         <MathJax math={abc} picUrl={imageUrl} />
        )
      }
    }, {
      title: '操作',
      key: 'action',
      width: '10%',
      render: (text) => {

        const { defaultRows:{data:defaultRows} } = this.props;
        const show = defaultRows.indexOf(text.id) > -1 ? true : false;

        return (
        <Row>
          <Col span={12}> <Tag color="#2db7f5" hidden={!(text.recommend === 2)}>推荐</Tag></Col>
          <Col span={12}>
            <Tag color="#f50" hidden={show}>未选</Tag>
            <Tag color="#87d068" hidden={!show}>已选</Tag>
          </Col>
        </Row>
        )
      },
    }];
    return columns;
  }

  getTotal = () => {
    const { dataSource } = this.props;
    const total = dataSource !== undefined ? dataSource.total : 3;
    return total;
  };

  paramChange1 = (e) => {

    const hard = e.target.value;

    const { use } = this.state;

    this.props.getQuestionList(hard, use);
    this.setState({
      hard,
    });
  }

  paramChange2 = (e) => {
    const use = e.target.value;

    const { hard } = this.state;

    this.props.getQuestionList(hard, use);
    this.setState({
      use,
    });
  };

  onRow = (record) => {
    const { defaultRows:{data: defaultRows } } = this.props;

    return {
      onClick: ()=>{
        const exist = defaultRows.filter(d => d === record.id);
        const { selectedRows } =this.state;
        let arr = [];
        let rows = [];
        if(exist.length === 0) {
          arr = [...defaultRows];
          arr.push(record.id);
          rows = [...selectedRows];
          rows.push(record);
        }
        else {
          arr = defaultRows.filter(d => d !== record.id);
          rows = selectedRows.filter(d => d.id !== record.id);
        }
        this.props.defaultRowChange(arr);
        this.setState({
          selectedRows: rows,
          selectedRowKeys: arr,
        });
      }
    }
  };

  render() {

    const RadioButton = Radio.Button;
    const RadioGroup = Radio.Group;

    const { visible, dataSource, defaultRows:{data: defaultRows, page=1} } = this.props;

    const { loading, selectedRowKeys } = this.state;

    const rowSelection = {

      selectedRowKeys: defaultRows,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log("change...");
        console.log(selectedRowKeys,selectedRows)
        this.props.defaultRowChange(selectedRowKeys);
        this.setState({
          selectedRows,
          selectedRowKeys,
        });
      },
    };
    return (
      <div>
        <Modal
          visible={visible}
          title="请选择添加题目"
          width="70%"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              确认(已选{defaultRows.length})
            </Button>,
          ]}
        >
          <div>
            <RadioGroup onChange={this.paramChange1} value={this.state.hard}  size="small">
              <RadioButton value="-1">全部</RadioButton>
              <RadioButton value="1">容易</RadioButton>
              <RadioButton value="2">中等</RadioButton>
              <RadioButton value="3">困难</RadioButton>
            </RadioGroup>
          </div>
          <div>
            <RadioGroup onChange={this.paramChange2} value={this.state.use}  size="small">
              <RadioButton value="-1">全部</RadioButton>
              <RadioButton value="0">用过</RadioButton>
              <RadioButton value="1">精品</RadioButton>
              <RadioButton value="2">推荐</RadioButton>
            </RadioGroup>
          </div>
          <Table
            columns={this.columns()}
            dataSource={dataSource.questionList}
            rowSelection={rowSelection}
            showHeader={false}
            onChange={this.handleChange}
            onRow={this.onRow}
            pagination={{
              current: page,
              total: this.getTotal(),
              showTotal() {
                return (
                  <span>共 <a style={{ color: '#1893ab' }}>{dataSource.total}</a> 道</span>
                );
              },
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default TableModal;
