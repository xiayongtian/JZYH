import React from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { ToastUtils, getPrettyDate, Storage, LoadingUtils, AlertUtils } from "../../utils";
import { SplitView, SplitViewType } from "../../components";
import LeftTopComponents from "./components/LeftTopComponents";
import LastVisitComponents from "./components/LastVisitComponents";
// import ChangeOrganization from "./components/ChangeOrganization";
import ContactsRightComponent from "./ContactsRightComponent";
import FavoriteTop from "./FavoriteTop";
import SearchBox from "./components/SearchBox";
import { CacheConfigConstants } from "../../config/cacheConfigConstants";
import { commonRequestParamsConfig } from "../../config";

class FavoriteFullScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rightEditClick: false, // 收藏夹 - 编辑按钮
      clickedItem: "默认", // 控制点击左侧菜单后，右侧的展示内容模块
      favoriteList: [], // 收藏夹 - 列表数据
      favoriteSelectAllBiaoshi: false, // 收藏夹 - 全选按钮
      selectedList:[],
      rightEditClickIn: false,
      hiddenEditButton: false
    };
  }
  static navigationOptions = {
    title: "通讯录"
  };

  // 查询收藏夹列表数据-全部（不带分页）
  getList = async () => {
    LoadingUtils.show(37);
    const { userId } = this.props.login.userInfo;
    let params = {
      AppId: commonRequestParamsConfig.APP_ID,
      UserCode: userId,
      SCode: "FW"
    };
    this.props
      .dispatch({
        type: "contacts/getPortalContactListByUserCode",
        payload: {
          ...params
        }
      })
      .then(result => {
        this.setState({
          favoriteList: result.Data,
          selectedList:[],
          rightEditClick: false,
          rightEditClickIn: false,
          hiddenEditButton: result.Data.length === 0
         }, () => {
           LoadingUtils.hide();
         });
      });
  };

  componentDidMount() {
    let { contacts : {
      rightEditClick, // 收藏夹 - 编辑按钮
      clickedItem, // 控制点击左侧菜单后，右侧的展示内容模块
      favoriteList, // 收藏夹 - 列表数据
      favoriteSelectAllBiaoshi // 收藏夹 - 全选按钮
    }} = this.props;
    this.setState({
      rightEditClick, // 收藏夹 - 编辑按钮
      clickedItem, // 控制点击左侧菜单后，右侧的展示内容模块
      favoriteList, // 收藏夹 - 列表数据
      favoriteSelectAllBiaoshi // 收藏夹 - 全选按钮
    });
    this.getList();
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      LoadingUtils.show(77);
      this.getList();
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  itemClick = param => {
    let arr = this.state.favoriteList;
    let selected = this.state.selectedList;
    let favoriteList = arr.map(item => {
      if (item.ContractID === param) {
        if (item.slt) {
          item.slt = undefined;
          selected.splice(item,1)
        } else {
          item.slt = true;
          selected.push(item);
        }
      }
      return item;
    });
    this.setState({
      favoriteList,
      selectedList:selected
    });
  };

  rightComponent = () => {
    if (this.state.clickedItem === "默认") {
      return <SearchBox />;
    } else if (this.state.clickedItem === "收藏夹") {
      return (
        <ContactsRightComponent
          rightEditClick={this.state.rightEditClick}
          favoriteList={this.state.favoriteList}
          itemClick={item => {
            this.itemClick(item);
          }}
          rightItem={this.state.clickedItem}
          fullScreenFlag={"fullScreen"}
        />
      );
    }
  };

  leftClickCallBack = param => {
    this.setState({
      clickedItem: param
    });
    if (param === "收藏夹") {
      this.getList();
    }
  };

  leftComponent = () => {
    return (
      <>
        <LeftTopComponents
          // 点击左侧菜单按钮的回调
          leftClickCallBack={param => {
            this.leftClickCallBack(param);
          }}
        />
        <LastVisitComponents />
        {/* <ChangeOrganization /> */}
      </>
    );
  };

  rightTopToolBar = () => {
    if (this.state.clickedItem === "收藏夹") {
      return (
        <FavoriteTop
        hiddenEditButton={this.state.hiddenEditButton}
        rightEditClickIn={this.state.rightEditClickIn}
        selectedList={this.state.selectedList}
          // 收藏夹 - 编辑按钮的回调
          callbackEdit={str => {
            this.setState({
              rightEditClick: str,
              rightEditClickIn: str
            });
          }}
          // 收藏夹 - 全选按钮的回调
          callbackSelectAll={() => {
            let arr2 = this.state.favoriteList.map(item => {
              item.slt = !this.state.favoriteSelectAllBiaoshi ? true : undefined;
              return item;
            });
            this.setState({
              favoriteList: arr2,
              favoriteSelectAllBiaoshi: !this.state.favoriteSelectAllBiaoshi
            });
          }}
          // 收藏夹 - 删除按钮的回调
          callbackDel={() => {
            let arr2 = [], arr3 = [], arr4 = [];
            arr3 = this.state.favoriteList.filter(item => {
              if (!item.slt) {
                return item;
              }
            });
            arr3.map(item => {
              if (item) {
                arr4.push(item);
              }
            });
            arr2 = this.state.favoriteList.filter(item => {
              if (item.slt) {
                return item;
              }
            });
            if (arr2.length > 0) {
              const { userId, userCode } = this.props.login.userInfo;
              arr2.map(item => {
                if (item) {
                  let params = {
                    ContractID: item.ContractID,
                    SCode: "FW",
                    UserCode: userId,
                    appID: commonRequestParamsConfig.APP_ID,
                    userid: userCode
                  };
                  this.props.dispatch({
                    type: "contacts/delPortalContact",
                    payload: {
                      ...params
                    }
                  });
                }
              });
              this.setState({
                favoriteList: arr4,
                selectedList:[],
                rightEditClick: false,
                rightEditClickIn: false,
                hiddenEditButton: arr4.length === 0
              });
              ToastUtils.show("删除成功");
            } else {
              return;
              //Alert.alert("您未选择待选项.");
            }
          }}
          // 收藏夹 - 全屏按钮的回调
          onFullScreen={() => {
            this.props.dispatch({
              type: "contacts/updateLeftClick",
              payload: {
                clickedItem: this.state.clickedItem
              }
            });

            this.props.dispatch({
              type: "contacts/updateRightEditClick",
              payload: {
                rightEditClick: this.state.rightEditClick
              }
            });

            this.props.dispatch({
              type: "contacts/updateSelectAllBiaoshi",
              payload: {
                favoriteSelectAllBiaoshi: this.state.favoriteSelectAllBiaoshi
              }
            });
            this.props.navigation.navigate("Contact");
          }}
        />
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <SplitView
        type={SplitViewType.ADDRESSBOOK}
        fullScreenBiaoshi={true}
        LeftComponent={this.leftComponent}
        RightComponent={this.rightComponent}
        RightTopToolBar={this.rightTopToolBar()}
      />
    );
  }
}

// export default connect(state => {
//   return { ...state };
// })(withNavigation(FavoriteFullScreen));

export default FavoriteFullScreen;

