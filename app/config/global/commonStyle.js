/** 公共样式表 **/

import { Dimensions, Platform } from "react-native";

export const commonStyle = {
  /** color **/

  // APP主题背景色
  // themeBackground: '#F9F9FB',
  // themeBackground: '#FEFEFE',
  themeBackground: "#F6F6F6",
  // themeBackground: '#F9F9FB',
  // 右侧列表背景色
  rightListBackground: "#F9F9FB",
  // 右侧背景色
  rightBackground: "#FAFAFA",
  // 右侧列表元素边框
  listItemBorderColor: "#FEFEFE",

  // 常用颜色
  white: "#FFF",
  lightGray: "#BEBEBC", // 浅灰
  darkGray: "#92949F", // 深灰
  lightBlack: "#424141", // 浅黑
  darkBlack: "#252525", // 深黑
  marqueeBackground: "#FBFBFB", // 搜索框/下拉选择器/输入框 背景色
  badgeColor: "#C23332", // 未读消息 小红点颜色
  themeBlue: "#4A5FE2", // 主题蓝色
  leaveForm:"#242536",
  // 上面是APP已用的 下面还未用
  red: "#FF0000",
  orange: "#FFA500",
  yellow: "#FFFF00",
  green: "#00FF00",
  cyan: "#00FFFF",
  blue: "#0000FF",
  purple: "#800080",
  black: "#000",
  gray: "#808080",
  tomato: "#FF6347",
  PeachPuff: "#FFDAB9",
  clear: "transparent",

  /** space **/
  // 导航栏顶部的状态栏高度
  navStatusBarHeight: Platform.OS === "ios" ? 20 : 0,

  /** 定位 **/
  absolute: "absolute",

  /** flex **/
  around: "space-around",
  between: "space-between",
  center: "center",
  row: "row"
};

// 屏幕宽
export const screenWidth = Dimensions.get("window").width;
// 屏幕高
export const screenHeight = Dimensions.get("window").height;
