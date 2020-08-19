import React from "react";
import { View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import TreeComponent, { treeNodeType } from "../../../components/TreeComponent";
import commonParamsConfig from "../../../config/global/commonParamsConfig";
import { Storage } from "../../../utils";
import { CacheConfigConstants } from "../../../config/cacheConfigConstants";
import LoadingUtils from "../../../utils/LoadingUtils";
import Proptypes from "prop-types";
import * as Contacts from "../../../utils/ContactsUtils";

class ContactsTree extends React.Component {
  static proptypes = {
    rootTreeNodeId: Proptypes.string.isRequired, // 树的根节点ID
    clickPerson: Proptypes.func // 点击树上的人员节点后的回调
  };

  // 设置 prop 默认值
  static defaultProps = {
    clickPerson: () => {
    } // 点击人员默认执行空函数
  };

  constructor(props) {
    super(props);
    const {
      contactsTree: { departmentTree },
      rootTreeNodeId
    } = props;

    // const rootTreeNodeId = '9090'
    this.state = {
      reRenderSelect: false,
      // rootTreeNodeId,
      rootTreeNodeId: 'fudufidf'
    };

    console.log('进入审计部')
    
    if (!departmentTree || departmentTree.length === 0) {
     let deptInfo={
        deptId:'001018',
        deptName:'资本控股',
        parentId:'001'
      }
      this.getTreeData('001018', true,deptInfo);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { rootTreeNodeId, contactsTree: { deptInfo } } = nextProps;
    if (this.state.rootTreeNodeId !== rootTreeNodeId) {
      // LoadingUtils.show('努力加载中...');
      // console.log("重新初始化了吗？123 rootTreeNodeId = ", rootTreeNodeId);
      // console.log("重新初始化了吗？123 this.state.rootTreeNodeId = ", this.state.rootTreeNodeId);
      console.log('deptinfo---', deptInfo)
      this.getTreeData(rootTreeNodeId, true, deptInfo);
      this.setState({ rootTreeNodeId });
    }
  }

  /**
   * 查询树数据
   * @param {string} groupCode 当前节点的 ID
   * @param {boolean} isRoot 当前节点是否作为根节点
   */
  getTreeData = async (groupCode, isRoot, deptInfo) => {
    // const { SubsubcomId, SCode } = await Storage.get(CacheConfigConstants.user.USER_ORG);
    // const {
    //   login: {
    //     userInfo: { userId }
    //   },
    //   dispatch
    // } = this.props;
    await this.props.dispatch({
      type: "contactsTree/getDepartmentTree",
      payload: {
        // appID: commonParamsConfig.APP_ID,
        // userCode: userId,
        // groupcode: groupCode || SubsubcomId,
        groupcode: groupCode,
        IsRoot: isRoot ? "Y" : "N",
        deptInfo
        // SCode: SCode
      }
    });
  };

  /**
   * 点击非叶子节点和叶子节点的回调函数
   */
  showListCallback = async (treeNode, index) => {
    // LoadingUtils.show('努力加载中...');
    console.log("点击的节点 ===== ", treeNode);
    // 点击的是 叶子节点 点击的是人员，进入详情
    if (treeNode.type === treeNodeType.leafNode) {
      this.savePersonDetail(treeNode)
      this.goPersonDetail(treeNode);
      return;
    }

    // 点击的是 非叶子节点
    if (!treeNode.expansion) {
      console.log("展开操作", treeNode);
      await this.getTreeData(treeNode.deptId, false, treeNode);
      return;
    }

    console.log("收起树操作");
    await this.props.dispatch({
      type: "contactsTree/contractTreeNode",
      payload: {
        targetId: treeNode.deptId
      }
    });
    // LoadingUtils.hide();

  };
  /**
   * 保存人员详情数据
   */
  savePersonDetail = async (treeNode) => {
    await this.props.dispatch({
      type: "contactsTree/savePersonDetail",
      payload: {
        treeNode
      }
    });
  }

  /**
   * 选中树节点
   */
  doSelect = async (treeNode, index) => {
    // LoadingUtils.show(25);
    console.log('treeNode-------->',treeNode)
    const { dispatch } = this.props;
    console.warn("选中的节点 ===== 哈哈哈", treeNode,treeNodeType);
    if (treeNode.type === treeNodeType.NonLeafNode && !treeNode.expansion) {
      await this.getTreeData(treeNode.deptId, false, treeNode);
    }
    await dispatch({
      type: "contactsTree/updateTreeSelectedState",
      payload: {
        treeNodeId: treeNode.deptId
      }
    });
    LoadingUtils.hide();
  };

  /**
   * 将组织节点下的所有人员都下载到通讯录
   */
  doDownload = (item, index) => {
    console.log("下载到通讯录操作 = ", item);
    const personList = [];
    for (const person of item.children) {
      if (person.type === treeNodeType.leafNode) {
        personList.push(person);
      }
    }
    Contacts.addPersonToContacts(personList);
  };

  /**
   * 跳转到人员详情
   */
  goPersonDetail = async treeNode => {
    console.warn("点击的人员 ID 是", treeNode.id);
    let personId = treeNode.id;
    this.props.dispatch({
      type: "contactsPersonDetail/updatePersonId",
      payload: personId
    });
 
    // 执行人员回调
    this.props.clickPerson({
      type: "contactsDetail",
      personId,
      treeNode
    });
  };

  render() {
    const {
      contactsTree: { departmentTree ,showSelectButton},
      dispatch
    } = this.props;
    console.log("树节点保存的信息", departmentTree);

    // let departmentTree = [
    //   {
    //     children: [{
    //       children: [],
    //       expansion: false,
    //       id: "hrmdepartment377338",
    //       selected: false,
    //       title: "流程信息部",
    //       type: 0,
    //       weight: 2
    //     }],
    //     expansion: true,
    //     id: "hrmsubcompany107661",
    //     selected: false,
    //     title: "中化宝砺商务服务有限公司",
    //     type: 0,
    //     weight: 0
    //   }


    // ]
    // const {
    //   contactsTree: { departmentTree, showSelectButton, flatListOffsetY },
    //   dispatch
    // } = this.props;
    // let showSelectButton = false
    let flatListOffsetY = 0
    return (
      // <View><Text>树节点</Text></View>
      <TreeComponent
        initOffset={flatListOffsetY}
        latestOffset={(y) => {
          // console.log("yyyyyyyyyyyyyyyyy = ", y);
          dispatch({
            type: "contactsTree/setFlatListOffsetY",
            payload: { flatListOffsetY: y }
          });
        }}
        treeData={JSON.parse(JSON.stringify(departmentTree))}
        showListCallback={this.showListCallback}
        isShowSelect={showSelectButton}
        doSelect={this.doSelect}
        doDownload={this.doDownload}
      />
    );
  }
}

export default connect(state => {
  return { ...state };
})(ContactsTree);


