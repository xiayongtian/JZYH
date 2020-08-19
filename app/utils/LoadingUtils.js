import RRCLoading from '../components/Loading/RRCLoading';

/**
 * Loading 工具类
 * @author geyx
 * @author liuyi
 */
export default class LoadingUtils {
  /**
   * 超时时间 单位：毫秒
   * @type {number}
   */
  static timeout = 30 * 1000;
  /**
   * 定时器对象
   * @type {number}
   */
  static setTimeoutObj = null;

  /**
   *  显示 loading
   * @param {string} content 显示内容
   * @param {number} timeout 指定超时时间 单位：毫秒
   */
  static show(content, timeout = null) {
    if (!content) {
      content = '';
    }
    RRCLoading.setLoadingOptions({
      loadingImage: require('../images/common/loading.gif'),
      // loadingImageBackground: require('../images/common/loading.gif'),
      loadingTextStyle: {},
      text: content.toString()
    });
    this.setTimeoutObj = setTimeout(() => {
      this.hide();
    }, timeout || this.timeout);
    RRCLoading.show();
  }

  /**
   * 隐藏 loading
   */
  static hide() {
    if (!this.setTimeoutObj) {
      return;
    }
    clearTimeout(this.setTimeoutObj);
    this.setTimeoutObj = null;
    RRCLoading.hide();
  }
}
