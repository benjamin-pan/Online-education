import React from 'react';
import { Tree,Tooltip,Button, Popconfirm, Popover,Spin } from 'antd';

import { InlineMath, BlockMath } from 'react-katex';

import { imageUri } from '../../utils/formatDataSource';

import MyImage from './MyImage';

class Katex extends React.Component {

  render() {
    const { value } = this.props;
    if(!value){
        return value;
    }

    const valueAction = value.replace(/\\\[|\\\]/gi,'$');
    // const respnse = value.match(/#\{((?!#\{).)*\}/g);
    // if(respnse) { // 替换所有图片
    //   respnse.map(r => {
    //     const demo = r.replace("#{","").replace("}", "");
    //     value = value.replace(r, `<img src="${imageUri + demo}" width="100px" height="100px" />`);
    //   });
    // }
    const valueArr = valueAction.match(/\$[^\$]+\$|[^$]+/g);

    return (
        <span>
          {
            valueArr.map((v, i) => {
              if(/\$[^\$]+\$/g.test(v)){
                const nativeStr = v.replace(/\$/g, '').replace(/align/g,'aligned');
                // const next = nativeStr.match(//g);
                return (
                  <InlineMath key={i}>{String.raw`${nativeStr}`}</InlineMath>
                )
              }
              else {
                const images = v.match(/\#\{((?!\#\{).)+\}|((?!\#\{((?!\#\{).)+\}).)+/g);
                return images.map((img, i) => {
                  if(/\#\{((?!\#\{).)+\}/g.test(img)) {
                    const demo = img.replace("#{","").replace("}", "");
                    return <MyImage url={imageUri + demo} key={i}/>
                  }
                  else {
                    return img;
                  }
                });

              }

            })
          }
        </span>
      );
  }
}
export default Katex;

