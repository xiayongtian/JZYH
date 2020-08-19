// 引入应用全局配置
import { AppEnv, AppConfig } from '../../appConfig';
/**
 * 开发测试环境配置
 */
const devConfig = {
  // 开发测试环境地址
  baseUrl: 'https://mobile.sinochem.com/hxyhd',
  // faceBaseUrl:'https://mobile.sinochem.com:38443/FaceLogin',
  faceBaseUrl:'https://mobile.sinochem.com/FaceLogin',
  defaultTimeout: 45000, // 默认超时45秒
  prefix: '',
  // 测试移动平台应用id
  application: 'b234117511c7412da2586eb81fe4ca90',
};

/**
 * 生产配置
 */
const productConfig = {
  // 生产地址
  baseUrl: 'https://mobile.sinochem.com/hxyhd',
  faceBaseUrl:'https://mobile.sinochem.com/FaceLogin',
  defaultTimeout: 45000, // 默认超时45秒
  prefix: '',
  // 生产移动平台应用id
  application: 'ef07700ee36e44f6b05351d4509d1312',
};

export default function getHttpBaseConfig() {
  // 开发环境
  if (AppConfig.ENV === AppEnv.DEV) {
    return devConfig;
  }
  if (AppConfig.ENV === AppEnv.PRODUCT) {
    // 生产环境
    return productConfig;
  }
  // 默认为开发环境
  return devConfig;
}
