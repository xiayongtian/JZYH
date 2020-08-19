import {createAction, Storage} from '../../utils';
/**
 * 应用配置常量及文字配置
 */
import {globalConfig} from '../../config';
/**
 * 文字配置 Model
 */
const fontConfigModel = {
  namespace: 'fontConfig',
  state: {
    // 文字缩放比
    fontScale: 1,
  },
  effects: {
    /**
     * 读取文字配置
     */
    *readConfig(action, {call, put}) {
      // console.log("readConfig = ", action);
      let fontScale = yield call(Storage.get, globalConfig.AppFontScaleConfig);
      fontScale = fontScale || globalConfig.fontScaleLevel.SMALL;
      yield put(createAction('updateFontScale')({fontScale}));
    },
    /**
     * 保存文字配置
     */
    *saveConfig(action, {call, put}) {
      // console.log("saveConfig = ", action);
      const {
        payload: {fontScale},
      } = action;
      // 调用异步存储持久化配置
      yield call(Storage.set, globalConfig.AppFontScaleConfig, fontScale);
      // 更新文字缩放比，所有文字缩放组件同步重新计算
      yield put(
        createAction('updateFontScale')({
          fontScale,
        }),
      );
    },
  },
  reducers: {
    /**
     * 更新文字缩放比，所有文字缩放组件同步重新计算
     * @param {原始state} state
     * @param {发送的action} action
     */
    updateFontScale(state, action) {
      const {
        payload: {fontScale},
      } = action;
      return {...state, fontScale};
    },
  },
};

export default fontConfigModel;
