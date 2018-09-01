import React from 'react';
import { Tree,Tooltip,Button, Popconfirm, Popover,Spin } from 'antd';
import Ellipsis from '../Ellipsis';
import { getMathJax } from '../../utils/formatDataSource';


class MyTree extends React.Component {

  componentDidMount(){

  }

  getTreeContent = (item) => {
    return (
      <Popover overlayStyle={{maxWidth:'400px'}}
               placement="right"
               trigger="hover"
               title={getMathJax(item.content)}>

        <span>{getMathJax(item.content,"style")}</span>
      </Popover>
    )
  };


  renderTreeNodes = (data) => {
    const TreeNode = Tree.TreeNode;
    return data.map((item) => {
      if (item.sons) {
        return (
          <TreeNode  title={this.getTreeContent(item)} key={item.uniqueKey}>
            {this.renderTreeNodes(item.sons)}
          </TreeNode>
        );
      }
      return  <TreeNode title={ this.getTreeContent(item) } key={item.uniqueKey} />;
    });
  }

  handleCheck = (checkedKeys, info) => {
    const totalKeys = [...info.halfCheckedKeys, ...checkedKeys];

    // 勾选 或者 未勾选
    const currentCheckStatus = info.checked;

    this.props.handleCheck(checkedKeys, totalKeys);
  }

  render() {

    const { dataSource, checkedKeys } = this.props;

    return (
      <div>
        <Spin tip="Loading..." spinning={this.props.loading}>
          <Tree checkable defaultExpandAll={false} onCheck={ this.handleCheck } checkedKeys={ checkedKeys }>
            { this.renderTreeNodes(dataSource) }
          </Tree>
        </Spin>
      </div>
    );
  }
}
export default MyTree;
