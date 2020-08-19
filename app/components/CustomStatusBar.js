import React, { Component } from 'react';
import { View, Platform, StatusBar, Dimensions } from 'react-native';
/**
 * 自定义状态栏，主要解决状态栏在ios和android上面的差异
 */

//手机屏幕的宽度
const width = Dimensions.get('window').width;
//手机屏幕的高度
const height = Dimensions.get('window').height;
/**
    * 判断是否为iphoneX
    * @returns {boolean}
    */
isIphoneX = () => {
    const X_WIDTH = 375;
    const X_HEIGHT = 812;
    return Platform.OS == 'ios' && (height == X_HEIGHT && width == X_WIDTH)
}
//状态栏的高度
getStatusBarHeight = () => {
    if (Platform.OS == 'android') return StatusBar.currentHeight;
    if (isIphoneX()) {
        return 44
    }
    return 20
}

const statusBarHeight = getStatusBarHeight();

function CustomStatusBar() {
    return (
        <View>
            <StatusBar
                animated={true} //指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle和hidden  
                hidden={false}  //是否隐藏状态栏。  
                backgroundColor={'#fff'} //状态栏的背景色  
                translucent={true}//指定状态栏是否透明。设置为true时，应用会在状态栏之下绘制（即所谓“沉浸式”——被状态栏遮住一部分）。常和带有半透明背景色的状态栏搭配使用。  
                barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content')   
            >
            </StatusBar>
            <View style={{
                height: statusBarHeight,
                backgroundColor: '#fff',
            }} />
        </View>
    );
}

export default CustomStatusBar;