/**
 * 百宝箱页服务
 */
import {postJson} from '../utils';
// import getHttpBaseConfig from '../config/global/basecommon/httpBaseConfig';
import getServerConfig from '../config/server/config';

/**
 * 查询更新信息
 * @param params
 * @returns {Promise<void>}
 */
export async function getUpdateInfo(params = {}) {
  let url = getServerConfig().baseUrl + '/p';
  console.log('getUpdateInfo, url =', url);
  const result = postJson({
    url,
    params,
    headers: {
      Accept: 'application/json,text/plain',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
  console.warn('getUpdateInfo,result =', result);
  return result;
}
