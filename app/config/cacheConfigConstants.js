/**
 * 缓存常量名定义
 */
export const CacheConfigConstants = {
  // 审批相关缓存名
  approval: {
    LEFT_MENU_TOTAL_COUNT_CACHE: "approval.leftMenuTotalCount", //左侧菜单总数缓存
    LEFT_TODO_TASK_GROUP_GRID_CACHE: "approval.leftTodoTaskGroupGrid", //左侧底部九宫格导航缓存
    RIGHT_TODO_LIST_FIRST_PAGE: "approval.rightTodoListFirstPage", // 右侧待办列表首页数据缓存
    RIGHT_DONE_LIST_FIRST_PAGE: "approval.rightDoneListFirstPage", // 右侧已办列表首页数据缓存
    RIGHT_PROCESSED_LIST_FIRST_PAGE: "approval.rightProcessedListFirstPage", // 右侧办结列表首页数据缓存

    COMMON_APPROVAL_TEXT: "approval.commonApprovalText", // 提交 或 驳回 页面的常用审批语

    TOP_TODO_BY_TYPE: "approval.topTodo", // 根据待办类型获取置顶待办
    TOP_TODO_ALL:"approval.topTodoAll", //所有置顶的待办
  },
  approvalDetail: {
    /**
     * 工作流基础配置
     */
    WORKFLOW_CACHE_CONFIG_BASE_KEY: "approvalDetail.workflowCacheConfigBaseKey_",
    /**
     * 工作流模型数据缓存基础key
     */
    WORKFLOW_MODE_DATA_CACHE_BASE_KEY: "approvalDetail.workflowModeDataCacheConfigBaseKey_"
  },
  user: {
    USER_INFO: "user.userInfo", //保存登录状态
    GESTRUE_PASSWORD: "user.gesturePassword", //缓存手势密码
    OPEN_GESTRUE_PASSWORD: "user.openGesturePassword", //保存是否开启手势密码
    OPEN_FACE_LOGIN: "user.openFaceLogin", //保存是否开启手势密码
    OPEN_TOUCH_LOGIN: "user.openTouchLogin", //保存是否开启手势密码
    USERNAME: "user.username", //用户名
    LOGIN_TIMES: "user.loginTimes", //用户登录次数
    USER_ORG: "user.orgInfo", // 保存用户组织信息
    USER_AGENT:"user.userAgent", //用户代理信息
    LAST_LOGIN_Time: "user.lastLoginTime", // 保存用户最后登录时间
    FIRST_INSTAlL_APP: "user.firstInstallApp" // 用户第一次安装
  },
  tools: {
    BANNER_IMAGE: "bannerImage",
    OTHER_COLUMN: "otherColumn"
  },
  orgTree: {
    COMPANY_LIST_A: "companyTreeA", //公司列表缓存有选择权
    COMPANY_LIST_B: "companyTreeB", //公司列表缓存无选择权
    HISTORY_LIST: "personList", //选择人员历史列表
    HISTORY_LIST_DEPT: "DEPTlIST" //选择部门历史列表
  },
  subscription: {
    LEVEL_ONE_MENU: "subscription.levelOneMenu" // 订阅 一级菜单
  },
  searchHistory: {
    SEARCH_HISTORY: "user.searchHistory", //缓存搜索记录
  },
  lastVisit: {
    LAST_VISIT: "user.lastVisit", //缓存最近访问记录
    JUDGE_REPEAT_VISIT: "user.judgeRepeatVisit",  //用来去除重复访问的数组
  }
};
