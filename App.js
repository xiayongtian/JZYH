import React from 'react';
import { Text, TextInput } from 'react-native';
import { Provider } from 'react-redux';
import { create } from 'dva-core';
import { networkModel } from './app/utils/request';
import { RootSiblingParent } from 'react-native-root-siblings'
// 引入所有 dva model
import models from './app/models';
// 引入入口
import Main from './app/Main';
//字体不随系统字体变化
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {
  defaultProps: false,
});
Text.defaultProps = Object.assign({}, Text.defaultProps, {
  allowFontScaling: false,
});

// 创建dva应用
// const dvaApp = create();

const dvaApp = create({
  // history: createHistory(),
  // 以下为新增内容
  onReducer: r => (state, action) => {
    // 登出,清空 model,只保留指定 model 信息
    if (action.type === 'user/logout') {
      // const { fontConfig, login } = state;
      //  console.log("logout state = ", state);
      // // 保存登录及全局字体设置信息
      // const savedState = { login, fontConfig };
      // 退出登录时清空所有state
      const savedState = {};
      // console.log("logout savedState = ", savedState);
      return savedState;
    } else {
      return r(state, action);
    }
  },
  onError(e) {
    console.error(e.message);
  },
});

models.forEach(o => {
  // 装载models对象
  dvaApp.model(o);
});
dvaApp.model(networkModel);

dvaApp.start(); // 实例初始化

const store = dvaApp._store; // 获取redux的store对象供react-redux使用
console.log("store", store)

export default class Container extends React.Component {
  render() {
    return (
      <Provider store={store}>
        {/* RootSiblingParen加在此处主要为了解决toast在rn版本为0.62的android上面不显示问题 */}
        <RootSiblingParent>
          <Main />
        </RootSiblingParent>
        {/* <Main /> */}
      </Provider>
    );
  }
}
