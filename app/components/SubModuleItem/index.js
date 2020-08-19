import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  NativeModules,
  Platform,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import * as Progress from 'react-native-progress';
import Proptypes from 'prop-types';
// import AutoText from "../AutoText";
// 文件操作
import RNFS from 'react-native-fs';
// 压缩包操作
import {unzip} from 'react-native-zip-archive';
// const { RNZipArchive } = NativeModules;
import Submodule from 'react-native-submodule';
import {LoadingUtils} from '../../utils';
// const RNZipArchive = NativeModules.RNZipArchive
/**
 * 子应用入口组件
 */
class SubModuleItem extends Component {
  static propTypes = {
    onPress: Proptypes.func, // 点击触发方法
    appId: Proptypes.string, // 应用唯一标识
  };

  state = {
    progress: 0, // 下载进度
    showDownloading: false, // 是否显示下载遮罩
    contentLength: 0, // 下载文件大小
  };

  // 检测版本更新
  checkVersion = () => {
    // const path = RNFS.DocumentDirectoryPath + "/" + Math.random() + ".zip";
    // 判断是否有本地子应用版本
    const {appId} = this.props;
    // 拼装子模块入口路径
    let bundleFilePath = '';
    // 基础包保存路径
    let basePath = '';
    if (Platform.OS === 'ios') {
      basePath = RNFS.DocumentDirectoryPath + '/' + appId + '/bundles';
      // 保存在沙盒中
      bundleFilePath = basePath + '/index.ios.bundle';
    } else {
      basePath = RNFS.DocumentDirectoryPath + '/' + appId + '/bundles';
      // 保存在应用的 files 目录中，例：/data/user/0/com.sinochem.portalhd.test/files/b234117511c7412da2586eb81fe4ca90/bundles/index.android.bundle
      bundleFilePath = basePath + '/index.android.bundle';
    }

    console.log('checkVersion, path =', bundleFilePath);
    // 判断是否存在相关资源文件
    RNFS.exists(bundleFilePath).then((result) => {
      console.log('checkVersion,file exists?', result);
      // 不存在进行升级检测操作
      if (!result) {
        console.log('当前无子应用版本');
        console.log('basePath', basePath);
        RNFS.mkdir(RNFS.DocumentDirectoryPath + '/' + appId).then((result) => {
          console.log('创建文件夹：', result);
        });
        // 查询平台版本
        this.getUpdateInfo('0');
      } else {
        // 存在历史版本，检查版本号
        // 保存在应用的 files 目录中，例：/data/user/0/com.sinochem.portalhd.test/files/b234117511c7412da2586eb81fe4ca90/bundles/vesion
        const versionFile = basePath + '/version';
        // 读取版本文件内容
        RNFS.readFile(versionFile).then((result) => {
          // result = 'ssss';
          // 判断是否获取到有效版本信息
          const isInteger = Number.isInteger(parseInt(result));
          let oldVersion = '0'; // 版本号默认为 0，需进行更新操作
          if (isInteger) {
            // 存在有效版本信息
            oldVersion = result;
          }
          console.log('version:%o', result);
          // 进行更新检查操作
          this.getUpdateInfo(oldVersion);
        });
      }
    });
  };

  getUpdateInfo = (versionCode) => {
    // 查询平台版本
    let platformId = '1'; // 默认为 anroid
    if (Platform.OS === 'ios') {
      platformId = '2'; // ios
    } else {
      platformId = '1'; // android
    }
    const {appId: appKey} = this.props;
    // 版本检测请求参数
    const queryParams = {
      body: {
        resourceVersion: versionCode,
        platformId,
      },
      head: {
        service: 'updateService',
        method: 'getUpdateInfo',
        appKey,
      },
    };
    // console.log("queryParams", queryParams);
    this.props
      .dispatch({
        type: 'subModule/getUpdateInfo',
        payload: queryParams,
      })
      .then((result) => {
        console.log('dispatch, result = ', result);
        if (result) {
          // 获取资源更新信息
          const {
            head: {rtnCode},
            body: {needUpdateResource, resourceUpdateUrl, resourceVersionInfo},
          } = result;
          // 有更新信息
          if (rtnCode === '2000' && needUpdateResource) {
            console.log('进行下载操作');
            const {fileName} = resourceVersionInfo;
            // 进行下载操作
            this.downloadVersion(resourceUpdateUrl, appKey, fileName);
          } else {
            console.log('无更新信息，直接打开应用');
            // 无更新信息，直接打开应用
            const {onPress} = this.props;
            if (onPress) {
              // 有点击事件，执行相关业务操作
              onPress(appKey);
            }
          }
        }
      });
  };

