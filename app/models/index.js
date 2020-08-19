// 全局 Models
// import globalModels from './global';
// 用户相磁 Models
import userModels from '../pages/User/models';
// 子账户信息
import subAccountsModels from '../pages/ChooseSubAccounts/models';

// 会议 Models
import meetingPageModels from '../pages/MeetingPage/models/meetingPageModels';

// 附件相关 Models
import openFileModels from '../pages/OpenFile/model/openFileModels';
// // 订阅页相关 Models
// import subscriptionModels from '../pages/Subscription/models';
// // 百宝箱相关 Models
// import toolsModels from '../pages/Tools/models';
// // 我的页相关 Models
// import myModels from '../pages/My/models';
// // 通讯录相关 Models
// import contacts from '../pages/Contacts/models';
// 子应用 model
import subModuleModel from './subModuleModel';
// 通讯录相关 Models
import contact from "../pages/Contact/models";


const models = [
  ...userModels,
  meetingPageModels,
  subModuleModel,
  ...subAccountsModels,
  openFileModels,
  ...contact
  // ...globalModels,
  // ...loginModels,
  // ...approvalModels,
  // ...subscriptionModels,
  // ...toolsModels,
  // ...myModels,
  // ...contacts,
];

export default models;
