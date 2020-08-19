import DeviceInfo from 'react-native-device-info';
import commonRequestParamsConfig from './commonRequestParamsConfig';
import NetInfo from '@react-native-community/netinfo';
import AppVersionInfo from 'react-native-app-version-info';
import { AppConfig, AppEnv } from '../appConfig';
import axios from 'axios';

/**
 * 所有设备信息
 */
const deviceInfo = {
  appId: commonRequestParamsConfig.LOG_APP_ID,                    // 应用id
  appName: '',                        // 应用名称
  system: '',          // 操作系统
  sysVersion: '',                       // 系统版本
  Brand: '',                // 品牌  xiaomi/huawei/apple
  deviceModel: '',                           // 设备的型号名称
  deviceNo: '',                              // 设备号
  deviceType: 'pad',               // 当前的设备是phone或者pad
  operatorName: '',                           // 网络运营商的名称
  mobileIp: '',                                                     // 内网IP
  appVersion: '',                                                   // 应用版本号 下方异步获取
  network: '',                                                      // 网络类型   下方异步获取
  softToken: '',                                                    // 设备softToken

  resolution: '',                                                   // 分辨率
};
if (DeviceInfo) {
  deviceInfo.appId = commonRequestParamsConfig.LOG_APP_ID;                    // 应用id
  //deviceInfo.appName = DeviceInfo.getApplicationName();                        // 应用名称
  deviceInfo.system = DeviceInfo.getSystemName().toLocaleLowerCase();          // 操作系统
  deviceInfo.sysVersion = DeviceInfo.getSystemVersion();                       // 系统版本
  deviceInfo.Brand = DeviceInfo.getBrand().toLocaleLowerCase();                // 品牌  xiaomi/huawei/apple
  deviceInfo.deviceModel = DeviceInfo.getDeviceId();                           // 设备的型号名称
  deviceInfo.deviceNo = DeviceInfo.getUniqueID();                              // 设备号
  deviceInfo.deviceType = DeviceInfo.isTablet ? 'pad' : 'phone';               // 当前的设备是phone或者pad
  deviceInfo.operatorName = DeviceInfo.getCarrier();                           // 网络运营商的名称
}

if (AppConfig.ENV === AppEnv.PRODUCT) {
  deviceInfo.appName = '化小易HD';
} else if (AppConfig.ENV === AppEnv.DEV) {
  deviceInfo.appName = '化小易HD(UAT)';
}


const netInfoCellularGeneration = {
  'null': '未连接到蜂窝网络，或者类型无法确定',
  '2g': '2G',
  '3g': '3G',
  '4g': '4G',
  '5g': '5G',
};
const NET_INFO_TYPE = {
  'none': '无网络',
  'unknown': '网络状态无法确定',
  'cellular': netInfoCellularGeneration,
  'wifi': 'wifi',
};

// 时刻监测网络状态，以备不时之需，嗯呐
NetInfo.addEventListener(state => {
  const {
    type, //	NetInfoStateType	当前连接的类型。
    // isInternetReachable, //	boolean	如果当前活动的网络连接可以访问Internet
    details, // 该值取决于该type值
  } = state;

  const netInfoType = NET_INFO_TYPE[type.toString().toLowerCase()];
  if (netInfoType && ((typeof netInfoType) === 'object')) {
    const { cellularGeneration } = details;
    deviceInfo.network = netInfoType[cellularGeneration.toString().toLowerCase()] || '未连接到蜂窝网络，或者类型无法确定';
    return;
  }
  console.log('网络状态 netInfoType = ', netInfoType);
  deviceInfo.network = netInfoType || '网络状态无法确定';
});

// 设置版本号
if (AppVersionInfo) {
  AppVersionInfo.getVersionInfo((error, versionInfo) => {
    if (error) {
      console.error('错误信息:', error);
    }
    let { clientVersionName, resourceVersionCode } = JSON.parse(versionInfo);
    console.log('前端获取到的版本信息 versionInfo = ', versionInfo);
    deviceInfo.appVersion = `${clientVersionName}.${resourceVersionCode}`;
  });
} else {
  console.warn('没有appVersioninfo');
}


async function getRealIp() {
  const response = await axios.request({
    url: 'http://whois.pconline.com.cn/ipJson.jsp?json=true',
    method: 'get',
    headers: {
      Accept: 'application/json',
    },
  });
  const { status, data } = response;
  if (status !== 200) {
    deviceInfo.mobileIp = '';
  }
  console.log('获取的公网信息 ', data);
  deviceInfo.mobileIp = data.ip;
}

// 设置 设备IP
// DeviceInfo.getIPAddress().then(ip => {
//   deviceInfo.mobileIp = ip;
// });


async function getDeviceInfo() {
  // 获取当前使用的token
  if (!deviceInfo.mobileIp) {
    await getRealIp();
  }
  return deviceInfo;
}

export default getDeviceInfo;
