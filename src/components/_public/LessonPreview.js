import React from "react";
import { Tree, Button, Popconfirm, Popover, Modal } from "antd";
import style from "./LessonPreview.less";
import { getMathJax, imageUri, katexShow } from "../../utils/formatDataSource";
import Katex from "../../components/_public/Katex";

class LessonPreview extends React.Component {
  constructor(props) {
    super(props);
    this.contentIndex = 0;
    this.pageIndex = 0;
    this.previewBox = null;
    this.firstDomOfPage = null;
    this.pageId = 0;
    this.prePage = this.prePage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.markLines = [];
  }

  closePreview = () => {
    this.props.onClose();
  };

  componentDidMount() {
    this.getPreviewBox();
  }

  getPreviewBox = () => {
    let timer = setTimeout(() => {
      this.previewBox = document.getElementById("previewBox");
      // && document.getElementsByClassName('page').length === 0
      if (this.previewBox) this.createPage();
      else this.getPreviewBox();
      clearTimeout(timer);
    }, 1000);
  };

  // 处理图片换行
  imgDispalyBlock() {
    let imgs = document.getElementsByTagName("img");
    console.log(imgs);
    for (let i = 0, l = imgs.length; i < l; i++) {
      imgs[i].style.display = "block";
    }
  }

  createPage() {
    // this.imgDispalyBlock();
    let div = document.createElement("div");
    div.id = "page" + this.pageIndex;
    div.className = "page";
    console.log(this.previewBox.append);
    console.log(this.previewBox.appendChild);
    // this.previewBox.append(div);
    this.previewBox.appendChild(div);
    this.findFirstPageContent();
  }

  findFirstPageContent() {
    let maybePageContent = this.previewBox.children;
    let onePage = document.getElementById("page" + this.pageIndex);
    let contentLength = maybePageContent.length;
    if (this.firstDomOfPage) {
      // onePage.append(this.firstDomOfPage);
      onePage.appendChild(this.firstDomOfPage);
      this.firstDomOfPage = null;
    }
    for (; contentLength > 0; ) {
      contentLength--;
      if (contentLength === 0) {
        this.finished();
      }
      if (maybePageContent[0].className.indexOf("pageContent") > -1) {
        let pageContent = document.createElement("div");
        pageContent.innerHTML = maybePageContent[0].innerHTML;
        pageContent.style.margin = "0";
        pageContent.className = "pageContent" + this.contentIndex;
        this.contentIndex++;
        // onePage.append(pageContent);
        onePage.appendChild(pageContent);
        maybePageContent[0].remove();
        if (onePage.clientHeight > 596) {
          this.markLines.push(this.contentIndex - 2);
          this.firstDomOfPage = pageContent;
          this.pageIndex++;
          this.createPage();
        }
      }
    }
  }

  finished() {
    this.hidePage();
    this.showPage();
    document.getElementById("total").innerHTML = this.pageIndex + 1;
    this.props.setMarkLines(this.markLines);
  }

  hidePage() {
    let pages = document.getElementsByClassName("page");
    for (let l = pages.length, i = 0; i < l; i++) {
      pages[i].style.display = "none";
    }
  }

  showPage() {
    document.getElementById("page" + this.pageId).style.display = "block";
    document.getElementById("activePage").innerHTML = this.pageId + 1;
  }

  prePage() {
    if (this.pageId > 0) {
      this.hidePage();
      this.pageId--;
      this.showPage();
    }
  }

  nextPage() {
    console.log(this.pageIndex);
    console.log(this.pageId);
    if (this.pageId < this.pageIndex) {
      this.hidePage();
      this.pageId++;
      this.showPage();
    }
  }

  getDoms(value) {
    if (value.key === "1") {
      return (
        <div className={style.content_1}>
          <Katex value={value.content} />
        </div>
      );
    } else if (value.key.split("_").length === 2) {
      return (
        <div className={style.content_2}>
          <Katex value={value.content} />
        </div>
      );
    } else if (value.key.split("_").length === 3) {
      return (
        <div>
          <p className={style.content_3}>知识点</p>
          <p style={{ fontSize: "10px" }}>
            <Katex value={value.content} />
          </p>
        </div>
      );
    } else if (value.key.split("_").length === 4) {
      return (
        <div>
          <p className={style.content_4}>方法</p>
          <p style={{ fontSize: "10px" }}>
            <Katex value={value.content} />
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <p className={style.content_5}>题型</p>
          <p style={{ fontSize: "10px" }}>
            <Katex value={value.content} />
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        style={{
          top: 0,
          padding: "60px 30px",
          background: "#404042",
          borderRadius: "20px"
        }}
        bodyStyle={{ padding: "12px 14px" }}
        width="513px"
        wrapClassName={style.myModal}
        // title="预览课件"
        footer={null}
        closable={false}
        onOk={this.closePreview}
        onCancel={this.closePreview}
      >
        <div
          id="previewBox"
          style={{
            padding: "12px",
            width: "429px",
            height: "596px",
            background: "#f0f4f7"
          }}
        >
          {this.props.dataSource.map((value, index) => {
            return (
              <div className={`pageContent`} key={index}>
                {this.getDoms(value)}
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              textAlign: "center",
              width: "405px"
            }}
          >
            <Button type="primary" onClick={this.prePage}>
              上一页
            </Button>
            <span style={{ margin: "10px" }}>
              第<span id={"activePage"}>1</span>/<span id={"total"} />页
            </span>
            <Button type="primary" onClick={this.nextPage}>
              下一页
            </Button>
          </div>
          <div
            onClick={this.closePreview}
            style={{
              position: "absolute",
              bottom: "-48px",
              left: "203px",
              width: "40px",
              height: "40px",
              borderRadius: "20px",
              background: "#CCCCCC",
              cursor: "pointer"
            }}
          />
        </div>
        {/*<span*/}
        {/*id="ruler"*/}
        {/*style={{*/}
        {/*position: 'absolute',*/}
        {/*visibility: 'hidden',*/}
        {/*whiteSpace: 'nowrap',*/}
        {/*zIndex: '-100',*/}
        {/*}}*/}
        {/*>*/}
        {/*test*/}
        {/*</span>*/}
      </Modal>
    );
  }
}

export default LessonPreview;
