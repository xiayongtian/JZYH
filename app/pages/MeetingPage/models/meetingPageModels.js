
import { meetingList, meetingDetail } from '../services/meetingPage';
import { createAction } from '../../../utils';
/**
 * 会议详情 Model
 */
const meetingPageModels = {
  namespace: 'meetingPage',
  state: {
  },

  effects: {
    // 获取会议列表信息
    *meetingList({ payload }, { call, put, select }) {
      const response = yield call(meetingList, payload);
      return response
    },
    // 获取会议详情
    *meetingDetail({ payload }, { call, put, select }) {
      const response = yield call(meetingDetail, payload);
      const { baseInfo } = response.data
      // 更新 model 内容
      yield put(createAction('meetingDetailList')({ baseInfo }));
      return baseInfo      
    },
  },

  reducers: {
    /**
     * 更新会议详情
     * @param {state} state 原始 state
     * @param {action} action action，含返回数据信息
     */

    meetingDetailList(state, action) {
      const { payload } = action;
      // 更新会议详情信息
      return { ...state, ...payload };
    },
  },
};

export default meetingPageModels;
