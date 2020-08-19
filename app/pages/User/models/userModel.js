// 引入应用配置
import { createAction, Storage, ToastUtils } from '../../../utils';
import { checkLoginName,logout, sendVerificationCode, smsDoAuth } from '../services/login';
import { cacheConfig } from '../../../config';
/**
 * 用户 Model
 */
const userModel = {
  namespace: 'user',
  state: {
    userInfo: null,
  },

  effects: {
    // 读取缓存中用户信息
    *readCachedUserInfo({ payload }, { call, put }) {
      // 获取用户信息缓存
      const cachedUserInfo = yield Storage.get(cacheConfig.user.USER_INFO);
      console.log('Storage.get ,cachedUserInfo = ', cachedUserInfo);
      yield put(
        createAction('updateUserInfo')({
          userInfo: cachedUserInfo,
        }),
      );
    },
    /**
     * 校验登录名
     */
    *checkLoginName({ payload }, { call, put, select }) {
      console.log('login---', payload);
      // 返回登录名信息
      const response = yield call(checkLoginName, payload);
      // 更新 model 内容
      yield put(createAction('saveLoginNameInfo')(response));
      yield put(createAction('saveUsername')(payload));
      // saveUsername
      // 返回更新后的 model 内容
      return yield select(state => { console.log('-----state', state); return state.user.loginNameInfo });
    },
    /**
     * 发送验证码
     */
    *sendVerificationCode({ payload }, { call, put, select }) {
      const response = yield call(sendVerificationCode, payload);
      // 更新 model 内容
      yield put(createAction('saveVerificationCode')(response));
      // 返回更新后的 model 内容
      return yield select(state => { console.log('-----state', state); return state.user.verificationCod });
    },

    /**
     * 短信验证码认证
     */
    *smsDoAuth({ payload }, { call, put, select }) {
      const username = yield select(state => { return state.user.username });
      payload.username = username;
      const response = yield call(smsDoAuth, payload);
      // 更新 model 内容
      yield put(createAction('saveDoAuthjwt')(response));

      let result = null;
      if (response.status == 'success') {
        // 登录成功
        // 获取用户信息成功，缓存用户信息及登录状态
        yield call(Storage.set, cacheConfig.user.USER_INFO, response);
        result = {
          isLogin: true,
          from: 'login',
        };
        // 缓存登录状态
        yield call(Storage.set, cacheConfig.user.IS_LOGIN, true);
      } else {
        // 缓存登录状态
        result = {
          isLogin: false,
          from: 'login',
        };
        yield call(Storage.set, cacheConfig.user.IS_LOGIN, false);

      }
      yield put(createAction('updateUserInfo')(result));
      // 返回更新后的 model 内容
      return yield select(state => { return state.user.smsDoAuthInfo });
      // return yield select(state => { console.log('-----state', state); return state.user.smsDoAuthInfo });
    },

    /**
     * 退出登录
     */
    *logout({ payload }, { call, put }) {
      // const response = yield call(logout, payload);

      // 设置登录状态为登出
      yield call(Storage.set, cacheConfig.user.IS_LOGIN, false);
      yield call(Storage.remove, cacheConfig.user.USER_INFO);
      const result = {
        isLogin: false,
        userInfo: null,
      };
      // 更新 model 内容
      yield put(createAction('updateUserInfo')(result));
    },
  },

  reducers: {
    /**
     * 用户信息
     * @param {state} state 原始 state
     * @param {action} action action，含返回数据信息
     */
    updateUserInfo(state, action) {
      const { payload } = action;
      console.log('updateUserInfo, payload = ', payload);
      // 更新用户信息
      return { ...state, ...payload };
    },
    /**
     * 保存电话信息
     * @param {*} state 
     * @param {*} action 
     */
    saveLoginNameInfo(state, action) {
      return { ...state, loginNameInfo: action.payload };
    },
    /**
     * 保存短信验证码信息
     * @param {*} state 
     * @param {*} action 
     */
    saveVerificationCode(state, action) {
      return { ...state, verificationCod: action.payload };
    },
    /**
     * 保存短信验证码认证之后获取的jwt
     * @param {*} state 
     * @param {*} action 
     */
    saveDoAuthjwt(state, action) {
      return { ...state, smsDoAuthInfo: action.payload };
    },
    saveUsername(state, action) {
      return { ...state, username: action.payload };
    },

  },
};

export default userModel;
