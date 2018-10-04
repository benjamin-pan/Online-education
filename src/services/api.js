import { stringify } from "qs";
import request from "../utils/request";

export async function queryProjectNotice() {
  return request("/api/project/notice");
}

export async function queryActivities() {
  return request("/api/activities");
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request("/api/rule", {
    method: "POST",
    body: {
      ...params,
      method: "delete"
    }
  });
}

export async function addRule(params) {
  return request("/api/rule", {
    method: "POST",
    body: {
      ...params,
      method: "post"
    }
  });
}

export async function fakeSubmitForm(params) {
  return request("/api/forms", {
    method: "POST",
    body: params
  });
}

export async function fakeChartData() {
  return request("/api/fake_chart_data");
}

export async function queryTags() {
  return request("/api/tags");
}

export async function queryBasicProfile() {
  return request("/api/profile/basic");
}

export async function queryAdvancedProfile() {
  return request("/api/profile/advanced");
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request("/lesson/manage/login", {
    method: "POST",
    body: params
  });

  // return request('/api/login/account', {
  //   method: 'POST',
  //   body: params,
  // });
}

export async function fakeRegister(params) {
  return request("/api/register", {
    method: "POST",
    body: params
  });
}

export async function queryNotices() {
  return request("/api/notices");
}

export async function getLessonList(params) {
  return request(`/lesson/manage/lesson/list?${stringify(params)}`);
}
export async function saveUnMathScore(params) {
  return request("/lesson/manage/lesson/saveUnMath", {
    method: "POST",
    body: params
  });
}

export async function getTeacherLessonInfo(params) {
  return request(`/lesson/manage/lesson/teacher?${stringify(params)}`);
}
export async function getLessonInfoDetail(params) {
  return request(`/lesson/manage/lesson/info/detail?${stringify(params)}`);
}
export async function getLessonInfoConfig(params) {
  return request(`/lesson/manage/lesson/info/config?${stringify(params)}`);
}
export async function getKjConfig() {
  return request(`/lesson/manage/lesson/tree`);
}
export async function questionList(params) {
  return request(`/lesson/manage/lesson/question/list?${stringify(params)}`);
}

export async function questionListAll(params) {
  return request(
    `/lesson/manage/lesson/question/list/new?${stringify(params)}`
  );
}
export async function coursewareAdd(params) {
  return request("/lesson/manage/lesson/courseware/save", {
    method: "POST",
    body: params
  });
}
export async function saveLessen(params) {
  return request("/lesson/manage/lesson/courseware/save/new", {
    method: "POST",
    body: params
  });
}
export async function removeCourse(params) {
  return request("/lesson/manage/lesson/remove", {
    method: "POST",
    body: params
  });
}

export async function homeworkInfo(params) {
  return request(`/lesson/manage/question/students?${stringify(params)}`);
}

export async function saveQuestionList(params) {
  return request("/lesson/manage/question/saveList", {
    method: "POST",
    body: params
  });
}
export async function saveBk(params) {
  return request("/lesson/manage/lesson/saveBk", {
    method: "POST",
    body: params
  });
}
export async function checkQuestionList(params) {
  return request(`/lesson/manage/question/correct/list?${stringify(params)}`);
}

export async function correctHomework(params) {
  return request(`/lesson/manage/question/correct/do?${stringify(params)}`);
}

export async function completeHomework(params) {
  return request(`/lesson/manage/question/complete?${stringify(params)}`);
}

export async function homeworkUserInfo(params) {
  return request(`/lesson/manage/question/correct/info?${stringify(params)}`);
}

