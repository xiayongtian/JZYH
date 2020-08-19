
import { openFile } from '../services/openFile';
import { createAction } from '../../../utils';
/**
 * 会议详情 Model
 */
const meetingPageModels = {
  namespace: 'file',
  state: {
    jsonObj: null
  },

  effects: {
    // 查看附件
    *attchmentFile({ payload }, { call, put, select }){
      // console.log('baseInfo,baseInfo = ', payload);
      const response = yield call(openFile, payload);
    //   const { baseInfo } = response.data;
      console.log('baseInfo,baseInfo = ', response);
      // 更新 model 内容
      yield put(createAction('fileDetail')({ response }));
      return yield select(state => { console.log('-----state', state.file.jsonObj.response); return state.file.jsonObj.response });
    //   return baseInfo
    }
  },

  reducers: {
    /**
     * 更新会议详情
     * @param {state} state 原始 state
     * @param {action} action action，含返回数据信息
     */
    fileDetail(state, action) {
      const { payload } = action;
      console.log('openFileModels ,payload = ', payload);
      // 更新会议详情信息
      return { ...state,jsonObj: payload };
    },
  },
};

export default meetingPageModels;
