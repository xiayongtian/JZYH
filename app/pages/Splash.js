import React from 'react';
import {StatusBar, StyleSheet, View, ActivityIndicator} from 'react-native';

import {connect} from 'react-redux';
// import {paramsConfig} from '../config';
// import {Storage} from '../utils';
// import {CacheConfigConstants} from '../config/cacheConfigConstants';
/**
 * 欢迎页，包含登录权限判断
 */
class Splash extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // 加载 cache
  loadCache = () => {
    // 发送缓存读取 action
    this.props.dispatch({
      type: 'fontConfig/readConfig',
    });
  };

  // 从 storage 中获取缓存的用户状态
  _bootstrapAsync = async () => {
    console.log('start ...');
    // this.props.navigation.replace('Login');
    // // 缓存中不存在用户信息，进行跳转
    // this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        {/* <ActivityIndicator /> */}
        <StatusBar barStyle="default" />
        {/* <Text>loading ...</Text> */}
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default connect(state => {
  return {...state};
})(Splash);
// })(withNavigation(AuthLoading));
