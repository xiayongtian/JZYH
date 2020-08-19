/**
 * 查看附件
 */
import {get} from '../../../utils';
/**
 * 
 * @param {*} params 
 */
export async function openFile(params){
    // let url =  `/view/file/file?furl=http://xiawei.vicp.io/oa/api/foreign/decisionmeeting/getfile/${params.fileId}`;
    // console.log("附件请求的地址为"+url);
    const result = get({
        url:`${params.url}`
    });
    return result;
  } 