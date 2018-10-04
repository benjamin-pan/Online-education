import React from "react";
import { InlineMath, BlockMath } from "react-katex";
import { imageUri } from "../../utils/formatDataSource";
import MyImage from "./MyImage";

class Katex extends React.Component {
  render() {
    const { value } = this.props;
    if (!value) {
      return value;
    }

    const valueAction = value.replace(/\\\[|\\\]/gi, "$");
    const valueArr = valueAction.match(/\$[^\$]+\$|[^$]+/g) || [];
    return (
      <span class="addBR">
        {valueArr.map((v, i) => {
          if (/\$[^\$]+\$/g.test(v)) {
            const nativeStr = v.replace(/\$/g, "").replace(/align/g, "aligned");
            return <InlineMath key={i}>{String.raw`${nativeStr}`}</InlineMath>;
          } else {
            const images = v.match(
              /\#\{((?!\#\{).)+\}|((?!\#\{((?!\#\{).)+\}).)+/g
            );
            return images.map((img, i) => {
              if (/\#\{((?!\#\{).)+\}/g.test(img)) {
                const demo = img.replace("#{", "").replace("}", "");
                return <MyImage url={imageUri + demo} key={i} />;
              } else {
                return img;
              }
            });
          }
        })}
      </span>
    );
  }
}
export default Katex;
