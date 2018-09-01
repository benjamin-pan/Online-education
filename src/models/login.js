import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { setAuthority, setUser } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

import { setCookie, myMessage } from '../utils/formatDataSource';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginUser',
        payload: response,
      });
      // Login successfully
      console.log(response)
      if (response.status === 0) {
        setUser(response.data);
        setCookie("JSESSIONID", response.data.token, 2*60*60*1000); // 120分钟
        reloadAuthorized();
        yield put(routerRedux.push('/manage/home'));
      }
      else {
        myMessage.error("用户名密码错误");
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.data.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    changeLoginUser(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
