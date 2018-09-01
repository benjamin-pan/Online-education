import { Modal } from 'antd';

import MathJax from 'react-mathjax-preview-ext';
import 'katex/dist/katex.min.css';
// 线上
export const imageUri = 'http://116.62.66.158/pic/';
export const baseUri = '//116.62.66.158:8080/';


// 本地
// export const imageUri = 'D:\\company\\image\\tree\\';
// export const baseUri = '//localhost:8080/';

export const minHeight = '920px';
export const heightTwoMain = '755px';
export const heightTwoOther = '82px';

export const heightThreeMain = '675px';
export const heightThreeOhter = '122.5px';

export const myMessage = {
  success: (msg, time) => {
    const modal = Modal.success({
      content: msg,
    });
    setTimeout(() => modal.destroy(), time * 1000);
  },
  error: (msg, time) => {
    const modal = Modal.error({
      content: msg,
    });
    setTimeout(() => modal.destroy(), time * 1000);
  }
};


export function success(msg, time) {
  const modal = Modal.success({
    content: msg,
  });
  setTimeout(() => modal.destroy(), time * 1000);
}

/**
 * 获取默认的屏幕最小高度
 */
export function getScreenHeight () {
  return {
    minHeight: '920px',
  }
}

export function formatLessonInfo(data) {

  const response = data.map((_, i) => (
    {
      key: _.id,
      date: dateFormat('date', _.lessonDate),
      timeBetween: dateFormat('time', _.timeFrom) + ' - ' + dateFormat('time', _.timeTo),
      kemu: subjectEnum(_.subject),
      class: _.lessonName,
      studentCount: _.studentCount,
      campus: _.campus,
      lessonType: lessonTypeEnum(_.type),
      lessonStatus: lessonStatusEnum(_),
      statusId: setLessonStatus(_),
      isHaveHomework:_.isHaveHomework,
      noMathStatus: setNoMathStatus(_),
      subject: _.subject,
    }
  ));
  return response;
}

export  function formatStudentInfo(data) {

  const response = data.map((value, index) => {
      return {
        key: value.studentId,
        id: value.studentId,
        studentName: value.studentName,
        classLevel: value.classLevel,
        sex: value.sex,
        lastScore: value.lastScore === '' ? '--- --' : value.lastScore,
        kq: value.lastCheck === 1 ? <span style={{ color: 'green' }}>Y</span> : <span style={{ color: 'red' }}>N</span>,
        checkLevel: value.checkLevel,
        kq_id: value.lastCheck,
      }
  })
  return response;
}
export function getParamUrl(urlParam) {
  let paramJson = urlParam.replace('?', '');
  let paramArr = paramJson.split('&');
  let result = {

  };
  paramArr.map(value => {
    let one = value.split('=');
    result[one[0]] = one[1];
  });
  return result;
}

export function deepClone(obj){
  if(!obj) {
    return obj;
  }
  var newObj= obj instanceof Array?[]:{};
  for(var i in obj){
     newObj[i]=typeof obj[i]=='object'?
     deepClone(obj[i]):obj[i];
  }
  return newObj;
}

export function formatDate(data) {
  return {
    formatDateStr : dateFormat('date', data.date) + " "
              +dateFormat('time', data.timeFrom) + ' - '
              + dateFormat('time', data.timeTo),
    lessonStatus: lessonStatusEnum(data.lessonStatus),
    bkStatus: lessonStatusEnum(data.lessonStatus) === '未备课' ? '未备课' : '已备课',
    subject: subjectEnum(data.subject),
    students: data.students.map(s => s.name).join("、"),
  }
}

export function formatConfig(data) {
  return {
   courseware: data.courseware,
   error: data.error,
   homework: data.homework,
   inExam: data.inExam,
   outExam: data.outExam,
   currentLessonStatus: data.lessonStatus,
   exam: data.exam,
  }
}

export function setCookie(c_name, value, expiredays) {
  let exdate = new Date();
  exdate.setTime(Number(exdate) + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

export function clearCookie(name) {
  setCookie(name, "", -1);
}

/**
 *
 * @param {*String} native 内容
 * @param {*} style 参数有值时，内容根据宽度固定，超出显示...
 */
export function getMathJax(native,style, width,className) {
  if(native) {
    const res = native.replace(/\\\[|\\\]/gi,"$");
    let cssStyle = {};
    let styleUri = imageUri;
    if(style){
        width = width ? width : '200px';
        cssStyle = {maxWidth:'100%',width:width,overflow: 'hidden', whiteSpace: 'nowrap',textOverflow: 'ellipsis'};
        styleUri = null;
    }

    return (
      <MathJax math={res} className={className} picUrl={styleUri} style={cssStyle} />
    )
  }
  else{
    return '';
  }
}

export function isIntNum(value) {
  if(/[0-9]+$/g.test(value)){
    return true;
  }else{
    return false;
  }
}

export function getUniqueKey(n) {
  var rnd="";
    for(var i=0;i<n;i++)
        rnd+=Math.floor(Math.random()*10);
    return rnd;
}

function setLessonStatus(item) {
  if(item.subject === 1) {
    return item.classStatus;
  }
  else {
    if(item.actualClassTime === 0) {
      return 1;
    }
    else if(item.classStatus === 5) {
      return 5;
    }
    else {
      return 4;
    }
  }
}

function dateFormat(type, dateStr) {

    let date = new Date(dateStr);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let hours = date.getHours();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }

    if(type === 'date') {
      return year + '-' + month + '-' + strDate;
    }
    else {
      return sup(hours) + ': 00';
    }

}

function sup ( n ) { return (n<10) ? '0'+n : n; }

/**
 * 科目类型枚举
 * @param value 整型数值
 * @returns {*} 对应的中文字符串
 */
export function subjectEnum(value) {
    switch(value) {
      case 1:
        return '数学';
      case 2:
        return '语文';
      case 3:
        return '英语';
      case 4:
        return '物理';
      case 5:
        return '化学';
      case 6:
        return '生物';
      case 7:
        return '地理';
      case 8:
        return '历史';
      case 9:
        return '政治';
      default:
        return '其它';
    }
}

/**
 * 课程类型枚举
 * @param value
 * @returns {*}
 */
function lessonTypeEnum(value) {
  switch(value) {
    case 1:
      return '普通课';
    case 2:
      return '错题课';
    case 3:
      return '考试课';
    default:
      return '其它';
  }
}

function setNoMathStatus(item) {
  const { subject, classStatus,actualClassTime } = item;
  if(subject !== 1) {
    if(actualClassTime === 0) { // 未上课
      return 0;
    }
    else if(classStatus === 5) { // 已上完课，评价完
      return 2;
    }
    else {  // 已上课，未评价
      return 1;
    }
  }
  else {
    return -1;
  }
}

/**
 * 课程状态枚举
 * @param value
 * @returns {*}
 */
function lessonStatusEnum(item) {
  const { subject, classStatus,actualClassTime } = item;
  if(subject === 1) {
    switch(classStatus) {
      case 0:
        return '未备课';
      case 1:
        return '未上课';
      case 2:
        return '上课中';
      case 3:
        return '未批改';
      case 4:
        return '未评价';
      case 5:
        return '已完成';
      default:
        return '其它';
    }
  }
  else {
    if(actualClassTime === 0) {
      return '未上课';
    }
    else if(classStatus === 5) {
      return '已完成';
    }
    else {
      return '未评价';
    }
  }

}