export async function examHeadInfo(params) {
  return request(`/lesson/manage/question/examHead/info?${stringify(params)}`);
}
export async function getErrorQuestions(params) {
  return request(`/lesson/manage/question/error?${stringify(params)}`);
}
export async function saveErrorCourse(params) {
  return request("/lesson/manage/question/error/save", {
    method: "POST",
    body: params
  });
}
export async function initCourseware(params) {
  return request(
    `/lesson/manage/lesson/courseware/history/new?${stringify(params)}`
  );
}
export async function getLessonInfo(params) {
  return request(`/lesson/manage/lesson/info?${stringify(params)}`);
}
export async function getLessonFeedBackInfo(params) {
  return request(`/lesson/manage/feedBack/lessonInfo?${stringify(params)}`);
}
export async function getStudentFeedBackInfo(params) {
  return request(`/lesson/manage/feedBack/studentInfo?${stringify(params)}`);
}
export async function saveLessonInfo(params) {
  return request(`/lesson/manage/feedBack/saveLessonInfo`, {
    method: "POST",
    body: params
  });
}
export async function saveFeedBackDetail(params) {
  return request("/lesson/manage/feedBack/saveFeedBackDetail", {
    method: "POST",
    body: params
  });
}
export async function finishFeedBackAction(params) {
  return request("/lesson/manage/feedBack/finishFeedBack", {
    method: "POST",
    body: params
  });
}
export async function getHistoryQuesion(params) {
  return request(
    `/lesson/manage/question/history/questions?${stringify(params)}`
  );
}

export async function searchTreeByTime(params) {
  return request(`/lesson/manage/question/search/tree?${stringify(params)}`);
}

export async function getExistPaper(params) {
  return request(`/lesson/manage/exam/exist?${stringify(params)}`);
}

export async function getRoleList(params) {
  return request(`/lesson/manage/role/list?${stringify(params)}`);
}

export async function getTeacherList(params) {
  return request(`/lesson/manage/role/list/teacher?${stringify(params)}`);
}

export async function getRoleJobs(params) {
  return request(`/lesson/manage/role/jobs?${stringify(params)}`);
}

export async function getRoleCampus(params) {
  return request(`/lesson/manage/role/campus?${stringify(params)}`);
}

export async function checkRole(params) {
  return request(`/lesson/manage/role/check?${stringify(params)}`);
}

export async function updateRoleStatus(params) {
  return request(`/lesson/manage/role/updateStatus?${stringify(params)}`);
}

export async function getRoleUserInfo(params) {
  return request(`/lesson/manage/role/userInfo?${stringify(params)}`);
}
export async function addRoleUser(params) {
  return request("/lesson/manage/role/addUser", {
    method: "POST",
    body: params
  });
}

export async function getList(params) {
  return request(`/lesson/manage/wordMark/list`, {
    method: "POST",
    body: params
  });
}

export async function addTree(params) {
  return request(`/lesson/manage/tree/add?${stringify(params)}`);
}

export async function removeTree(params) {
  return request(`/lesson/manage/tree/remove?${stringify(params)}`);
}

export async function getTreeList(params) {
  return request(`/lesson/manage/tree/list?${stringify(params)}`);
}

export async function getQuestionsByTypeId(params) {
  return request(`/lesson/manage/tree/questions?${stringify(params)}`);
}

export async function getCommonQuestionsByTypeId(params) {
  return request(`/lesson/manage/tree/commonQuestions?${stringify(params)}`);
}

export async function deleteTreeQuestions(params) {
  return request(`/lesson/manage/tree/deleteQuestions?${stringify(params)}`);
}

export async function updateTreeQuestion(params) {
  return request(`/lesson/manage/tree/updateQuestion`, {
    method: "POST",
    body: params
  });
}

export async function getFormulaToolbar(params) {
  return request(`/lesson/manage/tree/formula?${stringify(params)}`);
}

export async function updateDemoQuestion(params) {
  return request(`/lesson/manage/tree/setDemo?${stringify(params)}`);
}

