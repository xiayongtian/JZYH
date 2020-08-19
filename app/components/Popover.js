import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  findNodeHandle,
  UIManager,
} from 'react-native';
import PropTypes from 'prop-types';
import Orientation from 'react-native-orientation';

/**
 * 气泡悬浮窗
 * 根据传入的悬浮窗宽度和高度, 组件内部自动计算悬浮窗位置
 */
class Popover extends Component {
  // 设置 prop
  static propTypes = {
    isUpFlag: PropTypes.bool, // 气泡处于上方还是下方标识; 上方是true , 下方是 false
    mainButton: PropTypes.object.isRequired, // 点击要显示弹窗的按钮 ref 对象
    popoverWidth: PropTypes.number.isRequired, // 悬浮窗的宽度
    popoverHeight: PropTypes.number.isRequired, // 悬浮窗的宽度
    renderButton: PropTypes.element.isRequired, // 悬浮窗的内容
    destroy: PropTypes.func, // 点击空白区域调用的方法
  };
  static defaultProps = {
    isUpFlag: false, // 默认气泡在下方
    destroy: () => { },
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      menuX: 0,
      menuY: 0,
    };
  }

  componentDidMount() {
    Orientation.addOrientationListener(this.onOrientationChange);
    this.getButtonAbsolutePosition();
  }

  componentWillUnmount = () => {
    Orientation.removeOrientationListener(this.onOrientationChange);
  };
  /**
   * 监听转屏事件, 屏幕转动时触发
   */
  onOrientationChange = () => {
    // 转屏时关闭悬浮窗
    this.onDestroy();
  };

  /**
   * 销毁组件 调用方法
   */
  onDestroy = () => {
    this.setState(
      {
        show: false,
      },
      this.props.destroy(),
    );
  };

  /**
   * 获取要显示 Popover 的按钮位置
   */
  getButtonAbsolutePosition = () => {
    const { isUpFlag, mainButton } = this.props;
    const handle = findNodeHandle(mainButton);
    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      const layout = {
        x,
        y,
        width,
        height,
        pageX,
        pageY,
      };
      console.log('对应按钮的相关属性 = ', layout);
      const menuX = this.calculatedMenuX(layout);
      const menuY = this.calculatedMenuY(isUpFlag, layout, true);
      this.setState({
        show: true,
        menuX,
        menuY,
      });
    });
  };

  /**
   * 计算绝对定位的 top 值
   * @param isUpFlag 悬浮窗在主按钮的上方还是下方
   * @param layout 主按钮在页面的 布局属性
   * @param isFirst 是否第一次进入计算 (防止进入死递归)
   * @return top 值
   */
  calculatedMenuY = (isUpFlag, layout, isFirst) => {
    const { popoverHeight } = this.props;
    const { height: screenHeight } = Dimensions.get('window');
    const { height, pageY } = layout;
    // 悬浮窗 距离顶部的 top 值
    let menuY = 0;
    if (isUpFlag) {
      menuY = pageY - popoverHeight - 80;
      if (menuY < 0 && isFirst) {
        menuY = this.calculatedMenuY(!isUpFlag, layout, false);
      }
    } else {
      menuY = pageY  -5
      if (menuY + popoverHeight > screenHeight && isFirst) {
        menuY = this.calculatedMenuY(!isUpFlag, layout, false);
      }
    }
    return menuY;
  };

  /**
   * 计算绝对定位的 left 值
   */
  calculatedMenuX = (layout) => {
    const { popoverWidth } = this.props;
    const { width: screenWidth } = Dimensions.get('window');
    const { width, pageX } = layout;

    // 悬浮窗 距左边的 距离 left
    let menuX = pageX + width / 2 - popoverWidth / 2+10;
    if (menuX + popoverWidth > screenWidth) {
      menuX = screenWidth - popoverWidth;
    }
    if (menuX < 0) {
      menuX = 0;
    }
    return menuX;
  };

  /**
   * 渲染 Popover
   */
  renderPopover = () => {
    const { menuX, menuY } = this.state;

    return (
      <View
        style={{
          position: 'absolute',
          top: menuY,
          left: menuX,
          minWidth: 50,
          minHeight: 30,
        }}
      >
        {this.props.renderButton}
      </View>
    );
  };

  render() {
    const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={this.state.show}
        onDismiss={() => {
          this.onDestroy();
        }}
        onRequestClose={() => {
          this.onDestroy();
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            this.onDestroy();
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: screenWidth,
              height: screenHeight,
            }}
          >
            {this.renderPopover()}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default Popover;
