import Toast from 'react-native-root-toast';

const defaultOptions = {
  duration: Toast.durations.SHORT,
  position: Toast.positions.CENTER,
};

/**
 * 显示 Toast
 * @param {string} message 显示内容
 * @param {object} options 配置选择，可选
 */
export function show(message, options) {
  let combinOptions = {};
  // 有用户自定义参数
  if (options) {
    combinOptions = {
      ...defaultOptions,
      ...options,
    };
  } else {
    combinOptions = {
      ...defaultOptions,
    };
  }
  // console.log("combinOptions  = ", combinOptions);
  // 显示 toast
  Toast.show(message, combinOptions);
}

export default {
  show,
};
