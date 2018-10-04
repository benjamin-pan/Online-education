import React from "react";
import {
  Tree,
  Button,
  Popconfirm,
  Popover,
  Modal,
  Table,
  Tag,
  Spin
} from "antd";
import style from "./LessonPreview.less";
import {
  deepClone,
  getMathJax,
  imageUri,
  katexShow
} from "../../utils/formatDataSource";
import Katex from "../../components/_public/KatexForPreview";

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
    this.save = this.save.bind(this);
    this.markLines = [];
    this.breakArr = [];
    this.breakPoint = {};
    this.newData = [];
    this.maxPageHeight = 510;
    this.str = "";
    this.maybePageContent = null;
    this.contentLength = 0;
    this.index = 0;
    this.time = 0;
    this.timer = null;
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.getPreviewBox();
  }

  componentDidUpdate() {
    this.getPreviewBox();
  }

  closePreview = () => {
    this.previewBox.innerHTML = "";
    this.props.onClose();
  };

  getPreviewBox = () => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      this.previewBox = document.getElementById("previewBox");
      if (
        this.previewBox &&
        this.previewBox.getElementsByClassName("page").length === 0
      ) {
        if (!this.props.visible) return;
        this.resetData();
        this.previewBox = document.getElementById("previewBox");
        this.maybePageContent = document
          .getElementById("getDom")
          .getElementsByClassName("pageContent");
        this.contentLength = this.maybePageContent.length;
        this.createPage();
      } else {
        this.getPreviewBox();
      }
    }, 1000);
  };

  resetData() {
    this.contentIndex = 0;
    this.pageIndex = 0;
    this.previewBox = null;
    this.firstDomOfPage = null;
    this.pageId = 0;
    this.markLines = [];
    this.breakArr = [];
    this.breakPoint = {};
    this.newData = [];
    this.maybePageContent = null;
    this.index = 0;
    this.time = 0;
  }

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
    this.previewBox.appendChild(div);
    this.findFirstPageContent();
  }

  findFirstPageContent() {
    let onePage = document.getElementById("page" + this.pageIndex);
    if (this.firstDomOfPage) {
      onePage.appendChild(this.firstDomOfPage);
      this.setBR(onePage);
      if (onePage.clientHeight > this.maxPageHeight) {
        let index = this.index;
        if (this.ifSame !== index) {
          this.ifSame = index;
          this.breakPoint = {
            index: index - 1,
            breaks: []
          };
        }
        this.breakUpContent(onePage);
      } else {
        if (this.breakPoint.index !== undefined)
          this.breakArr.push(this.breakPoint);
        this.breakPoint = {};
      }
    }
    for (; this.contentLength > 0; ) {
      this.contentLength--;
      if (this.maybePageContent[this.index] === undefined) continue;
      if (
        this.maybePageContent[this.index].className.indexOf("pageContent") > -1
      ) {
        let pageContent = this.createPageContent(
          this.maybePageContent[this.index].innerHTML
        );
        onePage.appendChild(pageContent);
        this.imgDispalyBlock(onePage);
        let ifMarkLine =
          this.maybePageContent[this.index].getAttribute("data") === "1";
        this.index++;
        this.setBR(onePage);
        if (onePage.clientHeight > this.maxPageHeight) {
          this.firstDomOfPage = pageContent;
          this.pageIndex++;
          this.createPage();
        } else if (ifMarkLine) {
          this.pageIndex++;
          this.createPage();
        }
      }
      if (this.contentLength === 0) {
        this.finished();
        break;
      }
    }
  }

  createPageContent(content) {
    let pageContent = document.createElement("div");
    content += `<p class="${style.paginationLine} borderTop"}><a class="${
      style.paginationLineAction
    } changeTest" href="javascript:;">在此处分页</a></p>`;
    pageContent.innerHTML = content;
    pageContent.style.margin = "0";
    pageContent.className = "pageCont pageContent" + this.contentIndex;
    this.contentIndex++;
    return pageContent;
  }

  breakUpContent(father) {
    let needOpration = father.getElementsByClassName("needOpration")[0]
      .children[0];
    if (needOpration.children.length > 0) {
      let nextPage = [];
      for (let i = 0; ; ) {
        i++;
        let needRemove = needOpration.innerHTML.lastIndexOf("<span>");
        nextPage.unshift(needOpration.innerHTML.substring(needRemove));
        needOpration.innerHTML = needOpration.innerHTML.substring(
          0,
          needRemove
        );
        this.setBR(father);
        if (father.clientHeight <= this.maxPageHeight) {
          let breaks = this.breakPoint.breaks;
          if (breaks.length > 0) breaks.push(breaks[breaks.length - 1] + i);
          else breaks.push(i);
          let pageContent = document.createElement("p");
          pageContent.innerHTML = nextPage.join("");
          pageContent.style.margin = "0";
          pageContent.className = "needOpration";
          this.pageIndex++;
          this.firstDomOfPage = this.createPageContent(pageContent.outerHTML);
          this.createPage();
          break;
        }
      }
    }
  }

  save() {
    [...document.getElementsByClassName("page")].map(val => {
      let pageCont = val.getElementsByClassName("pageCont");
      this.markLines.push(
        pageCont[pageCont.length - 1].className.split("pageContent")[1]
      );
    });
    let finillyData = this.breakContent();
    this.markLines.map(value => {
      finillyData[value].pageMark = 1;
    });
    [...document.getElementsByClassName("pageCont")].map((v, i) => {
      finillyData[i].page = Number(v.parentNode.id.split("page")[1]) + 1;
    });
    console.log(finillyData);
    // this.props.save(finillyData);
  }

  breakContent() {
    let arr = this.breakArr;
    console.log(this.breakArr);
    // TODO 拆分为方法
    let finishArr = [];
    let content = [...this.newData];
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
        needSplice.previous = true;
        if (j === 0) content[arr[i].index] = needSplice;
        else content.splice(arr[i].index + j, 0, needSplice);
      });
    }
    // 最终回传数据
    return content;
  }

  addEvent() {
    [...document.getElementsByClassName("personBreaks")].map(val => {
      val.onclick = () => {
        this.setState({ loading: true });
        if (Number(val.getAttribute("data-pageMark")) === 0) {
          this.setLine(val);
          this.moveDoms(val);
        } else {
          this.removeLine(val);
          this.preMoveDoms(val);
        }
        this.setState({ loading: false });
      };
    });
  }

  finished() {
    // this.imgDispalyBlock();
    this.getTotalPage();
    this.createMarkLines();
    this.hidePage();
    this.showPage();
    this.setState({ loading: false });
  }

  setBR(parent) {
    let isSpan = false;
    [...parent.getElementsByClassName("addBR")].map(val => {
      if (val.offsetWidth > 380) {
        [...val.childNodes].map(value => {
          if (value.tagName === "SPAN") {
            if (isSpan) {
              value.outerHTML = "<br>" + value.outerHTML;
            }
            isSpan = true;
          } else isSpan = false;
        });
      }
    });
  }

  createMarkLines() {
    this.markLines = [];
    [...document.getElementsByClassName("page")].map(value => {
      let pageCont = value.getElementsByClassName("pageCont");
      if (pageCont.length > 0) {
        try {
          this.markLines.push(
            pageCont[pageCont.length - 1].className.split("pageContent")[1]
          );
          [...pageCont].map(value => {
            this.removeLine(value);
          });
          let val = pageCont[pageCont.length - 1].getElementsByClassName(
            "personBreaks"
          )[0];
          this.setLine(val);
        } catch (e) {
          console.log(e);
        }
      }
    });
    this.addEvent();
  }

  setLine(val) {
    val.getElementsByClassName("borderTop")[0].style.borderTop =
      "1px solid #1890ff";
    val.getElementsByClassName("changeTest")[0].innerHTML = "取消分页";
    val.setAttribute("data-pageMark", "1");
  }

  removeLine(val) {
    val.getElementsByClassName("borderTop")[0].style.borderTop = "none";
    val.getElementsByClassName("changeTest")[0].innerHTML = "在此处分页";
    val.setAttribute("data-pageMark", "0");
  }

  computeHeigthAndMove(activePage, formNext) {
    let pages = [...document.getElementsByClassName("page")];
    let activePageId = Number(activePage.id.split("page")[1]);
    if (formNext) activePageId++;
    pages.map((val, index) => {
      if (Number(val.id.split("page")[1]) >= activePageId) {
        val.style.display = "block";
        let fatherBreak = false;
        for (let j = 1, k = pages.length; j < k; j++) {
          if (fatherBreak) {
            fatherBreak = false;
            break;
          }
          if (pages[index + j]) {
            for (;;) {
              let v = [
                ...pages[index + j].getElementsByClassName("pageCont")
              ][0];
              let pageHTML = val.innerHTML;
              if (v === undefined) break;
              val.innerHTML = val.innerHTML + v.outerHTML;
              if (val.clientHeight > this.maxPageHeight) {
                val.innerHTML = pageHTML;
                fatherBreak = true;
                break;
              } else {
                v.remove();
              }
            }
          }
        }
      }
    });
  }

  displayActivePage() {
    let pages = [...document.getElementsByClassName("page")];
    pages.map(val => {
      val.style.display = "block";
      if (val.clientHeight === 0) {
        val.remove();
      }
    });
    this.hidePage();
    this.showPage();
  }

  getTotalPage() {
    document.getElementById("total").innerHTML = [
      ...document.getElementsByClassName("page")
    ].length;
  }

  moveDoms(dom) {
    try {
      let pageContent = dom.parentNode;
      let parent = null;
      let index = 0;
      let needMoveStr = "";
      if (pageContent.className.indexOf("pageContent") > -1) {
        parent = pageContent.parentNode;
        index = pageContent.className.split("pageContent")[1];
      } else if (pageContent.parentNode.className.indexOf("pageContent") > -1) {
        parent = pageContent.parentNode.parentNode;
        index = pageContent.parentNode.className.split("pageContent")[1];
      }
      index = Number(index);
      [...parent.getElementsByClassName("pageCont")].map(val => {
        if (Number(val.className.split("pageContent")[1]) > index) {
          needMoveStr += val.outerHTML;
          val.remove();
        }
      });
      let parentIndex = Number(parent.id.split("page")[1]);
      [...document.getElementsByClassName("page")].map(val => {
        let nowIndex = Number(val.id.split("page")[1]);
        if (nowIndex > parentIndex) {
          val.id = "page" + (nowIndex + 1);
        }
      });
      let div = document.createElement("div");
      div.id = "page" + (parentIndex + 1);
      div.className = "page";
      div.innerHTML = needMoveStr;
      div.style.display = "none";
      document.getElementById("page" + parentIndex).outerHTML =
        document.getElementById("page" + parentIndex).outerHTML + div.outerHTML;
      this.computeHeigthAndMove(parent, true);
      this.displayActivePage();
      this.getTotalPage();
      this.createMarkLines();
    } catch (e) {
      console.log(e);
    }
  }

  preMoveDoms(dom) {
    try {
      let page = dom.parentNode.parentNode;
      this.computeHeigthAndMove(page);
      this.displayActivePage();
      this.getTotalPage();
      this.createMarkLines();
    } catch (e) {
      console.log(e);
    }
  }

  hidePage() {
    let pages = [...document.getElementsByClassName("page")];
    pages.map(val => {
      val.style.display = "none";
    });
  }

  showPage() {
    if (document.getElementById("page" + this.pageId) === null) return;
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
    if (this.pageId < [...document.getElementsByClassName("page")].length - 1) {
      this.hidePage();
      this.pageId++;
      this.showPage();
    }
  }

  getDoms(value, index) {
    let text =
      {
        7: "选项",
        8: "答案：",
        9: "分析："
      }[value.type] || "";
    if (Number(value.type) === 1) {
      return (
        <div
          className={`${style.content_1} personBreaks`}
          style={{ margingBottom: "24px" }}
          data-pageMark={0}
          data-index={index}
        >
          <Katex value={value.content} />
          <p className={`${style.paginationLine} borderTop`}>
            <a
              className={`${style.paginationLineAction} changeTest`}
              href="javascript:;"
            >
              在此处分页
            </a>
          </p>
        </div>
      );
    } else if (Number(value.type) === 2) {
      return (
        <div
          className={`${style.content_2} personBreaks`}
          style={{ margingBottom: "24px" }}
          data-pageMark={0}
          data-index={index}
        >
          <Katex value={value.content} />
          <p className={`${style.paginationLine} borderTop`}>
            <a
              className={`${style.paginationLineAction} changeTest`}
              href="javascript:;"
            >
              在此处分页
            </a>
          </p>
        </div>
      );
    } else {
      return (
        <div
          className={`${style.lines} personBreaks`}
          data-pageMark={0}
          data-index={index}
        >
          <div style={{ fontSize: "10px" }} className={"needOpration"}>
            <p
              style={{
                wordWrap: "break-word",
                wordBreak: "normal",
                margingBottom: "24px"
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  height: "100%",
                  lineHeight: "1"
                }}
              >
                {text}
              </span>
              <Katex value={value.content} />
            </p>
            <p className={`${style.paginationLine} borderTop`}>
              <a
                className={`${style.paginationLineAction} changeTest`}
                href="javascript:;"
              >
                在此处分页
              </a>
            </p>
          </div>
        </div>
      );
    }
  }

  render() {
    let myData = [...this.props.dataSource];
    myData = deepClone(myData);
    this.newData = [];
    myData.map(val => {
      let demoQuestions = [...val.demoQuestions];
      val.demoQuestions = [];
      val.pageMark = 0;
      this.newData.push(val);
      if (demoQuestions) {
        demoQuestions.map(value => {
          this.newData.push({
            content: value.stem,
            type: 6,
            pageMark: 0,
            innerQTid: val.id,
            innerQid: value.id,
            innerQType: value.type || null
          });
          let arrayLength = Math.max(
            value.answerVoList,
            value.analysisVoList,
            value.optionVoList
          );
          Array.of(arrayLength).map((v, i) => {
            if (value.optionVoList[i]) {
              this.newData.push({
                content: value.optionVoList[i].content,
                type: 7,
                pageMark: 0,
                innerQTid: val.id,
                innerQid: value.id,
                innerQType: value.type || null
              });
            }
            if (value.answerVoList[i]) {
              this.newData.push({
                content: value.answerVoList[i].content,
                type: 8,
                pageMark: 0,
                innerQTid: val.id,
                innerQid: value.id,
                innerQType: value.type || null
              });
            }
            if (value.analysisVoList[i]) {
              this.newData.push({
                content: value.analysisVoList[i].content,
                type: 9,
                pageMark: 0,
                innerQTid: val.id,
                innerQid: value.id,
                innerQType: value.type || null
              });
            }
          });
        });
      }
    });
    return (
      <Modal
        visible={this.props.visible}
        style={{
          top: 0,
          padding: "60px 30px",
          marginLeft: "200px",
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
        <Spin
          size="large"
          spinning={this.state.loading}
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%"
          }}
        />
        <div id="getDom" style={{ display: "none" }}>
          {this.newData.map((c, i) => {
            return (
              <div className={`pageContent`} key={i} data={c.pageMark}>
                {this.getDoms(c, i)}
              </div>
            );
          })}
        </div>
        <div
          id="previewBox"
          style={{
            padding: "12px",
            width: "429px",
            height: "596px",
            background: "#f0f4f7"
          }}
        >
          {/*{*/}
          {/*this.newData.map((c, i) => {*/}
          {/*return (*/}
          {/*<div className={`pageContent`} key={i} data={c.pageMark}>*/}
          {/*{*/}
          {/*this.getDoms(c, i)*/}
          {/*}*/}
          {/*</div>*/}
          {/*);*/}
          {/*})*/}
          {/*}*/}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            textAlign: "center",
            width: "405px",
            zIndex: "1000"
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
        <div
          style={{
            position: "absolute",
            bottom: "50%",
            left: "600px"
          }}
        >
          <p>
            <Button type="primary" onClick={this.save}>
              确定保存
            </Button>
          </p>
          <p>
            <Button type="primary" onClick={this.closePreview}>
              返回修改
            </Button>
          </p>
        </div>
      </Modal>
    );
  }
}

export default LessonPreview;