export async function getWordDetail(params) {
  return request(`/lesson/manage/wordMark/detail`, {
    method: "POST",
    body: params
  });
}
export async function getTagList() {
  return request(`/lesson/manage/wordMark/tagList`);
}
export async function saveWordMark(params) {
  return request(`/lesson/manage/wordMark/markTag`, {
    method: "POST",
    body: params
  });
}
export async function checkWordMark(params) {
  return request(`/lesson/manage/wordMark/checkTagDetail`, {
    method: "POST",
    body: params
  });
}
export async function checkQuestionTag(params) {
  return request(`/lesson/manage/wordMark/checkQuestionTag`, {
    method: "POST",
    body: params
  });
}
export async function checkWordMarkFinal(params) {
  return request(`/lesson/manage/wordMark/checkWordMark`, {
    method: "POST",
    body: params
  });
}
export async function selectCheckResultCount(params) {
  return request(`/lesson/manage/wordMark/selectCheckResultCount`, {
    method: "POST",
    body: params
  });
}
export async function getAdministrationLessonList(params) {
  return request("/lesson/manage/lesson/lessonList", {
    method: "POST",
    body: params
  });
}
export async function getAdministrationClassList(params) {
  return request(`/lesson/manage/lesson/classList?${stringify(params)}`);
}
export async function getAdministrationTeacherList() {
  return request(`/lesson/manage/lesson/teacherList`);
}

export async function addAdminstrationnLesson(params) {
  return request(`/lesson/manage/lesson/addLessonDate`, {
    method: "POST",
    body: params
  });
}
export async function updateAdminstrationnLessonDate(params) {
  return request(`/lesson/manage/lesson/updateLessonDate`, {
    method: "POST",
    body: params
  });
}
export async function removeAdminstrationnLessonDate(params) {
  return request(`/lesson/manage/lesson/removeLesson?${params}`);
}
export async function updateAdminstrationnLessonTeacher(params) {
  return request(`/lesson/manage/lesson/updateLessonTeacher?${params}`);
}
export async function getAdminstrationnTeacherList(params) {
  return request(`/lesson/manage/lesson/similarLessonTeacher?${params}`);
}
export async function getCampusList() {
  return request(`/lesson/manage/lesson/campusList`);
}
export async function getClassInfoList(params) {
  return request(`/lesson/manage/lesson/classInfoList`, {
    method: "POST",
    body: params
  });
}
export async function addClassInfo(params) {
  return request(`/lesson/manage/lesson/addClassInfo`, {
    method: "POST",
    body: params
  });
}
export async function getClassLevelList() {
  return request(`/lesson/manage/lesson/classLevelList`);
}
export async function getStudentList(params) {
  return request(`/lesson/manage/lesson/studentList?${params}`);
}
export async function getSubjectList() {
  return request(`/lesson/manage/lesson/subjectList`);
}
export async function getClassInfoEdit(params) {
  return request(`/lesson/manage/lesson/classInfoUpdate?${params}`);
}
export async function updateClassInfo(params) {
  return request(`/lesson/manage/lesson/updateClassInfo`, {
    method: "POST",
    body: params
  });
}
export async function removeClassStuRef(params) {
  return request(`/lesson/manage/lesson/removeClassStudentRef?${params}`);
}
export async function getLessonCheckList(params) {
  return request(`/lesson/manage/lesson/lessonCheckingInfo`, {
    method: "POST",
    body: params
  });
}
export async function updateLessonCheck(params) {
  return request(`/lesson/manage/lesson/updateLessonCheck`, {
    method: "POST",
    body: params
  });
}
export async function clockStudentList(params) {
  return request(`/lesson/manage/lesson/clockStudentList?${params}`);
}
export async function getManageStudentList(params) {
  return request(`/lesson/manage/lesson/manageStudentList`, {
    method: "POST",
    body: params
  });
}
export async function addStudentClassTime(params) {
  return request(`/lesson/manage/lesson/addStudentClassTime`, {
    method: "POST",
    body: params
  });
}
export async function getStudentClassTimeDetail(params) {
  return request(`/lesson/manage/lesson/studentClassTimeDetail?${params}`);
}
export async function getTeacherClassTimeDetail(params) {
  return request(`/lesson/manage/lesson/teacherManageDetail`, {
    method: "POST",
    body: params
  });
}
export async function getTeacherManageTotalInfo(params) {
  return request(`/lesson/manage/lesson/getTeacherManageTotalInfo`, {
    method: "POST",
    body: params
  });
}
export async function exportStudentClassTime(params) {
  return request(`/lesson/manage/lesson/exportStudentClassTime`, {
    method: "POST",
    body: params
  });
}
export async function checkLesson(params) {
  return request(`/lesson/manage/lesson/checkLesson`, {
    method: "POST",
    body: params
  });
}
export async function batchAddLesson(params) {
  return request(`/lesson/manage/lesson/batchLesson`, {
    method: "POST",
    body: params
  });
}
export async function publishLesson(params) {
  return request(`/lesson/manage/lesson/publishLesson?${params}`);
}
export async function addWorkTime(params) {
  return request(`/lesson/manage/schedule/workTime`, {
    method: "POST",
    body: params
  });
}
export async function getTeacherWorkTime(params) {
  return request(`/lesson/manage/schedule/workTime?${stringify(params)}`);
}

