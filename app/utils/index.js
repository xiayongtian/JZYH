export {NavigationActions, StackActions} from 'react-navigation';

export {default as Storage} from './storage';

// export {getPrettyDate, getDayGroup} from './dateUtils';

// export {getUserAgent} from './getUserAgent';

export {get, postJson, postForm} from './request';
export { setUserStoreUrl,
  getSuffix,
  isSupporOfficetAttachment,
  isSupportAttachment,} from './hori';
// export {
//   formatString,
//   appendUrlRandomParam,
//   appendUrlParams,
//   transformNumberToString,
// } from './stringUtils';

export const delay = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const createAction = (type) => (payload) => ({type, payload});

// export {default as des} from './des';

// export {isSupportFileType} from './fileUtils';
/**
 * Toast 工具类
 */
export {default as ToastUtils} from './toast';
/**
 * loading 加载工具类
 */
export {default as LoadingUtils} from './LoadingUtils';
/**
 * 公共样式
 */
export {default as commonStyles} from './commonStyles';
// /**
//  * Alert 工具类
//  */
// export {default as AlertUtils} from './AlertUtils';
