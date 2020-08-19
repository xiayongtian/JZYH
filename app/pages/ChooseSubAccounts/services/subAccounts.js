/**
 * 登录页服务
 */
import { get, postJson, postForm } from '../../../utils';

// const baseUrl = 'https://202.99.19.174'


/**
 * 获取随机码
 * @param {JSON} params
 */
export async function getEncryptedStringByAppe(params) {
  const result = postJson({
    url: `/view/oa/generl/epass-api/api/v3/getEncryptedStringByApp`,
    params
  })
  return result;
}

/**
 * 校验随机码并获取长期票据
 * @param {JSON} params
 */
export async function getUserName(params) {
  const result = postJson({
    url: `/view/oa/generl/epass-api/api/v3/getUserName`,
    params
  })
  return result;
}


/**
 * 校验长效票据
 * @param {JSON} params
 */
export async function verifyjwt(params) {
  const result = postJson({
    url: `/view/oa/generl/epass-api/jwt/verify`,
    params
  })
  return result;
}

/**
 * 获取应用系统登录名
 * @param {JSON} params
 */
export async function getChildUsersByApp(params) {
  const result = postJson({
    url: `/view/oa/generl/epass-api/api/v3/getChildUsersByApp`,
    params: params.childUsersByAppParams,
    headers: params.headers,
  })
  return result;
}

/**
 * 获取userid
 * @param {JSON} params
 */
export async function getUserId(params) {
  const result = get({
    url: `/view/form/generl/api/common/loginuserid/${params.choosedSubAccount}`,
  })
  return result;
}


