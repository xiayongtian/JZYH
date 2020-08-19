import {appEnv, appConfig} from '../appConfig';

/**
 * 根据配置 key 获取参数
 * @param {*} key
 */
function getRequestParamByConfigKey(key) {
  if (key === 'APP_ID') {
    // 开发环境
    if (appConfig.ENV === appEnv.DEV) {
      return 'dev';
    } else if (appConfig.ENV === appEnv.PRODUCT) {
      // 生产环境
      return 'product';
    }
  } else if (key === 'APP_NAME') {
    // 开发环境
    if (appConfig.ENV === appEnv.DEV) {
      return 'seashell dev';
    } else if (appConfig.ENV === appEnv.PRODUCT) {
      // 生产环境
      return 'seashell product';
    }
  } else if (key === 'LOG_APP_ID') {
    // 开发环境
    if (appConfig.ENV === appEnv.DEV) {
      return 'seashell dev';
    } else if (appConfig.ENV === appEnv.PRODUCT) {
      // 生产环境
      return 'seashell product';
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
  /**
   * 每页条数
   */
  PAGE_SIZE: 10,
};
export default commonRequestParamsConfig;