// 评测管理   --start
export async function getPingCeValue(params) {
  return request(`/lesson/manage/pc/list?${stringify(params)}`);
}
export async function savePingCeValue(params) {
  return request(`/lesson/manage/pc/save`, {
    method: "POST",
    body: params
  });
}
export async function getAppPingCeValue(params) {
  return request(`/lesson/manage/pc/app/list?${stringify(params)}`);
}

// 评测管理   --end

// 学生管理  --start
export async function getStudentSources(params) {
  return request(`/lesson/manage/student/sources?${stringify(params)}`);
}
export async function saveStudentDetailInfo(params) {
  return request(`/lesson/manage/student/save`, {
    method: "POST",
    body: params
  });
}
export async function getInitStudentDetail(params) {
  return request(`/lesson/manage/student/detail?${stringify(params)}`);
}
export async function getMyLessonInfo(params) {
  return request(`/lesson/manage/student/lessonInfo?${stringify(params)}`);
}
export async function getMyErrorQuestions(params) {
  return request(`/lesson/manage/student/errors?${stringify(params)}`);
}
export async function getStudentLeaves(params) {
  return request(`/lesson/manage/student/leaves?${stringify(params)}`);
}
export async function getSubjectPingce(params) {
  return request(`/lesson/manage/student/pc?${stringify(params)}`);
}
export async function addNewScore(params) {
  return request(`/lesson/manage/student/addScore`, {
    method: "POST",
    body: params
  });
}
export async function getStudentRealityScores(params) {
  return request(`/lesson/manage/student/initScore?${stringify(params)}`);
}
export async function delStudentRealScore(params) {
  return request(`/lesson/manage/student/del?${stringify(params)}`);
}
export async function getStudentLevelInfo(params) {
  return request(`/lesson/manage/student/level?${stringify(params)}`);
}
export async function saveStudentLevelInfo(params) {
  return request(`/lesson/manage/student/level/save?${stringify(params)}`);
}
export async function delScoreImage(params) {
  return request(`/lesson/manage/student/img/del?${stringify(params)}`);
}
export async function getTotalClasses(params) {
  return request(`/lesson/manage/student/classes?${stringify(params)}`);
}
export async function getTotalStudents(params) {
  return request(`/lesson/manage/student/list?${stringify(params)}`);
}
export async function saveStudentSubject(params) {
  return request(`/lesson/manage/student/saveSubject?${stringify(params)}`);
}

// 学生管理  --end

export async function coursewareTreeCheck(params) {
  return request(`/lesson/manage/courseware/check`, {
    method: "POST",
    body: params
  });
}
export async function coursewareQuestionDel(params) {
  return request(`/lesson/manage/courseware/question/operate`, {
    method: "POST",
    body: params
  });
}
