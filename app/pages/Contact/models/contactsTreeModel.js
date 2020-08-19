import { createAction } from "../../../utils";
import { getCTGroupAndPersons, GetUserPhotoBase64 } from "../../../services/contactsServices";
import { treeNodeType } from "../../../components/TreeComponent";
import LoadingUtils from "../../../utils/LoadingUtils";
import createSchema from '../../../utils/Schema'
import { getChildrenList } from "../../../utils/ContactsUtils";



/**
 * 通讯录树结构 Model
 */
const contactsTreeModel = {
  namespace: "contactsTree",
  state: {
    rootTreeNodeId: "",
    personDetail:"",
    // 部门列表
    departmentTree: [],
    selectedPerson: [], // 群发邮件中需要用到的人员
    selectedNodeIds: [], // 点击选中的节点,方便之后清除选中状态
    showSelectButton: false,
    flatListOffsetY: 0,
    avatar: []
  },

  effects: {
    /**
     * 获取部门列表
     */
    * getDepartmentTree({ payload }, { call, put, select }) {
      console.log('Yyyyyyy-Y', payload)
      // 根据选择的机构查询出机构下级部门
      if (payload.deptInfo) {
        // state.departmentTree.
        const childrenList = yield getChildrenList(payload.deptInfo)


        yield put(createAction("updateCompanyList")({ payload, childrenList }));

        console.log('<------------机构列表下级部门------------>', childrenList)
      }

      // 获取部门列表

      // if (payload.IsRoot === "Y") {
      //   const res = yield call(getCTGroupAndPersons, { ...payload });
      //   yield put(createAction("updateCompanyList")({ payload, res }));
      //   console.log('获取部门列表结果--------Y',payload,res)

      //   payload.IsRoot = "N";
      // }
      // const res = yield call(getCTGroupAndPersons, payload);
      // console.log('获取部门列表结果--------N',res)

      // // 获取人员头像
      // if (res.Data.person) {
      //   let resAry = res.Data.person;
      //   for (let i = 0; i < resAry.length; i++) {
      //     let getPersonAvatarParams = {}
      //     let item = resAry[i];
      //     if(item.LoginId === null && item.Email !== null){
      //       getPersonAvatarParams['user'] = ','+item.Email
      //     }else if(item.LoginId !== null && item.Email === null){
      //       getPersonAvatarParams['user'] = item.LoginId+','
      //     }else{
      //       getPersonAvatarParams['user'] = item.LoginId+','+item.Email
      //     }

      //     const response = yield call(GetUserPhotoBase64, getPersonAvatarParams);
      //     console.log('获取头像的结果---------',response)
      //     if(response.ResultCode === '0' && response.Data.length > 0){
      //       const UserPhotoBase64 = response.Data[0].userPhotoBase64;
      //       item['UserPhotoBase64'] = UserPhotoBase64
      //     }else{
      //       item['UserPhotoBase64'] = ''
      //     }
      //   }
      // }

      // yield put(createAction("updateCompanyList")({ payload, res }));
      // return yield select(state => state.tools);
    },
    /**
     * 获取通讯录人员头像
     */
    * getPersonAvatar({ payload }, { call, put, select }) {
      console.log('获取头像的参数---------', payload)
      const response = yield call(GetUserPhotoBase64, { ...payload });
      console.log('获取头像的结果---------', response)

      yield put(createAction("updatePersonAvatar")({ response }));
      yield select(state => console.log('获取头像后的 state---------', state));
    }
  },

  reducers: {
    /**
     * 更新公司列表
     */
    updateCompanyList(state, action) {
      let departmentTree
      const { payload, childrenList } = action.payload
      const { children, deptName: title, ...otherInfo } = payload.deptInfo
      if (payload.deptInfo.parentId == '001') {
        // 构建根节点数据
        departmentTree = [{
          children: childrenList,
          expansion: true,
          id: "hrmsubcompany7661",
          selected: false,
          title,
          type: 0,
          weight: 0,
          ...otherInfo
        }]
      } else {
        // 构建子节点数据
        departmentTree = JSON.parse(JSON.stringify(state.departmentTree))
        const treeNode = traverseTree(departmentTree, payload.deptInfo.deptId);
        if (!treeNode) {
          LoadingUtils.hide();
          return { ...state, departmentTree };
        }
        // 清空旧的数据
        if (treeNode.children && treeNode.children.length > 0) {
          treeNode.children = [];
        }
        // 给人员子树排序
        // if (requestResult.Data.person) {
        //   requestResult.Data.person.sort((prev, next) => {
        //     return prev.Weight - next.Weight;
        //   });
        //   requestResult.Data.person.forEach((currentValue, index) => {
        //     currentValue["type"] = treeNodeType.leafNode;
        //   });
        //   treeNode.children = treeNode.children.concat(
        //     requestResult.Data.person.map((item, index) => transformPersonTreeNode(item))
        //   );
        //   treeNode.showDownload = true;
        // }

        // 给子节点添加孙节点数据childrenList
        if (childrenList) {
          treeNode.children = childrenList
          treeNode["expansion"] = true;
        }
        console.log(treeNode, childrenList, departmentTree)
      }



      LoadingUtils.hide();
      return {
        ...state,
        departmentTree
      };

    },
    /**
     * 保存人员详情
     */
    savePersonDetail(state, action) {
      const personDetail  = action.payload.treeNode;
      return { ...state, personDetail };
    },
    /**
     * 收缩树节点
     */
    contractTreeNode(state, action) {
      console.log("收缩树节点 ===== ", action);
      const {
        payload: { targetId }
      } = action;
      let departmentTree = state.departmentTree;
      const treeNode = traverseTree(departmentTree, targetId);
      if (!treeNode) {
        LoadingUtils.hide();
        return { ...state, departmentTree };
      }
      treeNode.expansion = false;
      treeNode.showDownload = false;
      LoadingUtils.hide();
      return { ...state, departmentTree };
    },
    /**
     * 更新树的根节点
     */
    updateRootTreeNodeId(state, { payload }) {
      const { rootTreeNodeId, deptInfo } = payload;

      if (!rootTreeNodeId) {
        return state;
      }
      return {
        ...state,
        rootTreeNodeId,
        deptInfo
      };
    },
    /**
     * 切换右侧树是否可以选择
     */
    toggleShowSelectButton(state, { payload }) {
      return {
        ...state,
        showSelectButton: !state.showSelectButton
      };
    },
    /**
     * 关闭右侧树的选择框
     */
    closeSelectButton(state, { payload }) {
      return {
        ...state,
        showSelectButton: payload
      };
    },
    /**
     * 更新树的选中状态 并 将选中
     * @param payload = {treeNodeId} 被选中的节点 ID
     * @param state 所有数据
     */
    updateTreeSelectedState(state, { payload }) {
      const { treeNodeId } = payload;
      const { departmentTree, selectedPerson, selectedNodeIds } = state;
      // 记录选中节点
      selectedNodeIds.push(treeNodeId);
      // 找到树中节点位置
      const treeNode = traverseTree(departmentTree, treeNodeId);
      // 叶子节点,选中当前
      if (treeNode.type === treeNodeType.leafNode) {
        treeNode.selected = !treeNode.selected;
        if (treeNode.selected) {
          // console.log('treeNode==========',treeNode)
          selectedPerson.push(treeNode);
        } else {
          selectedPerson.splice(treeNode, 1);
        }

        // 找到当前节点的父节点位置
        const treeParentNode = traverseParentTree(departmentTree, treeNodeId);
        // console.log("treeParentNode===========", treeParentNode);
        // 根据子节点是否全选 判断父节点是否选中
        treeParentNode.selected = treeParentNode.children.every((item, index) => {
          if (item.type === treeNodeType.leafNode) {
            return item.selected;
          } else {
            return true;
          }
        });

        return { ...state, departmentTree };
      }

      // 非叶子节点,选中本身和子人员
      treeNode.selected = !treeNode.selected;
      // console.log("当前节点的状态", treeNode.selected);
      if (treeNode.selected) {
        for (let item of treeNode.children) {
          if (item.type === treeNodeType.leafNode) {
            item.selected = true;
            selectedPerson.push(item);
          }
        }
      } else {
        for (let item of treeNode.children) {
          if (item.type === treeNodeType.leafNode) {
            item.selected = !item.selected;
            if (item.selected) {
              // console.log('treeNode==========',treeNode)
              selectedPerson.push(item);
            } else {
              selectedPerson.splice(item, 1);
            }
          }
        }
      }

      // console.log("selectedPerson=====", selectedPerson);
      return { ...state, departmentTree };
    },
    /**
     * 清除树的选中状态
     */
    clearTreeSelectedState(state, { payload }) {
      const { departmentTree, selectedNodeIds } = state;
      for (let nodeId of selectedNodeIds) {
        // 找到树中节点位置
        const treeNode = traverseTree(departmentTree, nodeId);
        // 叶子节点,选中当前
        if (treeNode.type === treeNodeType.leafNode) {
          treeNode.selected = false;
          continue;
        }
        // 非叶子节点,选中本身和子人员
        treeNode.selected = false;
        for (let item of treeNode.children) {
          if (item.type === treeNodeType.leafNode) {
            item.selected = false;
          }
        }
      }
      return {
        ...state,
        departmentTree,
        selectedPerson: [],
        selectedNodeIds: []
      };
    },

    /**
     * 设置通讯录树的默认展示高度
     */
    setFlatListOffsetY(state, { payload }) {
      const { flatListOffsetY } = payload;
      // console.log("flatListOffsetY = ", flatListOffsetY);
      return {
        ...state,
        flatListOffsetY,
      };
    },

    /**
     * 设置通讯录人员头像
     */
    updatePersonAvatar(state, action) {
      const {
        response
      } = action.payload;
      // console.log("flatListOffsetY = ", flatListOffsetY);
      let avatar;
      if (response.ResultCode === '0') {
        avatar = response.Data
      } else {
        avatar = []
      }
      return {
        ...state,
        avatar
      };
    }
  }
};

