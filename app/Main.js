import React from 'react';
import {TextInput, Text} from 'react-native';
// import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';
import {appConfig, appEnv, cacheConfig} from './config';
import {Storage} from './utils';

/**
 * 登录状态判断页
 */
import Splash from './pages/Splash';
/**
 * 应用主路由，含底部导航相关子路由
 */
import AppStack from './routes/AppStack';
import Login from './pages/User/Login';
// import JPush from 'jpush-react-native';
// import {handleAppStateChange} from '../services/activeLogService';

//字体不随系统字体变化
TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {
  defaultProps: false,
});
Text.defaultProps = Object.assign({}, Text.defaultProps, {
  allowFontScaling: false,
});

const Stack = createStackNavigator();

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false, // 是否为登录状态
      isLoading: true, // 默认为加载状态
    };
  }

  /**
   * 是否为登录状态
   */
  initLogin = async () => {
    // await Storage.clear();
    // 缓存中获取用户登录相关信息
    const isLogin = await Storage.get(cacheConfig.user.IS_LOGIN, false);
    const userInfo = await Storage.get(cacheConfig.user.USER_INFO);
    // 更新 model 中状态
    this.props.dispatch({
      type: 'user/updateUserInfo',
      payload: {
        isLogin,
        userInfo,
        from: 'main',
      },
    });
    return isLogin;
  };
  componentDidMount() {
    this.initLogin().then(result => {
      this.setState({
        isLoading: false,
      });
    });

    console.log('是否为开发模式：', __DEV__);
    // 开发模式，显示相关内容
    if (__DEV__) {
      const validate = appConfig.ENABLE_VALIDATE_LOGIN;
      const validateMessage = validate ? '已开启登录验证' : '未开启登录验证';
      if (appConfig.ENV === appEnv.PRODUCT) {
        console.warn(
          '===== 当前运行环境为：[ %s ], %s，请谨慎调试，以免影响生产数据 =====',
          appConfig.ENV,
          validateMessage,
        );
      } else {
        console.warn(
          '===== 当前运行环境为：[ %s ], %s =====',
          appConfig.ENV,
          validateMessage,
        );
      }
    }

    // 加载缓存
    // this.loadCache();
    // 初始化极光推送
    // JPush.initPush();

    // 监听App运行状态
    // AppState.addEventListener('change', handleAppStateChange);
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', handleAppStateChange);
  }

  render() {
    // 是否完成权限加载
    const {isLoading} = this.state;
    // model 中更新登录状态
    const {isLogin} = this.props.user;
    console.log('isLogin', isLogin);
    if (isLoading) {
      // return <Stack.Screen name="Auth" component={AuthLoading} />;
      return <Splash />;
    }
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {isLogin ? (
            <Stack.Screen
              name="App"
              component={AppStack}
              options={{headerShown: false}}
            />
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default connect(state => {
  return {...state};
})(Main);
