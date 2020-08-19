import React, {Component} from 'react';
import {Text} from 'react-native';
import {globalConfig} from '../config';
import {connect} from 'react-redux';

/**
 * 自定义文本，支持文字缩放
 */
class AutoText extends Component {
  static propTypes = {
    style: Text.propTypes.style,
  };

  render() {
    const {style, fontConfig: {fontScale = 1} = {}} = this.props;
    // console.log("AutoText props = ", this.props);
    // console.log("AutoText style = ", style);
    // 默认文字大小 16
    let fontSize = globalConfig.fontSizeLevel.DEFAULT;
    // 默认行高
    let lineHeight = 0;
    // 存在 fontSize 样式配置，使用配置样式及缩放比计算新的文字大小
    if (style && style.fontSize) {
      //指定文字大小
      fontSize = parseInt(style.fontSize * fontScale);
      if (style.lineHeight) {
        lineHeight = style.lineHeight * fontScale;
      }
    } else {
      // 不存在 fontSize 样式配置，使用默认文字大小及缩放比计算新的文字大小
      fontSize = parseInt(fontSize * fontScale);
    }
    return style ? (
      style.lineHeight ? (
        <Text
          {...this.props}
          style={{...this.props.style, fontSize, lineHeight}}
        />
      ) : (
        <Text {...this.props} style={{...this.props.style, fontSize}} />
      )
    ) : (
      <Text {...this.props} style={{fontSize}} />
    );
  }
}

export default connect(state => {
  return {...state};
})(AutoText);
