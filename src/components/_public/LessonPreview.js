import React from 'react';
import { Tree, Button, Popconfirm, Popover, Modal } from 'antd';

// import $ from 'jquery';

import style from './LessonPreview.less';

import { getMathJax, imageUri, katexShow } from '../../utils/formatDataSource';

class LessonPreview extends React.Component {
  componentDidMount() {}

  _m1 = () => {
    return [
      {
        title: '第一章第一章第一章',
        content:
        '第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合' +
        '第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合' +
        '第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合' +
        '第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合第一章知识点与集合',
        type: 1,
        q_1: [],
        q_2: [],
      },
      {
        title: '第一节第一节第一节',
        content: '内容内容内容内容内容内容内容内容',
        type: 2,
        q_1: [],
        q_2: [],
      },
      {
        title: '知识点一',
        content: '内容内容内容内容内容内容内容内容',
        type: 3,
        q_1: [],
        q_2: [],
      },
      {
        title: '方法一',
        content: '内容内容内容内容内容内容内容内容',
        type: 4,
        q_1: [],
        q_2: [],
      },
      {
        title: '题型一',
        content: '内容内容内容内容内容内容内容内容',
        type: 5,
        q_1: [
          // 例题
          {
            stem: '我是题干',
            type: 1, // 题目类型 1：选择题 2：填空题 3：简答题
            optionList: [],
            analysisList: [],
            answerList: [],
          },
          {
            stem: '我是题干',
            type: 1, // 题目类型 1：选择题 2：填空题 3：简答题
            optionList: [],
            analysisList: [],
            answerList: [],
          },
        ],
        q_2: [
          // 习题
          {
            stem: '我是题干',
            type: 1, // 题目类型 1：选择题 2：填空题 3：简答题
            optionList: [],
            analysisList: [],
            answerList: [],
          },
        ],
      },
    ];
  };

  _m2 = () => {};

  _m3 = () => {
    this.props.onOk();
  };

  _m4 = () => {
    this.props.onCancel();
  };


  render() {
    const data = this._m1();
    const { visible, dataSource } = this.props;

    return (
      <Modal visible={visible} title="预览课件" width="70%" onOk={this._m3} onCancel={this._m4}>
        <div style={{ width: '530px', height: '700px', backgroundColor: 'green' }} id="test">
          <div style={{ margin: '0px 20px' }}>
            <div style={{ fontSize: '20px', textAlign: 'center' }}>
              第一章知识点与集合第一章知识点与集合第一章知识点与集合
            </div>
          </div>
        </div>
        <span
          id="ruler"
          style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'nowrap',
            zIndex: '-100',
          }}
        >
          test
        </span>
      </Modal>
    );
  }
}
export default LessonPreview;
