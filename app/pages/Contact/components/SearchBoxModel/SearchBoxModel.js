import { createAction } from "../../../../utils";
import { getDelPortalContact } from "../../../../services/approvalDetailService";

/**
 * 人员搜索 Model
 */
const searchModel = {
  namespace: "search",

  state: {
    peopleSearchResults: [], //人员搜索结果
    peopleSearchResultsResultCount: 0,
    statePerson: 'tree',
  },
  effects: {
    /**
     * 人员搜索结果
     * @param payload
     * @param call
     * @param put
     * @returns {IterableIterator<*>}
     */
    *getDelPortalContact({ payload }, { call, put, select }) {
      const res = yield call(getDelPortalContact, payload);
      console.log(payload,res, "获取智慧会务列表页图片");
      yield put(createAction("updategetDelPortalContact")({ res, payload }));
      const searchState = yield select(state => state.search);
      return searchState;
    },
  },

  reducers: {
    updategetDelPortalContact(state, action) {
      console.log("banner", state, action);
      let {
        payload: { res }
      } = action;

      let peopleSearchResults = [];
      let peopleSearchResultsResultCount = 0;
      if (res.ResultCode == "0") {
        res.Data.map(item => {
          peopleSearchResults.push(item)
        });
        peopleSearchResultsResultCount = res.Data.length;
        if (peopleSearchResultsResultCount > 15) peopleSearchResults = peopleSearchResults.slice(0,15)
      }
      return {
        ...state,
        peopleSearchResults: peopleSearchResults,
        peopleSearchResultsResultCount: peopleSearchResultsResultCount
      };
    },
    updategetDelPortalstate(state, action) {
      console.log("banner", state, action);
      return {
        ...state,
        statePerson: action.payload.statePerson,
        portalstate: action.payload.portalstate,
      };
    },
  }
};

export default searchModel;