  downloadVersion = (versionUrl, appId, fileName) => {
    // 显示下载状态
    this.setState({showDownloading: true});
    // zip 保存目录
    const basePath = RNFS.DocumentDirectoryPath + '/' + appId;
    // 压缩包保存目录
    const zipFilePath = basePath + '/' + fileName;
    console.log('filePath', zipFilePath);
    // console.log("NativeModules", NativeModules);
    // 下载配置
    const downloadFileOptions = {
      fromUrl: versionUrl,
      // fromUrl:
      //   "https://mobile.sinochem.com/hxyhd_download/app/internal/b234117511c7412da2586eb81fe4ca90/rn_android_v96.zip",
      toFile: zipFilePath,
      // progressDivider: 5,
      progressInterval: 2000,
      begin: (result) => {
        console.log('begin: %o', result);
        const {statusCode, contentLength} = result;
        if (statusCode === 200) {
          this.setState({
            contentLength,
          });
        } else {
          this.setState({
            showDownloading: false,
          });
          alert('更新失败，请重试');
        }
      },
      progress: (result) => {
        let {bytesWritten, contentLength} = result;
        console.log('progress: %o', result);
        // 设置下载百分比
        this.setState({
          progress: bytesWritten / contentLength,
        });
      },
    };
    console.log('downloadFileOptions', downloadFileOptions);
    // 进行下载操作
    RNFS.downloadFile(downloadFileOptions).promise.then((result) => {
      console.log('NativeModules', NativeModules);
      console.log('downloadFile, result=', result);
      const {statusCode, bytesWritten} = result;
      // 下载完成
      if (statusCode === 200 && this.state.contentLength === bytesWritten) {
        console.log('下载完成');
        // 隐藏下载遮罩
        this.setState({
          showDownloading: false,
          progress: 0,
        });
        LoadingUtils.show();
        // console.log("RNZipArchive",RNZipArchive)
        // 解压资源
        unzip(zipFilePath, basePath)
          .then((path) => {
            console.log(`unzip completed at ${path}`);
            LoadingUtils.hide();
            // 打开子应用
            Submodule.open(appId, '');
          })
          .catch((error) => {
            LoadingUtils.hide();
            console.log('unzip error:', error);
          });
      } else {
        this.setState({
          showDownloading: false,
          progress: 0,
        });
        alert('更新失败，请重试');
      }
    });
  };

  // checkExistsBundleFile = async ()=>{
  // }

  render() {
    const {onPress} = this.props;
    return (
      // 点击触发区域
      <TouchableOpacity
        onPress={() => {
          // if (onPress) {
          //   onPress();
          // }
          this.checkVersion();
        }}
        style={{
          width: 120,
          position: 'relative',
          height: 130,
          flexDirection: 'column',
          // backgroundColor: "red",
          paddingTop: 20,
          alignItems: 'center',
        }}>
        {/* 显示容器 */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            position: 'relative',
            // backgroundColor: "red",
            width: '100%',
          }}>
          {/* 实际显示区域 */}
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../images/icon.png')}
              style={{width: 40, height: 40}}
            />
            <View
              style={{
                // width: 90,
                height: 30,
                marginTop: 2,
                flexDirections: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 16, color: '#000'}}>这是标题13</Text>
            </View>
          </View>
          {/* 升级遮罩 */}
          {this.state.showDownloading ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                backgroundColor: '#BEBEBCEE',
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: 15,
                left: 0,
                top: 0,
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Progress.Pie
                  progress={this.state.progress}
                  size={80}
                  unfilledColor="#BEBEBC33"
                  borderWidth={5}
                  color="#FFFFFFBB"
                />
              </View>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
export default connect((state) => {
  return {...state};
})(SubModuleItem);
