import React from "react";
import { Image, TouchableOpacity, View, StyleSheet, ImageBackground, Text } from "react-native";
import { commonStyle } from "../config/global/commonStyle";
import AutoText from "./AutoText";
import PropTypes from "prop-types";

export const SplitViewType = {
  APPROVAL: 0, // 审批
  SUBSCRIPTION: 1, // 订阅
  SUBSCRIPTION_SECOND_MENU: 2, // 订阅二级菜单
  ADDRESSBOOK: 3, // 通讯录
  MY: 4 // 我的
};

export class SplitView extends React.Component {
  static propTypes = {
    LeftComponent: PropTypes.func, // 左侧组件
    RightComponent: PropTypes.func, // 右侧组件
    onFullScreenChange: PropTypes.func, // 右侧 展示全屏callback
    onSubscriptionSettingChange: PropTypes.func, // 订阅页面 设置 callback
    type: PropTypes.number, // 当前使用框架 页面类型
    customRightTitle: PropTypes.func, // 自定义右侧标题栏，传入方法，方法的返回值为 DOM
    rightTitle: PropTypes.string, // 右侧标题
    levelTwoMenuTitle: PropTypes.string, // 订阅页二级菜单标题
    secondMenuOnback: PropTypes.func // 订阅页二级菜单 返回按钮
  };

  constructor(props) {
    super(props);
  }

  // 拿到左部分标题
  getLeftTitle(type) {
    switch (type) {
      case SplitViewType.APPROVAL:
        return "审批";
      case SplitViewType.SUBSCRIPTION:
        return "订阅";
      case SplitViewType.ADDRESSBOOK:
        return "通讯录";
    }
  }

  // 返回左上角标题组件
  renderLeftTitleComponent() {
    const { onSubscriptionSettingChange, type, levelTwoMenuTitle, secondMenuOnback } = this.props;

    // 订阅页二级菜单样式
    if (type === SplitViewType.SUBSCRIPTION_SECOND_MENU) {
      return (
        <View style={styles.subscriptionSecondMenuContainer}>
          <TouchableOpacity
            style={{ marginBottom: 26, height: 40, width: 40 }}
            onPress={() => {
              secondMenuOnback();
            }}
          >
            <Image
              source={require("../images/common/back_arrow.png")}
              style={{ width: 22, height: 14 }}
            />
          </TouchableOpacity>
          <AutoText style={{ fontSize: 22, color: commonStyle.darkBlack, fontWeight: "bold" }}>
            {levelTwoMenuTitle}
          </AutoText>
        </View>
      );
    } else {
      return type === SplitViewType.MY ? null : (
        <View style={styles.leftTopContainer}>
          <AutoText style={styles.leftTitle}>{this.getLeftTitle(type)}</AutoText>

          {type === SplitViewType.SUBSCRIPTION ? (
            <TouchableOpacity onPress={() => onSubscriptionSettingChange()}>
              <Image
                source={require("../images/subscription/dy_setting.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }
  }

  render() {
    const {
      LeftComponent,
      RightComponent,
      onFullScreenChange,
      rightTitle,
      customRightTitle,
      rightIcon,
      RightTopToolBar,
      fullScreenBiaoshi
    } = this.props;
// console.log("RightTopToolBar--------",RightTopToolBar, customRightTitle,onFullScreenChange)
    return (
      <View style={styles.container}>
        {!fullScreenBiaoshi ? (
          <View style={{ width: 325 }}>
            {this.renderLeftTitleComponent()}
            {LeftComponent()}
          </View>
        ) : null}

        <ImageBackground
          imageStyle={{ borderTopLeftRadius: 24, overflow: "hidden" }}
          resizeMode={"stretch"}
          // source={require("../images/common/shadow_splitView.png")}
          style={styles.shadow}
        >
          <View style={styles.rightContainer}>
            {customRightTitle ? (
              customRightTitle()
            ) : RightTopToolBar ? (
              RightTopToolBar
            ) : (
              <View style={styles.rightTopContainer}>
                <TouchableOpacity
                  style={{ marginLeft: 13 }}
                  onPress={() => {
                    if (onFullScreenChange) {
                      // console.log("onFullScreenChange---------",onFullScreenChange)
                      onFullScreenChange();
                    }
                  }}
                >
                  <Image
                    source={require("../images/common/icon_fullScreen.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>

                {rightTitle !== <View /> ? (
                  <AutoText style={styles.rightTitle}>{rightTitle}</AutoText>
                ) : null}

                {rightIcon ? rightIcon : <View />}
              </View>
            )}

            {RightComponent()}
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    paddingTop: commonStyle.navStatusBarHeight,
    backgroundColor: commonStyle.themeBackground
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
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    marginTop: 24,
    marginBottom: 26,
    paddingLeft: 10,
    paddingBottom: 10
  },

  rightContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderWidth: 1,
    borderColor: commonStyle.rightBackground,
    backgroundColor: commonStyle.rightBackground,
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