export default contactsTreeModel;

/**
 * 递归遍历树结构
 * @param treeData 树结构数据
 * @param targetId 目标树节点的 ID
 */
function traverseTree(treeData, targetId) {
  if (!treeData || !Array.isArray(treeData) || !targetId) {
    return;
  }

  for (let item of treeData) {
    if (item.deptId === targetId) {
      return item;
    }
    const targetNode = traverseTree(item.children, targetId);
    if (targetNode) {
      return targetNode;
    }
  }
}

/**
 * 递归遍历查找当前节点的父节点
 * @param treeData 树结构数据
 * @param targetId 目标树节点的 ID
 * @param parentNode 目标树节点的 父节点
 */
function traverseParentTree(treeData, targetId, parentNode) {
  if (!treeData || !Array.isArray(treeData) || !targetId) {
    return;
  }

  for (let item of treeData) {
    if (item.deptId === targetId) {
      return parentNode;
    }
    const targetNode = traverseParentTree(item.children, targetId, item);
    if (targetNode) {
      return targetNode;
    }
  }
}

/**
 * 将服务端取回的树对象 (组织信息) 属性名修改为树组件可识别的属性名
 * @param requestObj 服务端取回的数据对象
 *
 Code: "hrmsubcompany62"
 DepartmentId: null
 GKey: null
 GName: null
 ID: "hrmsubcompany62"
 Name: "中国中化股份有限公司"
 PGID: null
 ParentCode: "hrmsubcompany1"
 SCode: "FW"
 SubsubcomId: null
 Weight: 0
 type: 0
 */
