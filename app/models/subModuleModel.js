import {getUpdateInfo} from '../services/updateService';

/**
 * 子模块 Model
 */
const subModuleModel = {
  namespace: 'subModule',
  state: {},
  effects: {
    /**
     * 读取文字配置
     */
    *getUpdateInfo(action, {call}) {
      // console.warn("subModuleModel getUpdateInfo")
      const {payload} = action;
      // 请求数据
      const response = yield call(getUpdateInfo, payload);
      // console.warn("subModuleModel getUpdateInfo result=",response)
      return response;
    },
  },
  reducers: {},
};

export default subModuleModel;
