/**
 * 通讯录 接口请求服务
 */
import { get, postForm } from "../utils";

/**
 * 3.1.4 获取用户机构信息（通讯录使用）
 * @returns {Promise<void>}
 */
export async function getPersonErji(params) {
  const url = "/view/oa/GetCTPersonErji/ilinkapi/Contact/GetCT_PersonErji";
  // params = {
  //   "uid": "haoyanyan01@sinochem.com",
  //   "appID": "aaabw10075",
  //   "userCode": "36969"
  // };
  return get({
    url,
    params
  });
}

/**
 * 3.8.1  根据父级机构ID获取机构和人员列表
 * @param params 需要提交的参数
 * @returns {Promise<void>}
 */
export async function getCTGroupAndPersons(params) {
  console.log("请求树结构");
  const url = "/view/contact/getGroupAndPersons/ilinkapi/Contact/GetCT_GroupAndPersons";
  // params = {
  //   "appID": "aaabw10075",
  //   "userCode": "haoyanyan01@sinochem.com",
  //   "groupcode": "hrmsubcompany18661",
  //   "IsRoot": "N",
  //   "SCode": "FW"
  // };
  return get({
    url,
    params
  });
}

/**
 * 3.8.2  获取所有机构列表
 * @param params
 * @returns {Promise<void>}
 */
export async function getErJiItems(params) {
  const url = "/view/contact/getErJiItems/ilinkapi/Contact/GetErJiItems";
  // params = {
  //   "appID": "aaabw10075",
  //   "Scode": "FW",
  //   "userCode": "haoyanyan01@sinochem.com"
  // };
  return get({
    url,
    params
  });
}

/**
 * 3.8.7  根据关键字查询人员列表
 * @param params
 * @returns {Promise<void>}
 */
export async function f(params) {
  const url = "/view/contact/getPersonsList/ilinkapi/Contact/GetCT_PersonsList";
  params = {
    "strSearch": "郝妍妍",
    "Scode": "FW",
    "appID": "aaabw10075",
    "userCode": "haoyanyan01@sinochem.com"
  };
  return get({
    url,
    params
  });
}

/**
 * 3.8.3  根据人员ID获取人员详情
 * @param params
 * @returns {Promise<void>}
 */
export async function getPersonDetail(params) {
  const url = "/view/contact/getPersonDetail/ilinkapi/Contact/GetPersonDetail";
  // params = {
  //   "uid": "17679",
  //   "Scode": "FW",
  //   "appID": "aaabw10075",
  //   "userCode": "haoyanyan01@sinochem.com"
  // };
  return get({
    url,
    params
  });
}

/**
 * 3.8.4  根据人员ID判断是否已收藏
 * @param params
 * @returns {Promise<void>}
 */
export async function isExistPortalContact(params) {
  const url = "/view/contact/isExistPortalContact/ilinkapi/Portal/IsExistPortalContact";
  // params = {
  //   "AppId": "aaabw10075",
  //   "UserCode": "haoyanyan01@sinochem.com",
  //   "ContractID": "17679",
  //   "SCode": "FW"
  // };

  return get({
    url,
    params
  });
}

/**
 * 3.8.5  收藏人员
 * @param params
 * @returns {Promise<void>}
 */
export async function addPortalContact(params) {
  const url = "/view/contact/addPortalContact/ilinkapi/Portal/AddPortalContact";
  // params = {
  //   "Company": "中化信息技术有限公司",
  //   "ContractID": "17679",
  //   "Department": "北京分部",
  //   "DisplayName": "蔺方",
  //   "ID": "19ed280b-bee3-5c20-7a82-527ced9920e7",
  //   "MName": "蔺方",
  //   "MTelNo": "18911998310",
  //   "Post": "职员",
  //   "SCode": "FW",
  //   "UserCode": "haoyanyan01@sinochem.com",
  //   "Weight": "0",
  //   "appID": "aaabw10075",
  //   "loginId": "linfang@sinochem.com",
  //   "userid": "17368"
  // };
  return postForm({
    url,
    params
  });
}

/**
 * 3.8.6  取消收藏人员
 * @param params
 * @returns {Promise<void>}
 */
export async function delPortalContact(params) {
  const url = "/view/contact/delPortalContact/ilinkapi/Portal/DelPortalContact";
  // params = {
  //   "ContractID": "17679",
  //   "SCode": "FW",
  //   "UserCode": "haoyanyan01@sinochem.com",
  //   "appID": "aaabw10075",
  //   "userid": "17368"
  // };
  return postForm({
    url,
    params
  });
}

/**
 * 3.8.8  获取收藏列表
 * @param params
 * @returns {Promise<void>}
 */
export async function getPortalContactListByUserCode(params) {
  const url = "/view/contact/getPortalContactListByUserCode/ilinkapi/Portal/getPortalContactListByUserCode";
  // params = {
  //   "AppId": "aaabw10075",
  //   "UserCode": "haoyanyan01@sinochem.com",
  //   "SCode": "FW"
  // };
  return get({
    url,
    params
  });
}
/**
 * 获取通讯录人员头像
 * @param params
 * @returns {Promise<void>}
 */
export async function GetUserPhotoBase64(params) {
  // console.log('获取头像的params',params)
  const url = "/view/ilinkUser/avatar/ilinkapi/OA/GetUserPhotoBase64";

  // params = {
  //   "user":"loginid,email;loginid2,email2"
  // };
  //示例：
  //"user":"haoyanyan01@sinochem.com,haoyanyan01@sinochem.com;liweifu@sinochem.com,liweifu@sinochem.com"
  return postForm({
    url,
    params
  });
}
