import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, ImageBackground, Text } from "react-native";
import AutoText from "../components/AutoText";
import { commonStyle } from "../config/global/commonStyle";
import PropTypes from "prop-types";
import { AppConfigConstants } from "../config/CommonConfig";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { menuCellImages } from "../config/global/imageConstants";

export const MenuCellType = {
  TEXT: 0, // 文本
  FONT_RADIO: 1 // 字体大小单选
};

class MenuCell extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    onChangeSelectCell: PropTypes.func, // 选中当前cell callback
    selectedCellIndex: PropTypes.number, // 选中cell index
    item: PropTypes.object, // 数据源
    index: PropTypes.number, // 表格索引
    type: PropTypes.number, // CellMenuType 类型   文字/单选框
    count: PropTypes.number, // 代办/已办/办结 数量显示
    collection: PropTypes.bool
  };

  /**
   * 修改文字大小
   */
  _changeFontSize = async newFontScale => {
    this.props.dispatch({
      type: "fontConfig/saveConfig",
      payload: {
        fontScale: newFontScale
      }
    });
  };

  /**
   * 绘制右侧模块
   */
  renderRightModule(type, item) {
    let { index, selectedCellIndex } = this.props;

    // 字体大小单选框
    if (type === MenuCellType.FONT_RADIO) {
      return this.renderChangeFontSize();
    } else {
      // 代办/已办/办结  && 不显示数字
      return (
        <View style={styles.rightContainer}>
          {type === MenuCellType.TEXT ? (
            <AutoText
              style={{
                marginRight: 8,
                fontSize: 12,
                color: index === selectedCellIndex ? commonStyle.white : commonStyle.lightGray
              }}
              numberOfLines={1}
            >
              {item.text}
            </AutoText>
          ) : null}
          <Image
            source={
              index === selectedCellIndex
                ? require("../images/common/cell_arrow_right_h.png")
                : require("../images/common/cell_arrow_right.png")
            }
            style={{ width: 7, height: 13 }}
          />
        </View>
      );
    }
  }

  /**
   * 绘制更改字体的按钮
   */
  renderChangeFontSize = () => {
    const { SMALL, MIDDLE, LARGE } = AppConfigConstants.fontScaleLevel;
    // const fontScale = this.props.fontConfig.fontScale;
    const fontScale = 1;

    const textButton = [
      {
        text: "小",
        fontSize: 12,
        width: 24,
        weight: 1,
        backgroundColor: fontScale === SMALL ? "#4A5FE2" : "#F8F8F6",
        fontColor: fontScale === SMALL ? "#fff" : "#BEBEBD",
        onPress: SMALL
      },
      {
        text: "中",
        fontSize: 13.5,
        width: 26,
        weight: 1.2,
        backgroundColor: fontScale === MIDDLE ? "#4A5FE2" : "#F6F6F4",
        fontColor: fontScale === MIDDLE ? "#fff" : "#BEBEBD",
        onPress: MIDDLE
      },
      {
        text: "大",
        fontSize: 15,
        width: 28,
        weight: 1.5,
        backgroundColor: fontScale === LARGE ? "#4A5FE2" : "#F4F4F2",
        fontColor: fontScale === LARGE ? "#fff" : "#BEBEBD",
        onPress: LARGE
      }
    ];

    const buttonDom = textButton.map(item => {
      return (
        <TouchableOpacity
          key={item.text}
          onPress={() => {
            this._changeFontSize(item.onPress);
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 8,
            width: item.width,
            height: item.width,
            backgroundColor: item.backgroundColor,
            borderRadius: item.width / 2
          }}
        >
          <AutoText style={{ fontSize: item.fontSize, color: item.fontColor }}>
            {item.text}
          </AutoText>
        </TouchableOpacity>
      );
    });

    return (
      <View
        style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}
      >
        {buttonDom}
      </View>
    );
  };

  render() {
    let { onChangeSelectCell, item, type, index, selectedCellIndex, collection } = this.props;
    // 缩放大小配置
    // const fontScale = this.props.fontConfig.fontScale;
    const fontScale=1
    // 配置的阴影高度（小号字体标准）
    const shadowHeight = styles.shadowContainer.height;
    // 配置的文字高度（小号字体标准）
    const fontHeight = styles.container.height;
    const { SMALL, MIDDLE, LARGE } = AppConfigConstants.fontScaleLevel;
    let scaledShadowHeight = shadowHeight;
    let scaledContainerHeight = fontHeight;
    switch (fontScale) {
      case SMALL:
        scaledShadowHeight = shadowHeight;
        scaledContainerHeight = fontHeight;
        break;
      case MIDDLE:
        scaledShadowHeight = shadowHeight * 1.05;
        scaledContainerHeight = fontHeight * 1.05;
        break;
      case LARGE:
        scaledShadowHeight = shadowHeight * 1.2;
        scaledContainerHeight = fontHeight * 1.2;
        break;
      default:
        scaledShadowHeight = shadowHeight;
        scaledContainerHeight = fontHeight;
        break;
    }
    let imageBackgroundColor = "";
    if (!collection) {
      imageBackgroundColor = index === selectedCellIndex ? commonStyle.themeBlue : commonStyle.themeBackground;
    } else {
      imageBackgroundColor = index === selectedCellIndex ? commonStyle.themeBlue : commonStyle.white;
    }
    return (
      <TouchableOpacity
        disabled={type === MenuCellType.FONT_RADIO}
        onPress={() => {
          onChangeSelectCell(item, index);
        }}
      >
        <ImageBackground
          imageStyle={{ borderRadius: 12 }}
          resizeMode={"stretch"}
          source={
            index === selectedCellIndex
              ? require("../images/common/cell_menu_h.png")
              : require("../images/common/cell_menu.png")
          }
          style={{ ...styles.shadowContainer, height: scaledShadowHeight }}
        >
          <View
            collection
            style={{
              ...styles.container,
              height: scaledContainerHeight,
              backgroundColor:imageBackgroundColor
            }}
          >
            <View style={styles.leftContainer}>
              {item.isLevelTwoMenu ? null : (
                <Image
                  defaultSource={require("../images/subscription/bmfw.png")}
                  source={
                    index === selectedCellIndex
                      ? menuCellImages[item.img_h]
                      : menuCellImages[item.img]
                  }
                  style={{ width: 22, height: 22, marginRight: 15 }}
                />
              )}
              <AutoText
                style={{
                  ...styles.title,
                  color: index === selectedCellIndex ? commonStyle.white : commonStyle.lightBlack
                }}
                numberOfLines={1}
              >
                {item.title}
              </AutoText>
            </View>

            {this.renderRightModule(type, item)}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  shadowContainer: {
    flex: 1,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 1
  },
  container: {
    width: "98%",
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 13,
    marginBottom: 13,
    marginRight: 8
  },
  leftContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  title: {
    fontSize: 16,
    maxWidth: 200
  }
});

// export default connect(state => {
//   return { ...state };
// })(withNavigation(MenuCell));

export default MenuCell;
