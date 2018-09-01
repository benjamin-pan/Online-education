import React from 'react';
import { Tree,Tooltip,Button, Popconfirm, Popover,Spin } from 'antd';
import Ellipsis from '../Ellipsis';
import { getMathJax } from '../../utils/formatDataSource';


class MyImage extends React.Component {

  state = {
    isHover: true,
  };

  getImgStyle = (type) => {
    return {
      position: 'absolute',
      zIndex: '1',
      width: '100px',
      height: '100px',
      backgroundColor: '#335544',
      opacity: '0.6',
    }
  };
  getBgImg = () => {
    return {
      backgroundImage: `url(${this.props.url})`,
      backgroundSize: '100px 100px',
      backgroundColor: 'red',
      width: '100px',
      height: '100px',
      // display: 'inline',
    }
  }

  render() {
    const { url } = this.props;
    return (
      <span>
        <img src={url} width="100px" height="100px" />
      </span>
    );
  }
}
export default MyImage;

