// 引入应用配置
import { createAction, Storage, ToastUtils } from '../../../utils';
import { verifyjwt, getChildUsersByApp, getUserName, getEncryptedStringByAppe, getUserId } from '../services/subAccounts';
import { cacheConfig } from '../../../config';
/**
 * 用户 Model
 */
const subAccountsModel = {
  namespace: 'subAccounts',
  state: {
    userInfo: null,
  },

  effects: {
    /**
     * 校验长效票据接口
     */
    *verifyjwt({ payload }, { call, put, select }) {
      const jwt = yield select(state => {
        if (state.user.smsDoAuthInfo) {
          return state.user.smsDoAuthInfo.body.jwt
        } else {
          return state.user.userInfo.body.jwt
        }
      });
      payload = {
        "appId": "padappportal",
        jwt
      }
      const result = yield call(verifyjwt, payload);
      console.log('----校验长效票据接口----', result)
      return result
    },

    /**
     * 选择子账户
     */
    *chooseSubAccounts({ payload }, { call, put, select }) {
      console.log('-------选择子账户------',)
      const jwt = yield select(state => {
        if (state.user.smsDoAuthInfo) {
          return state.user.smsDoAuthInfo.body.jwt
        } else {
          return state.user.userInfo.body.jwt
        }
      });

      // 获取随机码
      const EncryptedStringParams = {
        appId: 'padappportal',
        jwt
      }
      const EncryptedStringInfo = yield call(getEncryptedStringByAppe, EncryptedStringParams);
      let encryptedString = '';
      if (EncryptedStringInfo.status == 'success') {
        encryptedString = EncryptedStringInfo.body.encryptedString
        console.log('----获取随机码成功--- 参数和随机码---', EncryptedStringParams, encryptedString)

      } else {
        ToastUtils.show(EncryptedStringInfo.message);
        console.log('----获取随机码失败----', EncryptedStringInfo)
        return;
      }

      //校验随机码并获取长期票据接口
      const UserNameParams = {
        device: "web",
        encryptedString
      }
      const UserNameInfo = yield call(getUserName, UserNameParams);
      let userNamejwt = '';
      if (UserNameInfo.status == 'success') {
        userNamejwt = UserNameInfo.body.jwt
      } else {
        ToastUtils.show(UserNameInfo.message);
        return;
      }

      //获取应用系统登录名
      const childUsersByAppParams = {
        childUsersByAppParams: { ssoAppId: "oa" },
        headers: {
          jwt: userNamejwt,
          appId: 'padappportal',
        }
      }
      const childUsersByAppInfo = yield call(getChildUsersByApp, childUsersByAppParams);
      let childUsersList = null;
      if (childUsersByAppInfo.status == 'success') {
        childUsersList = childUsersByAppInfo.body
      } else {
        ToastUtils.show(childUsersByAppInfo.message);
        return;
      }
      // 返回更新后的 model 内容
      return childUsersList
    },
    /**
     * 根据登录名获取userid
     */
    *getUserId({ payload }, { call, put, select }) {
      const result = yield call(getUserId, payload);
      // 返回更新后的 model 内容
      yield put(createAction('saveUserId')(result));
      return result
    },
  },

  reducers: {
    /**
     * 保存短信验证码认证之后获取的jwt
     * @param {*} state 
     * @param {*} action 
     */
    saveDoAuthjwt(state, action) {
      return { ...state, smsDoAuthInfo: action.payload };
    },
    /**
       * 保存子账户和应用系统登录名信息
       * @param {*} state 
       * @param {*} action 
       */
    saveSubAccounts(state, action) {
      return { ...state, test: action.payload };
    },
    /**
     * 保存userid
     * @param {*} state 
     * @param {*} action 
     */
    saveUserId(state, action) {
      return { ...state, userIdInfo: action.payload };
    }
  },
};

export default subAccountsModel;
