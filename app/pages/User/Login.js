import React, { Component } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Platform,
  PermissionsAndroid
} from 'react-native';
// import SmartButton from 'react-native-smart-button';
import Orientation from 'react-native-orientation';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
// 引入公共配置信息
import { cacheConfig } from '../../config';
import getServerConfig from '../../config/server/config';
import { Storage, LoadingUtils, ToastUtils } from '../../utils';
import { AutoText, AutoTextInput } from '../../components';
import VerificationCode from '../../components/VerificationCode';
import md5 from 'js-md5';

import reactNativeAttachmentViewer from 'react-native-attachment-viewer'

// import {
//   moduleLogEnd,
//   moduleLogStart,
//   realTimeInfo,
// } from '../../services/activeLogService';

const { width } = Dimensions.get('window');
const serverConfig = getServerConfig();
class Login extends Component {
  constructor(props) {
    super(props);
    // const init = Orientation.getInitialOrientation();
    // console.log("Login, init orientation = ", init);
    // const init = "LANDSCAPE"; // 初始为横屏
    this.state = {
      // username: 'appportal',
      username: '15614209693',
      password: '123456',
      enableLogin: false, // 控制登录按钮可点击状态
      openPassword: true, // 控制密码框是否显示为密码
      smsCode: ''
    };
  }

