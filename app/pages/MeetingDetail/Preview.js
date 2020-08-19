import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview'
import TitleBar from '../../components/TitleBar'
import {Storage, LoadingUtils, ToastUtils} from '../../utils';
/**
 * 附件预览
 */
function Preview({ route, navigation }) {
    const { url, fileName } = route.params;
    LoadingUtils.hide();
    console.log("url, fileName=============",url, fileName);
    return (
        <View style={styles.container}>
            {/* 标题栏 */}
            <TitleBar
                left={'返回'}
                backgroundColor='#fff'
                title={fileName}
                titleColor='#7f7f7f'
                navigation={navigation}
            />
            <WebView
                style={{ flex: 1 }}
                originWhitelist={['*']}
                source={{ uri: url }}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})
export default Preview;

