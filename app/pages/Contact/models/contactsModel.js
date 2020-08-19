import { createAction, NavigationActions, Storage, LoadingUtils } from "../../../utils";
import {
  getErJiItems, // 获取所有机构列表
  getPortalContactListByUserCode, //获取收藏列表
  delPortalContact, //取消收藏人员
  addPortalContact, //收藏人员
  isExistPortalContact //根据人员ID判断是否已收藏
} from "../../../services/contactsServices";

/**
 * 通讯录 Model
 */
const contacts = {
  namespace: "contacts",
  state: {
    departmentList: [{}], // 部门列表
    organizationList: [], //所有机构列表
    lastVisitList: [], //最新访问数据
    rightEditClick: false, // 收藏夹 - 编辑按钮
    clickedItem: "tree", // 控制点击左侧菜单后，右侧的展示内容模块
    favoriteList: [], // 收藏夹 - 列表数据
    favoriteSelectAllBiaoshi: false, // 收藏夹 - 全选按钮
    // showRightTopList: 'yes'
    deleteButton: false //是否显示删除按钮
  },

  effects: {
    //获取收藏列表
    *getPortalContactListByUserCode({ payload }, { call, put }) {
      const params = ({ AppId, UserCode, SCode } = payload);
      const response = yield call(getPortalContactListByUserCode, params);
      yield put(
        createAction("reducegetPortalContactListByUserCode")({
          response
        })
      );
      return response;
    },
    //收藏人员
    *addPortalContact({ payload }, { call, put }) {
      const params = ({
        Company,
        ContractID,
        Department,
        DisplayName,
        ID,
        MName,
        MTelNo,
        Post,
        SCode,
        UserCode,
        Weight,
        appID,
        loginId,
        userid
      } = payload);
      const response = yield call(addPortalContact, params);
      yield put(
        createAction("reduceaddPortalContact")({
          response
        })
      );
      return response.ResultCode === "0";
    },
    //取消收藏
    *delPortalContact({ payload }, { call, put }) {
      const params = ({ ContractID, SCode, UserCode, appID, userid } = payload);
      const response = yield call(delPortalContact, params);
      yield put(
        createAction("reducedelPortalContact")({
          response
        })
      );
      return response.ResultCode === "0";
    },
    //根据人员ID判断是否已收藏
    *isExistPortalContact({ payload }, { call, put }) {
      const params = ({ AppId, UserCode, ContractID, SCode } = payload);
      const response = yield call(isExistPortalContact, params);
      yield put(
        createAction("reduceisExistPortalContact")({
          response
        })
      );
      return response.ResultCode === "0";
    },
    /**
     * 获取所有机构列表
     */
    *getOrganizationList({ payload }, { call, put, select }) {
      // console.log("getOrganizationList ,payload = ", payload);
      const response = yield call(getErJiItems, payload);
      // console.log("getOrganizationList response = ", response);
      yield put(
        createAction("updateOrganizationList")({
          response
        })
      );
      // 获取新 state 数据并传回(包含所有 model 内容)
      const newState = yield select(state => state);
      // console.log("newState = ",newState)
      return newState;
    },
    *getDepartmentList({ payload }, { call, put }) {},
    *getDelPortalContact({ payload }, { call, put, select }) {
      const res = yield call(getDelPortalContact, payload);
      console.log(payload, res, "获取智慧会务列表页图片");
      // yield put(createAction("updateMeetingListForUserCode")({ res, payload }));
      // const toolsState = yield select(state => state.tools);
      // return toolsState;
      // return yield res.Data.headerList;
    }
  },

  reducers: {
    //获取收藏列表
    reducegetPortalContactListByUserCode(state, action) {
      const {
        payload: { response }
      } = action;
      let favoriteList = [];
      if (response.Data) {
        favoriteList = response.Data;
      }
      return {
        ...state,
        favoriteList: favoriteList
      };
    },
    /**
     * 更新所有机构列表
     * @param {state} state 原始 state
     * @param {action} action action，含返回数据信息
     */
    updateOrganizationList(state, action) {
      const {
        payload: { response }
      } = action;
      // console.log("updateAGApprovalMessage , response = ", response);

      state.organizationList = response;

      return {
        ...state
      };
    },
    /**
     * 更新最新访问列表
     * @param {state} state 原始 state
     * @param {action} action action，含返回数据信息
     */
    updateVisitList(state, { payload }) {
      const { lastVisitList } = payload;
      // console.log("lastVisitListlastVisitListlastVisitList",lastVisitList.length)
      if (lastVisitList) {
        let deleteButton = false;
        // 有最后访问记录
        if (lastVisitList.length > 0) {
          // 显示删除按钮
          deleteButton = true;
        }
        return {
          ...state,
          lastVisitList,
          deleteButton
        };
      }
      LoadingUtils.hide();
      return {
        ...state,
        lastVisitList: []
      };
    },
    /**
     * 右上角菜单列表开关
     * @param {state} state 原始 state
     * @param {action} action action，含返回数据信息
     */
    // toggleRightTopList(state, { payload }) {
    //   const { showRightTopList } = payload;
    //   return {
    //     ...state,
    //     showRightTopList
    //   };
    // },
    //收藏人员
    reduceaddPortalContact(state, action) {
      const {
        payload: { response }
      } = action;
      return {
        ...state,
        favoriteAdd: response.ResultCode === "0"
      };
    },
    //取消收藏
    reducedelPortalContact(state, action) {
      const {
        payload: { response }
      } = action;
      return {
        ...state,
        favoriteDel: response.ResultCode === "0"
      };
    },
    //更新收藏列表
    updateFavoriteList(state, action) {
      const {
        payload: { favoriteList }
      } = action;
      return {
        ...state,
        favoriteList
      };
    },
    //更新左侧点击菜单
    updateLeftClick(state, action) {
      const {
        payload: { clickedItem }
      } = action;
      return {
        ...state,
        clickedItem
      };
    },
    //更新编辑按钮
    updateRightEditClick(state, action) {
      const {
        payload: { rightEditClick }
      } = action;
      return {
        ...state,
        rightEditClick
      };
    },
    //更新全选按钮
    updateSelectAllBiaoshi(state, action) {
      const {
        payload: { favoriteList, favoriteSelectAllBiaoshi }
      } = action;
      return {
        ...state,
        favoriteList,
        favoriteSelectAllBiaoshi
      };
    },
    //根据人员ID判断是否已收藏
    reduceisExistPortalContact(state, action) {
      const {
        payload: { response }
      } = action;
      return {
        ...state,
        favoriteIsExist: response.ResultCode === "0"
      };
    }
  }
};

export default contacts;
