/**
 * 会议
 */
import {get} from '../../../utils';

/**
 * 会议列表
 * @param {JSON} params
 */
export async function meetingList(params){
  const result = get({
    url:`/view/form/generl/api/foreign/decisionmeeting/my_meeting/${params.userid}/${params.issueType}/${params.sdate}/${params.edate}?orderByColumn=${params.orderByColumn}&isAsc=${params.isAsc}&pageSize=${params.pageSize}&pageNum=${params.pageNum}`,
   
  });
  return result;
}
/**
 * 会议详情
 * @param {JSON} params
 */
export async function meetingDetail(params){
  const result = get({
    url:`/view/form/generl/api/foreign/decisionmeeting/meeting/${params.id}`,
  });
  return result;
} 