import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from "react-native";

import { AutoText } from "../../components";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import ContactsRightComponent from "./ContactsRightComponent";
import { commonStyle } from "../../config/global/commonStyle";
import RightTopList from "./components/RightTopList";

/**
 * 通讯录全屏页面
 * @author Zyx
 */
class TreeFullScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedItem: "tree", // 控制点击左侧菜单后，右侧的展示内容模块
      oldClickedItem: "",
      sendEmail: false, // 控制 rightTopToolBar 是否是群发邮件状态
      emailList: []
    };
  }

  componentDidUpdate() {
    const { portalstate, statePerson } = this.props.search;
    if (portalstate) {
      this.setState({
        clickedItem: statePerson
      });
      this.props.dispatch({
        type: "search/updategetDelPortalstate",
        payload: {
          portalstate: false
        }
      });
    }

  }

  leftClickCallBack = param => {
    this.setState({
      clickedItem: param
    });
  };

  //右上角icon  点击展示菜单
  rightIcon = () => {
    return (
      <View>
        <RightTopList
          leftClickCallBack={param => {
            this.leftClickCallBack(param);
          }}
          changeToolBar={sendEmail => {
            this.setState({
              sendEmail
            });
          }}
        />
      </View>
    );
  };

  toggleSelectButton = () => {
    this.props.dispatch({
      type: "contactsTree/toggleShowSelectButton"
    });
  };

  //群发邮件操作
  sendGroupEmail = emailList => {
    let emailAry = [];
    if (emailList && emailList.length > 0) {
      emailList.map((item, index) => {
        emailAry.push(item.email);
      });
    } else {
      return;
    }

    let emailStr = emailAry.join(";");
    console.log(emailStr);
    Linking.canOpenURL(emailStr)
      .then(() => {
        // console.log('emailStr=================',emailStr)
        Linking.openURL(`mailto:${emailStr}`);
      })
      .catch(err => {
        console.log("An error occurred", err);
        ToastUtils.show(`操作失败,请检查是否已登录邮箱:${err}`);
      });
  };

  rightToolBar = () => {
    const {
      contactsTree: { selectedPerson }
    } = this.props;
    const {
      title
    } = this.props.navigation.state.params;
    if (this.state.clickedItem === "contactsDetail") {
      return <View />;
    } else if (this.state.sendEmail) {
      //群发邮件状态下 rightTopToolBar 的样式
      return (
        <View
          style={{
            height: 44,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: 24
          }}
        >
          <TouchableOpacity
            style={{ marginLeft: 13 }}
            onPress={() => {
              this.toggleSelectButton();
              this.setState({
                sendEmail: false
              });
              this.props.dispatch({
                type: "contactsTree/clearTreeSelectedState"
              });
            }}
          >
            <AutoText style={{ fontSize: 18, color: "#9E9DA7" }}>取消</AutoText>
          </TouchableOpacity>

          <AutoText style={{ fontSize: 17, color: commonStyle.darkBlack, fontWeight: "bold" }}>
            群发邮件
          </AutoText>

          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => {
              this.toggleSelectButton();
              this.setState({
                sendEmail: false
              });
              this.sendGroupEmail(selectedPerson);
              this.props.dispatch({
                type: "contactsTree/clearTreeSelectedState"
              });
            }}
          >
            <AutoText style={{ fontSize: 18, color: "#9E9DA7" }}>完成</AutoText>
          </TouchableOpacity>
        </View>
      );
    } else if (this.state.clickedItem === "searchDetail") {
      return  (
        <></>
      )
    } else {
      return (
        <View style={styles.rightTopContainer}>
          <TouchableOpacity
            style={{ marginLeft: 13 }}
            onPress={() => {
              // console.log("onFullScreenChange---------",onFullScreenChange)
              this.props.navigation.navigate("Contact", {});
            }}
          >
            <Image
              source={require("../../images/common/icon_fullScreen.png")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>

          <AutoText style={styles.rightTitle}>{title}</AutoText>

          {this.rightIcon()}
        </View>
      );
    }
  };

  itemClick = param => {
    if (!param || !param.type) {
      return;
    }
    if (param.type === "contactsDetail") {
      this.props.navigation.navigate("ContactDetail", {"fullScreenFlag": "fullScreen", "personId": param.personId});
      return;
    }
    const { clickedItem, oldClickedItem } = this.state;
    let target = {
      clickedItem: param.type
    };
    if (clickedItem !== oldClickedItem) {
      target["oldClickedItem"] = clickedItem;
    }
    this.setState(target);
    return;


  };

  rightComponent = () => {
    return (
      <ContactsRightComponent
        rightItem={this.state.clickedItem}
        oldRightItem={this.state.oldClickedItem}
        itemClick={item => {
          this.itemClick(item);
        }}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          // imageStyle={{ borderTopLeftRadius: 24, overflow: "hidden" }}
          resizeMode={"stretch"}
          // source={require("../images/common/shadow_splitView.png")}
          style={styles.shadow}
        >
          <View style={styles.rightContainer}>
            {this.rightToolBar()}

            {this.rightComponent()}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default connect(state => {
  return { ...state };
})(withNavigation(TreeFullScreen));

// export default TreeFullScreen;

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    flex: 1,
    // marginTop: commonStyle.navStatusBarHeight,
    // backgroundColor: commonStyle.themeBackground
  },

  leftTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26.5,
    marginBottom: 26,
    alignItems: "center",
    paddingLeft: 17,
    paddingRight: 15
  },

  leftTitle: {
    color: commonStyle.darkBlack,
    fontWeight: "bold",
    fontSize: 30
  },

  shadow: {
    flex: 1,
    // borderTopLeftRadius: 24,
    // borderBottomLeftRadius: 24,
    // marginTop: 24,
    // marginBottom: 26,
    // paddingLeft: 10,
    // paddingBottom: 10
  },

  rightContainer: {
    flex: 1,
    // borderTopLeftRadius: 24,
    // borderBottomLeftRadius: 24,
    borderWidth: 1,
    borderColor: commonStyle.rightBackground,
    backgroundColor: "#FAFAFA",
    // backgroundColor: "red",
    position: "relative",
    overflow: "hidden"
    // paddingBottom: 10,
    // paddingHorizontal: 16
  },
  // 右侧顶部标题栏，包含最大化及标题等内容
  rightTopContainer: {
    // height: 44,
    // paddingVertical: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 24,
    paddingTop: 16,
    paddingBottom: 26
  },

  rightTitle: {
    fontSize: 20,
    color: commonStyle.darkBlack,
    fontWeight: "bold"
  },

  subscriptionSecondMenuContainer: {
    marginBottom: 43,
    marginTop: 14,
    alignItems: "flex-start",
    paddingLeft: 17,
    paddingRight: 15
  }
});
