import React, {Component} from 'react';
import {TextInput} from 'react-native';
import {globalConfig} from '../config';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

/**
 * 自定义文本输入框，支持文字缩放
 */
class AutoTextInput extends Component {
  static propTypes = {
    realDomRef: PropTypes.func,
  };

  render() {
    const {
      style,
      // fontConfig: {fontScale},
      realDomRef,
    } = this.props;
    const fontScale = 1;
    // console.log("AutoText props = ", this.props);
    // console.log("AutoText style = ", style);
    // 默认文字大小 16
    // let fontSize = globalConfig.fontSizeLevel.DEFAULT ;
    let fontSize = 16;
    // 存在 fontSize 样式配置，使用配置样式及缩放比计算新的文字大小
    if (style && style.fontSize) {
      //指定文字大小
      fontSize = parseInt(style.fontSize * fontScale);
    } else {
      // 不存在 fontSize 样式配置，使用默认文字大小及缩放比计算新的文字大小
      fontSize = parseInt(fontSize * fontScale);
    }
    // return style ? (
    //   <TextInput {...this.props} style={{ ...this.props.style, fontSize }} />
    // ) : (
    //   <TextInput {...this.props} style={{ fontSize }} />
    // );
    return (
      <TextInput
        {...this.props}
        ref={r => realDomRef && realDomRef(r)}
        style={{
          ...this.props.style,
          fontSize,
        }}
      />
    );
  }
}

export default connect(state => {
  return {...state};
})(AutoTextInput);
