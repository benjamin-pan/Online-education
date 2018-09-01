import { message   } from 'antd';
import { getLessonList,
         getTeacherLessonInfo,
         getLessonInfoDetail,
         getLessonInfoConfig,
         getKjConfig,
         questionList,
         coursewareAdd,
         removeCourse,saveBk,
         initCourseware,
         getLessonInfo,
         getLessonFeedBackInfo,
         getStudentFeedBackInfo,
         saveLessonInfo,
         saveFeedBackDetail,
         finishFeedBackAction,
         saveUnMathScore,
         coursewareTreeCheck,
         coursewareQuestionDel,
      } from '../services/api';
import { formatLessonInfo, formatStudentInfo, formatConfig, myMessage, } from '../utils/formatDataSource';


export default {
  namespace: 'lesson',

  state: {
    dataSource: [],
    lessonInfo: [],
    pagination:{
      total: 0,
    },
    studentInfo: {
      data: [],
      total: 15,
    },
    configInfo: {
      courseware: {},
      error: {},
      homework: {},
      inExam: {},
      outExam: {},
      currentLessonStatus: 0,
      exam: {},
    },
    treeList: [],
    questionListInfo: {
      questionList: [],
      total: 0,
    },
    initCourse: {},
    lessonFeedBackVo:{},
    studentFeedBackVo:[],
    operateCourseware: [],
  },

  effects: {
    *lessonInfo({ payload }, { call, put }) {
      const response = yield call(getLessonInfo, payload);
      yield put({
        type: 's_lessonInfo',
        payload: response,
      });
     },
    *saveBk({ payload }, { call, put }){
      const response = yield call(saveBk, payload);
      yield put({
        type: 's_saveBk',
        payload: response,
      });
    },
    *getList({ payload }, { call, put }){
      const response = yield call(getLessonList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *getTeacherInfo({ payload, callback }, { call, put }) {
      const response = yield call(getTeacherLessonInfo, payload);
      yield put({
        type: 'saveTeacher',
        payload: response,
      });
    },
    *getLessonInfoDetail({ payload, callback }, { call, put }) {
      const response = yield call(getLessonInfoDetail, payload);
      yield put({
        type: 'saveInfoDetail',
        payload: response,
      });
     },
    *getInfoConfig({ payload, callback }, { call, put }) {
      const response = yield call(getLessonInfoConfig, payload);
      yield put({
        type: 'saveConfig',
        payload: response,
      });
    },
    *kjConfig({ payload, callback }, { call, put }) {
      const response = yield call(getKjConfig, payload);
      yield put({
        type: 'saveKjConfig',
        payload: response,
      });
    },
    *questionList({ payload, callback }, { call, put }) {
      const response = yield call(questionList, payload);
      yield put({
        type: 'saveQuestionList',
        payload: response,
      });
    },
    *coursewareAdd({ payload, callback }, { call, put }){
      const response = yield call(coursewareAdd, payload);
      yield put({
        type: 'saveCoursewareAdd',
        payload: response,
      });
    },
    *removeCourse({ payload, callback }, { call, put }){
      const response = yield call(removeCourse, payload);
      yield put({
        type: 'saveRemoveCourse',
        payload: response,
      });
     },
    *initCourseware({ payload, callback }, { call, put }){
      const response = yield call(initCourseware, payload);
      yield put({
        type: 'saveInitCourseware',
        payload: response,
      });
    },
    *getLessonFeedBackInfo({ payload,callback }, { call, put }){
      const response = yield call(getLessonFeedBackInfo, payload);
      yield put({
        type: 'g_getLessonFeedBackInfo',
        payload: response.data,
      });
    },
    *getStudentFeedBackInfo({ payload ,callback}, { call, put }){
      const response = yield call(getStudentFeedBackInfo, payload);
      yield put({
        type: 'g_getStudentFeedBackInfo',
        payload: response,
      });
    },
    *saveLessonInfo({ payload,callback }, { call, put }){
      const response = yield call(saveLessonInfo, payload);
      yield put({
        type: 's_saveLessonInfo',
        payload: response,
      });
    },
    *saveFeedBackDetail({ payload,callback }, { call, put }){
      const response = yield call(saveFeedBackDetail, payload);
      yield put({
        type: 's_saveFeedBackDetail',
        payload: response,
      });
    },
    *finishFeedBackAction({ payload,callback }, { call, put }){
          const response = yield call(finishFeedBackAction, payload);
          yield put({
              type: 'finishFeedBack',
              payload: response,
          });
    },
    *saveUnMathScore({ payload,callback }, { call, put }){
      const response = yield call(saveUnMathScore, payload);
      yield put({
          type: 's_saveUnMathScore',
          payload: response,
      });
    },
    *coursewareTreeCheck({ payload,callback }, { call, put }){
      const response = yield call(coursewareTreeCheck, payload);
      yield put({
          type: 's_coursewareTreeCheck',
          payload: response,
      });
    },
    *coursewareQuestionDel({ payload,callback }, { call, put }){
      const response = yield call(coursewareQuestionDel, payload);
      yield put({
          type: 's_coursewareQuestionDel',
          payload: response,
      });
    },
  },

  reducers: {
    s_lessonInfo(state, action) {
      if(action.payload){
        const { data } = action.payload;
        state.lessonInfo = data;
      }
      return {
        ...state,
      };
    },
    s_saveBk(state, action) {
      if(action.payload.status === 0) {
        myMessage.success("备课状态更新成功", 2);
      }
      else {
        myMessage.error(action.payload.errorMsg, 2);
      }
      return {
        ...state,
      };
    },
    save(state, action) {
      if(action.payload) {
        const response = action.payload.data;
        const { lessonInfoList = [] } = response;
        state.dataSource = formatLessonInfo(lessonInfoList);
        state.pagination.total = response.total;
      }
      return {
        ...state,
      };
    },
    saveTeacher(state, action) {
      if(action.payload) {
        state.teacherInfo = {
          needToClass: action.payload.data.needToClass,
          needToPreview: action.payload.data.needToPreview,
          needToComment: action.payload.data.needToComment,
          needToCorrect: action.payload.data.needToCorrect,
          classCount: action.payload.data.classCount,
        };
      }
      return {
        ...state,
      };
    },
    saveInfoDetail(state, action) {
      if(action.payload) {
        const { data = [] } = action.payload.data;
        state.studentInfo.data = formatStudentInfo(data);
        state.studentInfo.total = action.payload.total;
      }
      return {
        ...state,
      };
    },
    saveConfig(state, action) {
      if(action.payload) {
        const { data = [] } = action.payload;
        state.configInfo = formatConfig(data);
      }
      return {
        ...state,
      };
    },
    saveKjConfig(state, action){
      if(action.payload) {
        const { data = [] } = action.payload;
        state.treeList = data;
        data.map((d, i) => {
          d.content = `第${i+1}章-${d.content}`;
          if(d.sons) {
            d.sons.map((ds, i) => {
              ds.content = `第${i+1}节-${ds.content}`;
            });
          }
        });
      }
      return {
        ...state,
      };
    },
    saveQuestionList(state, action){
      if(action.payload) {
        const qList = action.payload.data.data;
        state.questionListInfo.questionList = qList;
        state.questionListInfo.total = action.payload.data.total;
      }
      return {
        ...state,
      };
    },
    saveCoursewareAdd(state, action){
      const { data } = action.payload;
      if( data === 1){
        myMessage.success("保存成功", 2);

      }
      else {
        myMessage.error("保存失败", 2);
      }
      return {
        ...state,
      };
    },
    saveRemoveCourse(state, action) {
      myMessage.success("删除成功", 2);
      return {
        ...state,
      };
    },
    saveInitCourseware(state, action) {
      if(action.payload) {
        const initCourse = action.payload.data;
        return {
          ...state,
          initCourse,
        };
      }
      else {
        return {
          ...state,
        };
      }
    },
    g_getLessonFeedBackInfo(state, action){
      const data = action.payload;
        state.lessonFeedBackVo =data||{};
        return {
            ...state,
        };
    },
    g_getStudentFeedBackInfo(state, action){
        state.studentFeedBackVo = action.payload.data||[];
        return {
            ...state,
        };
    },
    s_saveLessonInfo(state,action){
        const data  = action.payload;
        state.lessonFeedBackVo.id = data.data;
        myMessage.success("保存成功",3);
        return {
            ...state,
        };
    },
    s_saveFeedBackDetail(state,action){
        const data = action.payload;
        if(data && data.data){
          myMessage.success("保存成功",3);
        }
        return {
            ...state,
        };
    },
    finishFeedBack(state,action){
        const data = action.payload;
        if( data.data == 1){
          myMessage.success("保存成功", 2);
        }
        else {
          myMessage.error("保存失败", 2);
        }
        return {
            ...state,
        };
    },
    s_saveUnMathScore(state,{ payload }){
      const { status } = payload;
      if(status === 0) {
        myMessage.success('提交成功', 2);
      }
      else {
        myMessage.error(payload.errorMsg, 2);
      }
      return {
          ...state,
      };
    },
    s_coursewareTreeCheck(state,{ payload }){
      console.log(payload)
      if(payload) {
        state.operateCourseware = payload.data;
      }
      return {
          ...state,
      };
    },
    s_coursewareQuestionDel(state,{ payload }){
      console.log(payload)
      return {
          ...state,
      };
    },
  },
};


