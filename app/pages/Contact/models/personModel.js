import { createAction } from "../../../utils";
import {
  getPersonDetail
} from "../../../services/contactsServices";

import LoadingUtils from "../../../utils/LoadingUtils";

const contactsPersonDetail = {
  namespace: "contactsPersonDetail",
  state: {
    //人员 ID
    personId: "2191",
    // 人员详细信息
    person: null,
  },

  effects: {
    *getPersonDetail({ payload }, { call, put, select }) {
      console.log("====================123");
      const res = yield call(getPersonDetail, payload);
      console.log("====================456", res);
      yield put(createAction("updatePersonInfo")(res));
      LoadingUtils.hide();
      return yield select(newState => newState)
    }
  },

  reducers: {
    /**
     * 修改当前人员详情页的人员 ID
     * @param state 前一版本的 state
     * @param payload 传过来的人员 ID
     */
    updatePersonId(state, { payload }) {
      return {
        ...state,
        personId: payload
      };
    },
    /**
     * 将服务端的数据 存放到 dva 中
     * @param state
     * @param payload
     */
    updatePersonInfo(state, {payload}) {
      console.log("获取人员信息详情结果", payload);
      if (payload.ResultCode !== "0" || !payload.Data.Person) {
        return state;
      }
      const person = payload.Data.Person;
      return {
        ...state,
        person,
      };
    }
  }
};

export default contactsPersonDetail;