  /**
   * 更新按钮状态
   */
  updateLoginButtonStatus = () => {
    const { username } = this.state;
    if (
      username &&
      username.trim() !== ''
    ) {
      this.setState({
        enableLogin: false,
      });
    } else {
      this.setState({
        enableLogin: true,
      });
    }
  };
  // 添加读写权限
  requestReadPermission = async () => {
    try {
      //返回string类型
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // {
        //   'title': 'need read permission',
        //   'message': 'the project need read permission '
        // }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("你已获取了读写权限")
      } else {
        console.log("获取读写权限失败")
      }
    } catch (err) {
      this.show(err.toString())
    }
  };


  /**
   * 登录
   */
  login = async () => {
    if (this.state.username.trim() === '') {
      ToastUtils.show('请输入用户名！');
      return;
    } else if (!this.state.password) {
      ToastUtils.show('密码不能为空！');
      return
    }

    // 设置加载中状态
    // LoadingUtils.show('努力登录中...');
    console.log('ooooooooooooo-----ooooo', this.state.smsCode)
    this.props
      .dispatch({
        type: 'user/login',
        payload: {
          phone: this.state.username
        }
      })
      .then(async result => {
        // 设置加载完成
        if (result.status == 'success') {
          
          console.warn("========获取到的result.data-userstore", result.dataUserstore)
          // 存入storage，防止系统杀死进程之后dataUserstore消失
          await Storage.set('dataUserstore', result.dataUserstore);
          // 存储useruserstore
          serverConfig.dataUserstore = result.dataUserstore
          // console.log("========获取到的userstoreuserstoreuserstore",userstore)
          LoadingUtils.hide();
        } else {
          ToastUtils.show(result.msg);
          LoadingUtils.hide();

        }
      });
  };

  componentDidMount = async () => {
    this.requestReadPermission()
    // 缓存中获取存储的用户名
    const username = await Storage.get(CacheConfigConstants.user.USERNAME);
    console.log('cacheConfig', cacheConfig);
    const userCache = await Storage.get(cacheConfig.user.USER_INFO);
    if (userCache != null) {
      // 使用缓存数据更新界面
      const { useridShort } = userCache;
      this.setState(
        {
          username: useridShort,
        },
        () => {
          this.updateLoginButtonStatus();
        },
      );
    } else {
      this.updateLoginButtonStatus();
    }
    Orientation.addOrientationListener(this._updateOrientation);
  };

  _updateOrientation = orientation => {
    // console.log("_updateOrientation, orientation = ", orientation);
    this.setState({ orientation });
  };

  componentWillUnmount() {
    // Remember to remove listener
    // Orientation.removeOrientationListener(this._updateOrientation);
  }

  /**
   * 清空用户名
   */
  _clearUsername = () => {
    if (this.usernameNode) {
      this.usernameNode.focus();
    }
    this.setState(
      {
        username: '',
      },
      () => {
        this.updateLoginButtonStatus();
      },
    );
  };
  test = () => {
    reactNativeAttachmentViewer.showAttchment('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592389595283&di=4f00c16b817f765c4a6c842ef48185b7&imgtype=0&src=http%3A%2F%2Fa3.att.hudong.com%2F14%2F75%2F01300000164186121366756803686.jpg')
  }
  /**
   * 明文和密文展示密码
   * @private
   */
  _showPassword = () => {
    const { openPassword } = this.state;
    if (openPassword) {
      this.setState({
        openPassword: false,
      });
    } else {
      this.setState({
        openPassword: true,
      });
    }
  };

  _renderTextInputButton = (imgUrl, eventCallBack) => {
    return (
      <TouchableOpacity
        style={styles.btnOperate}
        onPress={() => {
          eventCallBack();
        }}>
        <Image source={imgUrl} />
      </TouchableOpacity>
    );
  };

  changeLoginStatus(loginStatus) {
    this.setState({
      loginStatus,
    });
  };
  gener = () => {
    const currentTime = '20200601060501';
    const randomstr = '51321498';
    const operator = 'padappportal';
    const encode = md5(operator + randomstr + currentTime + 'padappportal_2020').toUpperCase()
    console.log('-----------encode-----------', encode)
  }
  render() {
    const {
      orientation,
      textUserBorder,
      textPassBorder,
      verificationCodeBorder,
      openPassword,
      username,
      enableLogin,
    } = this.state;
    let loginViewButton = (
      <TouchableOpacity
        disabled={enableLogin}
        style={[
          styles.login,
          {
            paddingHorizontal: orientation === 'PORTRAIT' ? 0.2 * width : 120,
            backgroundColor: enableLogin ? '#92A1FF' : '#6da0f3',
          },
        ]}
        onPress={this.login}>
        <AutoText style={styles.btnLogin}>登录</AutoText>
        {/* <SelectPosition onRef={(ref) => { this.$SelectPositionChild= ref }}/> */}
      </TouchableOpacity>
    );
    const bottomHeight = orientation === 'PORTRAIT' ? 68 : 10;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}>
        <ScrollView
          // style={styles.body} 
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: '#FFF',
            // paddingBottom:80
          }}
          keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View
            // style={{
            //   justifyContent: 'flex-start',
            // }}
            >
              <AutoText style={styles.title}>Hello，</AutoText>
            </View>
            <View
              style={{
                ...styles.subTitleContainer,
                paddingBottom: bottomHeight,
              }}>
              <AutoText style={styles.subTitle}>欢迎使用锦州银行移动门户pad版</AutoText>
            </View>
            <View style={styles.formContainer}>
              <View >
                <View
                  style={
                    textUserBorder ? styles.usernameFocus : styles.username
                  }>
                  {!!username
                    ? this._renderTextInputButton(
                      require('../../images/login/icon_delete.png'),
                      this._clearUsername,
                    )
                    : null}
                  <AutoTextInput
                    realDomRef={r => (this.usernameNode = r)}
                    placeholder="请输入用户名"
                    multiline={false}
                    numberOfLines={4}
                    autoCapitalize="none"
                    onChangeText={username => {
                      if (username.length > 30) return;
                      this.setState({ username }, () => {
                        this.updateLoginButtonStatus();
                      });
                    }}
                    value={this.state.username}
                    // disableFullscreenUI={true}
                    onBlur={() => {
                      this.setState({
                        textUserBorder: false,
                      });
                    }}
                    style={styles.placeholder}
                    onFocus={() => {
                      this.setState({
                        textUserBorder: true,
                      });
                    }}
                  />
                </View>
                <View
                  style={
                    textPassBorder ? styles.passwordFocus : styles.password
                  }>
                  {this._renderTextInputButton(
                    openPassword
                      ? require('../../images/login/icon_hide.png')
                      : require('../../images/login/icon_show.png'),
                    this._showPassword,
                  )}
                  <AutoTextInput
                    placeholder="请输入密码"
                    multiline={false}
                    secureTextEntry={openPassword}
                    numberOfLines={4}
                    onChangeText={password => {
                      if (password.length > 30) return;
                      this.setState({ password }, () => {
                        this.updateLoginButtonStatus();
                      });
                    }}
                    value={this.state.password}
                    onBlur={() => {
                      this.setState({
                        textPassBorder: false,
                      });
                    }}
                    onFocus={() => {
                      this.setState({
                        textPassBorder: true,
                      });
                    }}
                    style={styles.placeholder}
                  />
                </View>
                {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={
                    verificationCodeBorder ? styles.validCodeFocus : styles.verificationCode
                  }>
                    <AutoTextInput
                      placeholder="请输入验证码"
                      multiline={false}
                      // secureTextEntry={openPassword}
                      numberOfLines={4}
                      onChangeText={smsCode => {
                        if (smsCode.length > 30) return;
                        this.setState({ smsCode }, () => {
                          this.updateLoginButtonStatus();
                        });
                      }}
                      value={this.state.smsCode}
                      onBlur={() => {
                        this.setState({
                          verificationCodeBorder: false,
                        });
                      }}
                      onFocus={() => {
                        this.setState({
                          verificationCodeBorder: true,
                        });
                      }}

                      style={styles.placeholder}
                    />
                  </View>
                  <View style={{ alignSelf: 'center' }}>
                    <VerificationCode
                      enable={true}
                      timerCount={60}
                      // username={this.state.username}
                      // password={this.state.password}
                      loginName={this.state.username}
                      onClick={(_shouldStartCount) => {

                        _shouldStartCount(true)

                      }} />
                  </View>
                </View> */}
              </View>
            </View>
            {loginViewButton}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: 50,
    justifyContent: 'center',
    // paddingTop: 50,
    backgroundColor: '#fff',
  },
  title: { fontSize: 60 },
  subTitleContainer: {
    paddingTop: 12,
  },
  subTitle: { fontSize: 28 },
  formContainer: {
    width: 0.5 * width,
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 45,
    maxWidth: 390,
  },
  username: {
    // backgroundColor: "#bfa",
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D826',
    height: 70,
    justifyContent: 'center',
  },
  usernameFocus: {
    // backgroundColor: "#bfa",
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#6da0f3',
    height: 70,
    justifyContent: 'center',
  },

  password: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D826',
    height: 70,
    justifyContent: 'center',

  },

  passwordFocus: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#6da0f3',
    height: 70,
    justifyContent: 'center',
  },

  verificationCode: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#D8D8D826',
    height: 70,
    justifyContent: 'center',
    flex: 1,

  },
  validCodeFocus: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#6da0f3',
    height: 70,
    justifyContent: 'center',
    flex: 1,
    // flexDirection:"row"

  },
  btnOperate: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 70,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLogin: { fontSize: 22, color: '#fff' },
  login: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 57,
    paddingHorizontal: 0.21 * width,
  },
  textInputStyle: {
    borderBottomWidth: 1,
  },
  placeholder: {
    fontSize: 20,
  },
  selectLogin: {
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#4A5FE2',
  },
  noSelectLogin: {
    flex: 1,
    alignItems: 'center',
  },
  selectTextStyle: {
    fontSize: 14,
    paddingBottom: 12,
    color: '#4A5FE2',
  },
  noSelectTextStyle: {
    fontSize: 14,
    paddingBottom: 12,
    color: '#252525',
    alignItems: 'center',
  },
});
export default connect(state => {
  return { ...state };
})(withNavigation(Login));
