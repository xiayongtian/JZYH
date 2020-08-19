import { appEnv, appConfig } from '../appConfig';

/**
 * 根据配置 key 获取参数
 * @param {*} key
 */
function getRequestParamByConfigKey(key) {
  if (key === 'APP_ID') {
    // 开发环境
    if (appConfig.ENV == appEnv.DEV) {
      return 'aaabw10075';
    } else if (appConfig.ENV == appEnv.PRODUCT) {
      // 生产环境
      return 'aaabw10076';
    }
  } else if (key === 'APP_NAME') {
    // 开发环境
    if (appConfig.ENV == appEnv.DEV) {
      return '化小易HD';
    } else if (appConfig.ENV == appEnv.PRODUCT) {
      // 生产环境
      return '化小易领航版';
    }
  } else if (key === 'LOG_APP_ID') {
    // 开发环境
    if (appConfig.ENV == appEnv.DEV) {
      return 'hxyhd_uat';
    } else if (appConfig.ENV == appEnv.PRODUCT) {
      // 生产环境
      return 'hxyhd_product';
    }
  }
  return '';
}

const commonRequestParamsConfig = {
  /**
   * 接口使用的应用ID
   */
  // 生产环境
  APP_ID: getRequestParamByConfigKey('APP_ID'),
  LOG_APP_ID: getRequestParamByConfigKey('LOG_APP_ID'),
  // UAT环境
  // APP_ID: "aaabw10075",
  APP_NAME: getRequestParamByConfigKey('APP_NAME'),
  APP_FROM: 'sinochem',
  TARGET_SERVER_IP: '172.16.104.207',
  /**
   * 文档服务地址
   */
  DOC_SERVER_URL: 'http://192.168.1.1',
  /**
   * 每页条数
   */
  PAGE_SIZE: 10,
  /**
   * 通讯录 - 微信分享的appid
   */
  CONTACT_WX_SHARE_APPID: 'wx67970a05ece381c2',
};
export default commonRequestParamsConfig;
