/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

/**
 * 日历组件头部
 * 包含向左向右箭头和 年月信息
 */
class CalendarHeader extends React.Component {
  static propTypes = {
    fullYearMonthStr: PropTypes.string.isRequired, // 年月文字 (2020年4月)
    changeMonth: PropTypes.func, // 更改月信息
  };

  static defaultProps = {
    changeMonth: (flag) => {
      console.log('点击了 flag = [%O]', flag);
    },
  };

  /**
   * 渲染年月的文字
   */
  renderMonthText = () => {
    return (
      <Text
        style={{
          color: '#777',
          fontSize: 24,
          fontWeight: 'bold',
        }}
      >
        {this.props.fullYearMonthStr}
      </Text>
    );
  };

  /**
   * 渲染向左向右箭头
   * @param isLeft true 渲染左箭头；false渲染右箭头
   */
  renderArrow = (isLeft) => {
    let image = null;
    if (isLeft) {
      image = require('./icon/icon_left_arrow.png');
    } else {
      image = require('./icon/icon_right_arrow.png');
    }

    return (
      <TouchableOpacity
        style={{
          height: 40,
          width: 40,
          justifyContent: 'center',
          alignItems: isLeft ? 'flex-start' : 'flex-end',
        }}
        onPress={() => {
          // 调用注入的函数 返回信息给父组件
          this.props.changeMonth(isLeft);
        }}
      >
        <Image source={image} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View
        style={{
          zIndex: 10,
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        {this.renderArrow(true)}
        {this.renderMonthText()}
        {this.renderArrow(false)}
      </View>
    );
  }
}

export default CalendarHeader;
