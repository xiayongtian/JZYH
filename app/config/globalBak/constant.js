// 引入获取 http 基本配置方法
import getHttpBaseConfig from "./basecommon/httpBaseConfig";
// 获取完整url
export function getFullUrl(url) {
  // 获取 http 请求相关信息
  const httpBaseConfig = getHttpBaseConfig();
  if (url.indexOf("http://") != -1 || url.indexOf("https://") != -1) {
    return url;
  }
  let newUrl;
  console.log("httpBaseConfig = ", httpBaseConfig);
  // 配置url以 / 结尾
  if (httpBaseConfig.baseUrl.endsWith("/")) {
    newUrl = httpBaseConfig.baseUrl + url.substring(1, url.length);
  } else {
    newUrl = httpBaseConfig.baseUrl + url;
  }
  // url中含参数信息
  if (newUrl.indexOf("?") !== -1) {
    newUrl += "&data-application=" + httpBaseConfig.application;
  } else {
    newUrl += "?data-application=" + httpBaseConfig.application;
  }
  // console.log("getFullUrl, url =", newUrl);
  return newUrl;
}
