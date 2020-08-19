import React from 'react';
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';
import RRCTopView from './RRCTopView';

const LoadingOptions = {};

export default class RRCLoading {
  static setLoadingOptions(options = {}) {
    if (typeof options.text === 'string') {
      LoadingOptions.text = options.text;
    }
    // loading 图片
    if (options.loadingImage !== undefined) {
      LoadingOptions.loadingImage = options.loadingImage;
    }
    // loading 图片背景
    if (options.loadingImageBackground !== undefined) {
      LoadingOptions.loadingImageBackground = options.loadingImageBackground;
    }
    if (
      typeof options.loadingTextStyle === 'object' &&
      !Array.isArray(options.loadingTextStyle)
    ) {
      LoadingOptions.loadingTextStyle = options.loadingTextStyle;
    }
  }
  static show() {
    const loadingView = (
      <View style={styles.container}>
        <ImageBackground
          source={LoadingOptions.loadingImageBackground}
          style={styles.backgroud}>
          <Image
            source={LoadingOptions.loadingImage}
            style={styles.loadingImage}
          />
          {LoadingOptions.text ? (
            <Text style={styles.info}>{LoadingOptions.text}</Text>
          ) : null}
        </ImageBackground>
      </View>
    );
    RRCTopView.addLoading(loadingView);
  }

  static hide() {
    RRCTopView.removeLoading();
  }

  static transformRoot(transform, animated, animatesOnly = null) {
    RRCTopView.transform(transform, animated, animatesOnly);
  }

  static restoreRoot(animated, animatesOnly = null) {
    RRCTopView.restore(animated, animatesOnly);
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroud: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  loadingImage: {
    width: 40,
    height: 40,
    borderRadius: 15,
    overflow: 'hidden',
  },
  info: {
    // minWidth: 20,
    height: 20,
    fontSize: 13,
    marginTop: 10,
    color: '#fff',
    // backgroundColor:'pink',
    fontWeight: 'bold'
  },
});
