/**
 * 登录页服务
 */
import { get, postJson,postForm } from '../../../utils';
const baseUrl='http://192.168.90.187:8080'


/**
 * 发送短信验证码
 * @param {JSON} params 
 */
export async function loginServer(params) {
  // const { username, password } = params;
  const result = postJson({
    url: `http://192.168.90.187:8080/system/login/login_App?phone=${params.phone}`,
    // params
  })
  return result;
}

/**
 * 
 * @param {JSON} params
 */
export async function checkLoginName(params) {
  // const { username, password } = params;
  const result = postForm({
    url: `/view/oa/generl/idp/customauth/getUserMobileByLoginName`,
    params
  })
  return result;
}
/**
 * 发送短信验证码
 * @param {JSON} params 
 */
export async function sendVerificationCode(params) {
  // const { username, password } = params;
  const result = postJson({
    url: `/view/oa/generl/epass-api/api/login/sendSMS`,
    params
  })
  return result;
}

/**
 * 短信验证码认证
 * @param {JSON} params 
 */
export async function smsDoAuth(params) {
  // const { username, password } = params;
  const result = postJson({
    url: `/view/oa/login/epass-api/api/auth/doauth?data-userid=${params.username.authUsername}&data-login=true`,
    params
  })
  return result;
}

/**
 * 退出当前登录
 * @param {JSON} params
 */
export async function logout(params) {
  const result = postJson({
    url: `/view/oa/generl/epass-api/api/v3/session/logOffSession`,
    params
  })
  return result;
}