function transformGroupTreeNode(requestObj) {
  const { ID: id, Name: title, Weight: weight, type: type } = requestObj;
  return {
    id,
    title,
    weight,
    type,
    children: [],
    expansion: false,
    selected: false
  };
}

/**
 * 将服务端取回的树对象 (组织信息) 属性名修改为树组件可识别的属性名
 * @param requestObj 服务端取回的数据对象
 *
 Code: "206548"
 Company: "金融事业部"
 CompanyId: null
 Department: "公司领导"
 DepartmentId: null
 Email: "test-"
 ID: "206548"
 Name: "杨林"
 PKey: null
 ParentCode: "hrmdepartment48767"
 PersonDesc: "金融事业部总裁"
 Phone: ""
 Post: "金融事业部总裁"
 PostCode: ""
 SCode: "FW"
 Tel: ""
 UserPhotoBase64: ""
 Weight: 0
 type: 1
 */
function transformPersonTreeNode(requestObj) {
  const {
    ID: id,
    Name: title,
    Email: email,
    UserPhotoBase64: avatar,
    Post: postTitle,
    Department: department,
    Company: company,
    Phone: phone,
    Tel: tel,
    Weight: weight,
    type: type,
    LoginId: loginId,
  } = requestObj;
  return {
    id,
    title,
    email,
    avatar,
    postTitle,
    department,
    company,
    phone,
    tel,
    weight,
    type,
    loginId,
    selected: false
  };
}
