import React from "react";
import { Tree, Button, Popconfirm, Popover, Modal, Table, Tag } from "antd";
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
    this.breakArr = [];
    this.breakPoint = {};
  }

  componentDidMount() {
    this.getPreviewBox();
  }

  closePreview = () => {
    this.props.breakContent(this.breakArr);
    this.props.onClose();
  };

  handlePageLine(value, index) {
    console.log(0);
    // this.props.handlePageLine(value, index);
  }

  getPreviewBox = () => {
    let timer = setTimeout(() => {
      this.previewBox = document.getElementById("previewBox");
      if (
        this.previewBox &&
        document.getElementsByClassName("page").length === 0
      ) {
        console.log("运行多次");
        this.createPage();
      } else this.getPreviewBox();
      clearTimeout(timer);
    }, 1000);
  };

  // 处理图片换行
  imgDispalyBlock(father) {
    let imgs = father.getElementsByTagName("img");
    for (let i = 0, l = imgs.length; i < l; i++) {
      imgs[i].style.display = "block";
    }
  }

  createPage() {
    let div = document.createElement("div");
    div.id = "page" + this.pageIndex;
    div.className = "page";
    // console.log(this.previewBox.append)
    // console.log(this.previewBox.appendChild)
    // this.previewBox.append(div);
    this.previewBox.appendChild(div);
    this.findFirstPageContent();
  }

  findFirstPageContent() {
    let maybePageContent = this.previewBox.getElementsByClassName(
      "pageContent"
    );
    let onePage = document.getElementById("page" + this.pageIndex);
    // console.log(this.pageIndex);
    let contentLength = maybePageContent.length;
    console.log("剩余数量：", contentLength);
    if (this.firstDomOfPage) {
      // onePage.append(this.firstDomOfPage);
      onePage.appendChild(this.firstDomOfPage);
      if (onePage.clientHeight > 596) {
        console.log("总数量：", this.props.dataSource.length);
        let index =
          this.props.dataSource.length -
          document.getElementsByClassName("pageContent").length -
          1;
        if (this.ifSame !== index) {
          this.ifSame = index;
          this.breakPoint = {
            index: index,
            breaks: []
          };
        }
        this.breakUpContent(onePage);
      } else {
        if (this.breakPoint.index !== undefined)
          this.breakArr.push(this.breakPoint);
        this.breakPoint = {};
      }
      // this.firstDomOfPage = null;
    }
    for (; contentLength > 0; ) {
      contentLength--;
      if (contentLength === 0) {
        this.finished();
      }
      if (maybePageContent[0] === undefined) continue;
      if (maybePageContent[0].className.indexOf("pageContent") > -1) {
        let pageContent = this.createPageContent(maybePageContent[0].innerHTML);
        // onePage.append(pageContent);
        onePage.appendChild(pageContent);
        this.imgDispalyBlock(onePage);
        // console.log(onePage.clientHeight)
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

  createPageContent(cotent) {
    let pageContent = document.createElement("div");
    pageContent.innerHTML = cotent;
    pageContent.style.margin = "0";
    pageContent.className = "pageContent" + this.contentIndex;
    this.contentIndex++;
    return pageContent;
  }

  breakUpContent(father) {
    let needOpration = father.getElementsByClassName("needOpration")[0]
      .children[0];
    if (needOpration.children.length > 0) {
      let nextPage = [];
      // console.log(this.contentIndex)
      for (let i = 0; ; ) {
        i++;
        let needRemove = needOpration.innerHTML.lastIndexOf("<span>");
        nextPage.unshift(needOpration.innerHTML.substring(needRemove));
        // console.log(needOpration.innerHTML.substring(needRemove))
        needOpration.innerHTML = needOpration.innerHTML.substring(
          0,
          needRemove
        );
        // console.log(father.clientHeight);
        if (father.clientHeight <= 596) {
          let breaks = this.breakPoint.breaks;
          if (breaks.length > 0) breaks.push(breaks[breaks.length - 1] + i);
          else breaks.push(i);
          let pageContent = document.createElement("p");
          pageContent.innerHTML = nextPage.join("");
          pageContent.style.margin = "0";
          pageContent.className = "needOpration";
          this.pageIndex++;
          this.firstDomOfPage = this.createPageContent(pageContent.outerHTML);
          // console.log(this.firstDomOfPage);
          this.createPage();
          // this.breakArr.push({
          //   index:this.contentIndex-i,
          //   breaks:breakPoints
          // })
          break;
        }
      }
    }
  }

  finished() {
    // this.imgDispalyBlock();
    this.hidePage();
    this.showPage();
    document.getElementById("total").innerHTML = this.pageIndex + 1;
    this.props.setMarkLines(this.markLines);
    [...document.getElementsByClassName("personBreaks")].map(val => {
      val.onclick = () => {
        console.log(val.getAttribute("data-pageMark"));
        if (Number(val.getAttribute("data-pageMark")) === 0) {
          val.parentNode.style.height = "1px";
          val.innerHTML = "取消分页线";
          val.setAttribute("data-pageMark", "1");
        } else {
          val.parentNode.style.height = "0px";
          val.innerHTML = "设置分页线";
          val.setAttribute("data-pageMark", "0");
        }
        this.props.toggleMarkLines(Number(val.getAttribute("data-index")));
      };
    });
    // console.log(this.breakArr);
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
    if (this.pageId < this.pageIndex) {
      this.hidePage();
      this.pageId++;
      this.showPage();
    }
  }

  getDoms(value, index) {
    if (value.key === "1") {
      return (
        <div className={style.content_1}>
          <p
            className={`${style.paginationLine} ${
              value.pageMark === 1 ? style.show : style.hide
            }`}
          >
            <a
              className={`${style.paginationLineAction} personBreaks`}
              href="javascript:;"
              data-index={index}
              data-pageMark={value.pageMark}
            >
              {value.pageMark === 1 ? "取消分页线" : "设置分页线"}
            </a>
          </p>
        </div>
      );
    } else if (value.key.split("_").length === 2) {
      return (
        <div className={style.content_2}>
          <Katex value={value.content} />
          <p
            className={`${style.paginationLine} ${
              value.pageMark === 1 ? style.show : style.hide
            }`}
          >
            <a
              className={`${style.paginationLineAction} personBreaks`}
              href="javascript:;"
              data-index={index}
              data-pageMark={value.pageMark}
            >
              {value.pageMark === 1 ? "取消分页线" : "设置分页线"}
            </a>
          </p>
        </div>
      );
    } else if (value.key.split("_").length === 3) {
      return (
        <div className={style.lines}>
          {/*<p className={style.content_3}>知识点</p>*/}
          <p style={{ fontSize: "10px" }} className={"needOpration"}>
            <Katex value={value.content} />
            <p
              className={`${style.paginationLine} ${
                value.pageMark === 1 ? style.show : style.hide
              }`}
            >
              <a
                className={`${style.paginationLineAction} personBreaks`}
                href="javascript:;"
                data-index={index}
                data-pageMark={value.pageMark}
              >
                {value.pageMark === 1 ? "取消分页线" : "设置分页线"}
              </a>
            </p>
          </p>
        </div>
      );
    } else if (value.key.split("_").length === 4) {
      return (
        <div className={style.lines}>
          {/*<p className={style.content_4}>方法</p>*/}
          <p style={{ fontSize: "10px" }} className={"needOpration"}>
            <Katex value={value.content} />
            <p
              className={`${style.paginationLine} ${
                value.pageMark === 1 ? style.show : style.hide
              }`}
            >
              <a
                className={`${style.paginationLineAction} personBreaks`}
                href="javascript:;"
                data-index={index}
                data-pageMark={value.pageMark}
              >
                {value.pageMark === 1 ? "取消分页线" : "设置分页线"}
              </a>
            </p>
          </p>
        </div>
      );
    } else {
      return (
        <div className={style.lines}>
          {/*<p className={style.content_5}>题型</p>*/}
          <p style={{ fontSize: "10px" }} className={"needOpration"}>
            <Katex value={value.content} />
            <p
              className={`${style.paginationLine} ${
                value.pageMark === 1 ? style.show : style.hide
              }`}
            >
              <a
                className={`${style.paginationLineAction} personBreaks`}
                href="javascript:;"
                data-index={index}
                data-pageMark={value.pageMark}
              >
                {value.pageMark === 1 ? "取消分页线" : "设置分页线"}
              </a>
            </p>
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
          {this.props.dataSource.map((c, i) => {
            return (
              <div key={i}>
                <div className={`pageContent`} style={{ marginBottom: "6px" }}>
                  <p className={"needOpration"}>
                    <Katex value={c.content} />
                  </p>
                </div>
                {c.demoQuestions.map((val, index) => {
                  return (
                    <div className={`pageContent`}>
                      <Katex value={val.stem} />
                      {(val.answerVoList.length > val.analysisVoList.length
                        ? val.answerVoList
                        : val.analysisVoList
                      ).map((value, index) => {
                        return (
                          <div
                            data-parent={i}
                            data-child={index}
                            className={"needOpration"}
                          >
                            <p data-parent={i} data-child={index}>
                              答案：
                              <Katex
                                value={
                                  (val.answerVoList[index] || {}).content || ""
                                }
                              />
                            </p>
                            <p data-parent={i} data-child={index}>
                              解题：
                              <Katex
                                value={
                                  (val.analysisVoList[index] || {}).content ||
                                  ""
                                }
                              />
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
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
