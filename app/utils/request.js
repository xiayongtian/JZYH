/**
 * http 请求工具类
 */
import axios from 'axios';
import { stringify } from 'qs';
import md5 from 'js-md5';
// 引入获取 http 基本配置方法
import getServerConfig from '../config/server/config';
// import httpBaseConfig from "../config/global/basecommon/httpBaseConfig";
// import { getFullUrl } from "../config/global/constant";
import Toast from './toast';
import NetInfo from '@react-native-community/netinfo';
import randomWord from './randomWord'
import getCurrentTime from './getCurrentTime'
import { cacheConfig } from '../config/cache/config';
// 存放网络状态的 model
export const networkModel = {
  namespace: 'networkState',
  state: {
    isConnected: true,
  },
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  408: '请求失败了',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
// 初始化获取服务配置信息
const serverConfig = getServerConfig();

// 获取完整url
const getFullUrl = (url, headers) => {
  const currentTime = getCurrentTime()
  const randomstr = randomWord(true, 8, 8)   //8位随机字符
  const operator = 'padappportal'
  const encode = md5(operator + randomstr + currentTime + 'padappportal_2020').toUpperCase();

  // 获取 http 请求相关信息
  if (url.indexOf('furl') !== -1) {
    
    let targetUrl;
    // console.log("httpBaseConfig = ", httpBaseConfig);
    // 配置url以 / 结尾
    if (serverConfig.baseUrl.endsWith('/')) {
      targetUrl = serverConfig.baseUrl + url.substring(1, url.length);
    } else {
      targetUrl = serverConfig.baseUrl + url;
    }
    // url中含参数信息
    if (targetUrl.indexOf('?') !== -1) {
      targetUrl += '&data-application=' + serverConfig.application;

    } else {
      targetUrl += '?data-application=' + serverConfig.application;

    }
    targetUrl += '&data-userstore=' + serverConfig.dataUserstore;
    console.log('附件getFullUrl, url =', targetUrl);
    return targetUrl;
  } else {
    if (url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1) {
      return url;
    }
    let targetUrl;
    // console.log("httpBaseConfig = ", httpBaseConfig);
    // 配置url以 / 结尾
    if (serverConfig.baseUrl.endsWith('/')) {
      targetUrl = serverConfig.baseUrl + url.substring(1, url.length);
    } else {
      targetUrl = serverConfig.baseUrl + url;
    }
    // url中含参数信息
    if (targetUrl.indexOf('?') !== -1) {
      targetUrl += '&data-application=' + serverConfig.application;
    } else {
      targetUrl += '?data-application=' + serverConfig.application;
    }
    if (targetUrl.indexOf('idp') == -1) {
      targetUrl += '&data-header=' + 'timestamp:' + currentTime;
      targetUrl += '&data-header=' + 'randomstr:' + randomstr;
      targetUrl += '&data-header=' + 'operator:padappportal';
      targetUrl += '&data-header=' + 'encode:' + encode;
    }
  if (headers !== '') {
    targetUrl += '&data-header=' + 'jwt:' + headers.jwt;
    targetUrl += '&data-header=' + 'appId:' + headers.appId;
  }
    targetUrl += '&data-userstore=' + serverConfig.dataUserstore;
    console.log('getFullUrl, url =', targetUrl);
    return targetUrl;
  }


};
/**
 * 检查状态
 * @param {*} response
 */
const checkStatus = response => {
  console.log("checkStatus respone = ", response);
  if ((response.status >= 200 && response.status < 300) || response.success) {
    return response;
  }
  const errorText = codeMessage[response.status] || response.statusText;
  const error = new Error(errorText);
  error.name = response.status;
  error.response = response;
  throw error;
};

axios.interceptors.response.use(
  response => checkStatus(response),
  error => checkStatus(error),
);

function request(option) {
  NetInfo.fetch().then(state => {
    networkModel.state.isConnected = state.isConnected;
  });

  const defaultOptions = {
    // credentials: 'include',
    // timeout: httpBaseConfig.timeout
  };
  const newOptions = { ...defaultOptions, ...option };
  // const currentTime = new Date().getTime()  //当前时间时间戳
  // const currentTime=getCurrentTime()
  // const randomstr = randomWord(true, 8, 8)   //8位随机字符

  // let jqOption = {
  //   operator: 'padappportal',
  //   randomstr: randomstr,
  //   timestamp: currentTime,
  // }
  // const encode = md5(jqOption.operator + jqOption.randomstr + jqOption.timestamp + 'padappportal_2020').toUpperCase()
  // console.log('---', randomstr, jqOption.operator ,jqOption.randomstr , jqOption.timestamp , 'padappportal_2020',md5(jqOption.operator + jqOption.randomstr + jqOption.timestamp + 'padappportal_2020'), encode)
  if (
    newOptions.method === 'post' ||
    newOptions.method === 'put' ||
    newOptions.method === 'delete'
  ) {
    newOptions.headers = {
      Accept: 'application/json',
      ...newOptions.headers,
    };
  }
  return axios
    .request(newOptions)
    .then(response => {
      console.log('request success = ', response);
      return response.data;
    })
    .catch(error => {
      console.log('request error = ', error);
      if (error.name) {
        // 根据返回状态码 进行弹窗
        Toast.show(error.message);
        return error;
      }
      const { response } = error;
      if (response.message === 'Network Error') {
        Toast.show('似乎已断开与互联网的连接');
        return error;
      }
      if (
        response.code === 'ECONNABORTED' ||
        response.message.indexOf('timeout') > -1
      ) {
        // 请求超时
        Toast.show('请求失败了');
        return error;
      }
      return error;
    });
}

/**
 * 执行 post 请求, 请求体为 JSON
 * @param {JSON} requestConfig 请求参数
 */
export function postJson(requestConfig) {
  var aa = requestConfig.params;
  console.log("参数参数参数参数参数参数参数参数" + encodeURIComponent(JSON.stringify(aa)))
  let tempUrl;
  if (requestConfig.headers) {
    tempUrl = getFullUrl(requestConfig.url, requestConfig.headers)
  } else {
    tempUrl = getFullUrl(requestConfig.url, '')
  }
  const options = {
    // url: getFullUrl(requestConfig.url,requestConfig.headers),
    url: tempUrl,
    method: 'post',
    data: "data-json=" + encodeURIComponent(encodeURIComponent(JSON.stringify(requestConfig.params))), //将对象转换为JSON字符串
    timeout: requestConfig.timeout || serverConfig.defaultTimeout,
    headers: requestConfig.headers || {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  };
  console.log("===========>" + JSON.stringify(options))
  return request(options);
}

/**
 * 执行 post 请求, 请求方式为 form 表单提交
 * @param {JSON} requestConfig 请求参数
 */
export function postForm(requestConfig) {
  const dataParams = stringify(requestConfig.params);
  const options = {
    method: 'post',
    data: dataParams,
    url: getFullUrl(requestConfig.url, ''),
    timeout: requestConfig.timeout || serverConfig.defaultTimeout,
    headers: requestConfig.headers || {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  };
  return request(options);
}

/**
 * 执行 get 请求
 * @param {JSON} requestConfig 请求参数
 * {
 *    url:"/view/a/b/xxxxx",
 *    params: {
 *      var1:"var1"
 *      ...
 *    },
 *    headers: {}, // headers
 *    timeout: 15 //超时时长,单位秒
 * }
 */
export function get(requestConfig) {
  console.log("请求的地址" + requestConfig.url);
  const options = {
    method: 'get',
    headers: requestConfig.headers || {
      Accept: 'application/json',
      // "Content-Type": "application/json"
    },
    params: requestConfig.params,
    url: getFullUrl(requestConfig.url, ''),
    timeout: requestConfig.timeout || serverConfig.defaultTimeout,
  };
  return request(options);
}
