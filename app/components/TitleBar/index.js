"use strict";

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { width, unitWidth, titleHeight, statusBarHeight } from './AdapterUtil'
import CustomStatusBar from '../../components/CustomStatusBar'
/**
 * 自定义标题栏
 */
export default class TitleBar extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,  //标题
    navigation: PropTypes.object.isRequired,  //导航器
    hideLeftArrow: PropTypes.bool,  //左侧是否隐藏，true：隐藏  false：显示  ，默认false
    pressLeft: PropTypes.func,  //点击左侧返回触发事件
    pressRight: PropTypes.func,  //点击右侧按钮触发事件
    left: PropTypes.string,   // 左侧显示内容，例如:"返回"
    backgroundColor: PropTypes.string,  //标题栏背景颜色
    titleColor: PropTypes.string,    // 标题颜色
    right: PropTypes.oneOfType([   // 右侧设置样式对象
      PropTypes.string,
      PropTypes.object,
    ]),
    rightImage: Image.propTypes.source,  //右侧图片
  }

  static defaultProps = {
    title: "",
    hideLeftArrow: false,
    pressRight: () => {
    },
  }

  back() {
    if (this.props.pressLeft) {
      this.props.pressLeft()
      return
    }
    this.props.navigation.goBack();
  }

  render() {
    const { backgroundColor, titleColor } = this.props
    return (
      <View style={[TitleStyle.titleBar, backgroundColor ? { backgroundColor: backgroundColor } : null]}>
        <CustomStatusBar />
        <View style={TitleStyle.titleBarContent}>
          {this.props.hideLeftArrow ? (
            <View style={TitleStyle.left} />
          ) : (
              <TouchableOpacity activeOpacity={1} onPress={this.back.bind(this)}
                style={TitleStyle.left}>
                {/* 左侧返回图标 */}
                <Image style={TitleStyle.titleLeftImage}
                  source={require('./icon/icon_left_arrow.png')} />

                <Text style={TitleStyle.leftText}>{this.props.left}</Text>
              </TouchableOpacity>
            )}
          <View style={TitleStyle.middle}>
            <Text numberOfLines={1}
              style={[TitleStyle.middleTitle, titleColor ? { color: titleColor } : null]}>{this.props.title}</Text>
          </View>
          {this.renderRight()}
        </View>
      </View>
    );
  }

  renderRight() {
    if (!this.props.right && !this.props.rightImage) {
      return <View style={TitleStyle.right} />
    }
    return (
      <TouchableOpacity activeOpacity={1} style={TitleStyle.right}
        onPress={() => {
          this.props.pressRight()
        }}>
        {typeof this.props.right == 'object' ? (this.props.right) : (
          <Text style={TitleStyle.rightText}>{this.props.right}</Text>
        )}
        {this.props.rightImage ? (
          <Image style={TitleStyle.rightImage} source={this.props.rightImage} />
        ) : (null)}
      </TouchableOpacity>
    )
  }
}

const TitleStyle = StyleSheet.create({

  titleBar: {
    // height: titleHeight,
    backgroundColor: '#6199eb',
  },
  titleBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: titleHeight - statusBarHeight,
  },
  left: {
    height: titleHeight,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: unitWidth * 10,
  },
  middle: {
    height: titleHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleTitle: {
    fontSize: 16,
    fontWeight:'bold',
    color: "white",
    alignItems: 'center',
    justifyContent: 'center'
  },

  right: {
    height: titleHeight,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: unitWidth * 30,
  },

  leftText: {
    fontSize: 16,
    color: "#409eff",
    alignItems: 'center',
    justifyContent: 'center',
  },

  rightText: {
    fontSize: unitWidth * 30,
    color: "#2A8ED8",
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightImage: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
    marginLeft: unitWidth * 5
  },

  titleLeftImage: {
    height: 15,
    width: 15,
    marginRight: 5,
    resizeMode: 'contain'
  },

})