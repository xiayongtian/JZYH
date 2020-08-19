/**
 * 审批详情服务
 */
import { get, postForm } from "../utils";
import { commonRequestParamsConfig } from "../config";

/**
 * 获取审批数据
 * @param {JSON} params
 */
export async function getApprovalDetailInfo(params) {
  /*
      return get({
       url: "/view/hr/getWorkflowRequest/services/WorkflowService",
       params: {
          "data-application":"hxyhd"
        }
      });
    */
  return postForm({
    // url: "/view/workflow/getWorkflowRequest/services/WorkflowService",
    url: "/view/hr/getWorkflowRequest/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 获取表单字段配置
 * @param {JSON} params
 */
export async function getFormAttributeConfig(params) {
  /*
      return get({
       url: "/view/hr/getWorkflowRequest/services/WorkflowService",
       params: {
          "data-application":"hxyhd"
        }
      });
    */
  return get({
    url: "/view/oa/getWFAttriByWFID/ilinkapi/OA/GetWFAttriByWFID",
    params: {
      ...params
    }
  });
}

/**
 * 提交/驳回操作
 * @param {JSON} params
 */
export async function doSubmit(params) {
  return postForm({
    url: "/view/workflow/submitWorkflowRequest/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 回复
 * @param {JSON} params
 */
export async function givingOpinions(params) {
  return postForm({
    url: "/view/workflow/givingOpinions/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 催办
 * @param {JSON} params
 */
export async function getSendEmail(params) {
  return postForm({
    url: "/view/workflow/getSendEmail/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 加签
 * @param {JSON} params
 */
export async function setCountersign(params) {
  return postForm({
    url: "/view/workflow/setCountersign/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 减签
 * @param {JSON} params
 */
export async function getSignOffOperate(params) {
  return postForm({
    url: "/view/workflow/getSignOffOperate/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 获取减签人员数据
 * @param {JSON} params
 */
export async function getSignOffResource(params) {
  return postForm({
    url: "/view/workflow/getSignOffResource/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 转办、意见征询、转发操作
 * @param {JSON} params
 */
export async function doForward(params) {
  return postForm({
    url: "/view/workflow/forward2WorkflowRequest/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 获取是否支持自由结点驳回
 * @param {JSON} params
 */
export async function isFreeReject(params) {
  console.log("isFreeReject,params", params);
  return postForm({
    url: "/view/workflow/isFreeReject/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 获取减签人员数据
 * @param {JSON} params
 */
export async function getRejectableNodeids(params) {
  return postForm({
    url: "/view/workflow/getRejectableNodeids/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 自由驳回提交
 * @param {JSON} params
 */
export async function rejectWorkflowRequest(params) {
  return postForm({
    url: "/view/workflow/rejectWorkflowRequest/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 获取审批日志
 * @param {JSON} params
 */
export async function getWorkflowRequestLogs(params) {
  return postForm({
    url: "/view/workflow/getWorkflowRequestLogs/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 获取模型数据（包含领导、证件、车辆）
 * @param {JSON} params
 */
export async function getAllModeDataList(params) {
  return postForm({
    url: "/view/hr/getAllLeaderList/services/ModeDateSinochemService",
    params: {
      ...params
    }
  });
}

/**
 * 获取驳回按钮权限
 * @param {JSON} params
 */
export async function getRejectButton(params) {
  return postForm({
    url: "/view/workflow/isReject/services/WfIsReject",
    params: {
      ...params
    }
  });
}

/**
 * 获取按钮权限（含驳回、转发、加签、减签）
 * @param {JSON} params
 */
export async function getAvailableButtons(params) {
  // 驳回
  const rejectButtonRequest = postForm({
    url: "/view/workflow/isReject/services/WfIsReject",
    params: {
      "data-xml": params.dataReject
    }
  });
  // 减签
  const signOffButtonRequest = postForm({
    url: "/view/workflow/getCanSignOff/services/WorkflowService",
    params: {
      "data-xml": params.dataSignOff
    }
  });
  // 转发
  const remarkButtonRequest = postForm({
    url: "/view/workflow/isRemark/services/WorkflowService",
    params: {
      "data-xml": params.dataRemark
    }
  });
  // 加签
  const counterSignButtonRequest = postForm({
    url: "/view/workflow/getCountersign/services/WorkflowService",
    params: {
      "data-xml": params.dataCountersign
    }
  });
  // 减签人员列表
  const signOffResourceRequest = postForm({
    url: "/view/workflow/getSignOffResource/services/WorkflowService",
    params: {
      "data-xml": params.dataSignOffResource
    }
  });
  return Promise.all([
    rejectButtonRequest,
    signOffButtonRequest,
    remarkButtonRequest,
    counterSignButtonRequest,
    signOffResourceRequest
  ])
    .then(result => {
      // console.log("getAvailableButtons, result = ", result);
      return result;
    })
    .catch(error => {
      console.log("getAvailableButtons, error = ", error);
    });
}

/**
 * 获取文件预览信息
 * @param {JSON} params
 */
export async function getFilePreviewInfo(params) {
  console.log("getFilePreviewInfo , params = ", params);
  return postForm({
    url: "/view/docInfo/getDoc/preview",
    params: {
      ...params
    }
  });
}

/**
 * 判断节点是否需要根据选择领导带出审批语
 * @param {JSON} params
 */
export async function getOAWfAttri(params) {
  return get({
    url: "/view/oa/getOAWfAttri/ilinkapi/HD/GetOAWfAttri",
    params: {
      ...params
    }
  });
}

/**
 * 获取领导审批语
 * @param {JSON} params
 */
export async function getApproveMessage(params) {
  return postForm({
    url: "/view/workflow/getApproveMessage/services/approveMessageDao",
    params: {
      ...params
    }
  });
}

/**
 * 获取审批语
 * @param {JSON} params
 */
export async function getAGApproveMessage(params) {
  return postForm({
    url: "/view/workflow/getAGApproveMessage/services/nyApproveMessageDao",
    params: {
      ...params
    }
  });
}
/**
 * 获取驳回自由环节列表
 * @param {*} params
 */
export async function getRejectableNodeidList(params) {
  console.log("getRejectableNodeidList,params", params);
  return postForm({
    url: "/view/workflow/getRejectableNodeids/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 获取驳回自由环节结果
 * @param {*} params
 */
export async function freeRejectSubmit(params) {
  console.log("freeRejectSubmit,params", params);
  return postForm({
    url: "/view/workflow/rejectWorkflowRequest/services/WorkflowService",
    params: {
      ...params
    }
  });
}

/**
 * 回复提交
 */
export async function givingOpinionsSubmit(params) {
  console.log("givingOpinionsSubmit,params", params);
  return postForm({
    url: "/view/workflow/givingOpinions/services/WorkflowService",
    params: {
      ...params
    }
  });
}
/**
 * 催办提交
 * @param {*} params
 */
export async function urgeSubmit(params) {
  console.log("givingOpinionsSubmit,params", params);
  return postForm({
    url: "/view/workflow/getSendEmail/services/ReminderEmail",
    params: {
      ...params
    }
  });
}

/**
 * 获取审批文档详情session
 * @param {JSON} params
 */
export async function getZwSession(params) {
  console.log("getZwSession ,params = ", params);
  return postForm({
    url: "/view/hr/login/services/DocService",
    params: {
      "data-xml": `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:doc="http://localhost/services/DocService"><soapenv:Header/><soapenv:Body><doc:login><doc:in0>${params.userId}</doc:in0><doc:in1>${params.encryptUserId}</doc:in1><doc:in2>0</doc:in2><doc:in3>${commonRequestParamsConfig.TARGET_SERVER_IP}</doc:in3></doc:login></soapenv:Body></soapenv:Envelope>`
    }
  });
}

/**
 * 获取审批文档详情
 * @param {JSON} params
 */
export async function getZwDetail(params) {
  console.log("getZwDetail,params = ", params);
  return postForm({
    url: "/view/hr/getDoc/services/DocService",
    params: {
      "data-xml": `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:doc="http://localhost/services/DocService"><soapenv:Header/><soapenv:Body><doc:getDoc><doc:in0>${params.id}</doc:in0><doc:in1>${params.session}</doc:in1><doc:in2>${params.requestid}</doc:in2></doc:getDoc></soapenv:Body></soapenv:Envelope>`
    }
  });
}

/**
 * 根据关键字查询人员列表
 * @param {JSON} params
 */
export async function getDelPortalContact(params) {
  console.log(params,'这是传递的参数')
  return get({
    url:
      "/view/contact/getPersonsList/ilinkapi/Contact/GetCT_PersonsList",
    params: {
      ...params
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

/**
 * 选人组件中用到
 * 判断人员是否离职接口 返回值如下 Data 中 按索引为1的未离职,其他为已离职
 * {
 *   "ResultCode": "0",
 *   "ResultMsg": "",
 *   "Data": "1,1,1"
 * }
 */
export async function getPersonStatus(params) {
  const url = '/view/ilinkUser/avatar/ilinkapi/HR/GetPersonStatusById';
  const {
    userCode,
    ids,
  } = params;
  const appId = commonRequestParamsConfig.APP_ID;

  return get({ url: `${url}?AppId=${appId}&UserCode=${userCode}&ids=${ids}` });
}

/**
 * 请求可以显示 "是否需要安全总监审批" 字段的相关信息的接口
 */
export async function getAllModeDataListNew() {
  const xmlData = '<soapenv:Envelope ' +
    'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:doc="http://localhost/services/DocService">' +
    '<soapenv:Header/>' +
    '<soapenv:Body>' +
    '<mod:getAllModeDataList>' +
    '<mod:in0>96804</mod:in0>' +
    '<mod:in1>1</mod:in1>' +
    '<mod:in2>10</mod:in2>' +
    '<mod:in3>100</mod:in3>' +
    '<mod:in4>1</mod:in4>' +
    '<mod:in5></mod:in5>' +
    '<mod:in6>N</mod:in6>' +
    '<mod:in7>N</mod:in7>' +
    '</mod:getAllModeDataList>' +
    '</soapenv:Body>' +
    '</soapenv:Envelope>';
  return postForm({
    url: '/view/workflow/isShowSFXYAQZJSP/services/ModeDateSinochemService',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: {
      'data-xml': xmlData
    },
  });
}

/**
 * 请求 QZDL 权责大类 相关数据列表
 */
export async function getQZDLList() {
  const xmlData = '<soapenv:Envelope ' +
    'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:doc="http://localhost/services/DocService">' +
    '<soapenv:Header/>' +
    '<soapenv:Body>' +
    '<mod:getAllModeDataList>' +
    '<mod:in0>96301</mod:in0>' +
    '<mod:in1>1</mod:in1>' +
    '<mod:in2>1000</mod:in2>' +
    '<mod:in3>1000</mod:in3>' +
    '<mod:in4>1</mod:in4>' +
    '<mod:in5></mod:in5>' +
    '<mod:in6>N</mod:in6>' +
    '<mod:in7>N</mod:in7>' +
    '</mod:getAllModeDataList>' +
    '</soapenv:Body>' +
    '</soapenv:Envelope>';
  return postForm({
    url: '/view/workflow/isShowSFXYAQZJSP/services/ModeDateSinochemService',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },
    params: {
      'data-xml': xmlData
    },
  });
}

/**
 * 请求 QZZL 权责子类 相关数据列表
 * @param params {{ qzdlId : string }} 参数为权责大类的ID
 *
 */
export async function getQZZLList(params) {
  // 权责大类的 ID
  const { qzdlId } = params;
  const xmlData = '<soapenv:Envelope ' +
    'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:doc="http://localhost/services/DocService">' +
    '<soapenv:Header/>' +
    '<soapenv:Body>' +
    '<mod:getAllModeDataList>' +
    '<mod:in0>96802</mod:in0>' +
    '<mod:in1>1</mod:in1>' +
    '<mod:in2>1000</mod:in2>' +
    '<mod:in3>1000</mod:in3>' +
    '<mod:in4>1</mod:in4>' +
    `<mod:in5>dyqzdl=${qzdlId}</mod:in5>` +
    '<mod:in6>N</mod:in6>' +
    '<mod:in7>N</mod:in7>' +
    '</mod:getAllModeDataList>' +
    '</soapenv:Body>' +
    '</soapenv:Envelope>';
  return postForm({
    url: '/view/workflow/isShowSFXYAQZJSP/services/ModeDateSinochemService',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    params: {
      'data-xml': xmlData,
    },
  });
}


/**
 * 请求 QZSX 权责事项 相关数据列表
 * @param params {{ qzdlId : string }} 参数为权责大类的ID
 *
 */
export async function getQZSXList(params) {
  // 权责大类的 ID
  const { qzdlId, qzzlId } = params;
  const xmlData = '<soapenv:Envelope ' +
    'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:doc="http://localhost/services/DocService">' +
    '<soapenv:Header/>' +
    '<soapenv:Body>' +
    '<mod:getAllModeDataList>' +
    '<mod:in0>96803</mod:in0>' +
    '<mod:in1>1</mod:in1>' +
    '<mod:in2>1000</mod:in2>' +
    '<mod:in3>1000</mod:in3>' +
    '<mod:in4>1</mod:in4>' +
    `<mod:in5>dyqzdl=${qzdlId} and dyqzzl=${qzzlId}</mod:in5>` +
    '<mod:in6>N</mod:in6>' +
    '<mod:in7>N</mod:in7>' +
    '</mod:getAllModeDataList>' +
    '</soapenv:Body>' +
    '</soapenv:Envelope>';
  return postForm({
    url: '/view/workflow/isShowSFXYAQZJSP/services/ModeDateSinochemService',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    params: {
      'data-xml': xmlData,
    },
  });
}

/**
 * 获取批分配置接口
 * @param params 接口参数
 */
export async function selectBatchConfigInterface(params) {
  // 当前流程的节点ID
  const { nodeId } = params;
  const xmlData = '<soapenv:Envelope ' +
    'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:web="webservices.services.weaver.com.cn">' +
    '<soapenv:Header/>' +
    '<soapenv:Body>' +
    '<web:selectBatchConfig>' +
    `<web:in0>${nodeId}</web:in0>` +
    '</web:selectBatchConfig>' +
    '</soapenv:Body>' +
    '</soapenv:Envelope>';
  return postForm({
    url: '/view/workflow/selectBatchConfig/services/MobileInterfaceService',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    params: {
      'data-xml': xmlData,
    },
  });
}

/**
 * 获取领导审批语接口
 * @param params 接口参数
 */
export async function getLeaderApprovalMessage(params) {
  // 当前流程的节点ID
  // String method
  // Int type （0为发文，1内情，2便函）
  // Int userid用户id
  // String leaderid领导id
  const { method, type, userId, leaderId } = params;
  const xmlData = '<soapenv:Envelope ' +
    'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
    'xmlns:doc="doc.webservice.jichao.sinochem.interfaces.weaver">' +
    '<soapenv:Header/>' +
    '<soapenv:Body>' +
    '<doc:getMessage>' +
    `<doc:in0>${method}</doc:in0>` +
    `<doc:in1>${type}</doc:in1>` +
    `<doc:in2>${userId}</doc:in2>` +
    `<doc:in3>${leaderId}</doc:in3>` +
    '</doc:getMessage>' +
    '</soapenv:Body>' +
    '</soapenv:Envelope>';
  return postForm({
    url: '/view/workflow/getMessage/services/approveMessageDao',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    params: {
      'data-xml': xmlData,
    },
  });
}

/**
 * 根据特殊人员角色id获取到角色人员列表
 * @param params 接口参数 传入角色ID
 * @return {Promise<*>}
 */
export async function getPersonListByRoleId(params) {
  const { roleId } = params;
  const url = `/view/ilinkUser/getPersonListByRoleId/ilinkapi/OA/GetPersonListByRoleID?roleid=${roleId}`;
  return get({ url });
}
