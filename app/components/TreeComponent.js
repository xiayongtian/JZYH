/**
 * 通讯录 树结构组件
 * 每个节点都必须有是否为叶子节点的属性 值为：treeNodeType
 * 使用懒加载，在 showListCallback 事件中传入子节点即可
 * @author liuyi
 */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import Proptypes from 'prop-types';
import { AutoText } from '.';

export const treeNodeType = {
  NonLeafNode: 0,
  leafNode: 1,
};

export default class TreeComponent extends Component {
  static proptypes = {
    treeData: Proptypes.array.isRequired, // 树结构数据
    showListCallback: Proptypes.func.isRequired, // 点击节点的回调函数
    isShowSelect: Proptypes.bool, // 是否显示多选框
    doSelect: Proptypes.func, // 选择节点操作
    latestOffset: Proptypes.func, // 滑动后的最后高度
  };

  // 设置 prop 默认值
  static defaultProps = {
    isShowSelect: false, // 默认不显示多选框
    doSelect: () => {
    }, // 选择节点操作
  };

  constructor(props) {
    super(props);
    this.flatList = null;
    this.isInit = false;
    this.scrollEndTimeout = null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { initOffset } = prevProps;
    if (this.scrollView && this.scrollView.scrollTo && !this.isInit) {
      console.log('初始化通讯录 initOffset = ', initOffset);
      this.isInit = true;
      this.scrollView.scrollTo({
        x: 0,
        y: initOffset,
        animated: false,
      });
    }
  }

  /**
   * 递归渲染通讯录树
   */
  _renderList = list => {
    if (!list || list.length < 1) {
      return null;
    }
    return list.map((item, index) => {
      return this._renderItem(item, index);
    });
  };

  /**
   * 渲染单个树节点
   */
  _renderItem = (item, index) => {
    let { showListCallback, doSelect, isShowSelect, doDownload } = this.props;
    // 当前元素为非叶子节点，则按照非叶子节点规则渲染
    if (item.type === treeNodeType.NonLeafNode) {
      // console.log('外层selected是否改变',item,item.selected)
      // console.log("渲染非叶子节点 ====== ", item);
      return (
        <View style={{ flex: 1 }} key={index + item.title}>
          <TreeItem
            showListCallback={() => showListCallback(item, index)}
            doSelect={() => doSelect(item, index)}
            selected={item.selected}
            expansion={item.expansion}
            title={item.title}
            enabled={isShowSelect}
            nodeIndex={index}
            id={item.id}
            showDownload={item.showDownload}
            doDownload={() => doDownload(item, index)}
          />
          {item.expansion && item.children.length > 0 ? (
            <View style={{ flex: 1, paddingLeft: 20, justifyContent: 'flex-start' }}>
              {this._renderList(item.children)}
            </View>
          ) : null}
        </View>
      );
    }
    // 当前元素为叶子节点，则按照叶子节点规则渲染
    if (item.type === treeNodeType.leafNode) {
      // console.log("渲染叶子节点 ====== ", item);
      return (
        <PersonItem
          key={index}
          title={item.userName}
          avatar={item.avatar}
          postTitle={item.postTitle}
          phone={item.phone}
          id={item.id}
          showListCallback={() => showListCallback(item, index)}
          enabled={isShowSelect}
          doSelect={() => doSelect(item, index)}
          selected={item.selected}
        />
      );
    }
    // 既不是 非叶子节点 也不是 叶子节点 则不渲染
    console.log('渲染空节点 ====== ', item);
    return null;
  };

  render() {
    const { treeData } = this.props;
    return (
      <View
        style={{
          flex: 1,
          paddingRight: 15,
          alignItems: 'center',
          backgroundColor: '#fff',
          borderRadius: 13,
        }}
      >
        <ScrollView
          scrollEventThrottle={16}
          ref={(r) => {
            this.scrollView = r;
          }}
          onScroll={({ nativeEvent: { contentOffset } }) => {
            if (this.scrollEndTimeout !== null) {
              clearTimeout(this.scrollEndTimeout);
            }
            const { x, y } = contentOffset;
            const { latestOffset } = this.props;
            this.scrollEndTimeout = setTimeout(() => {
              latestOffset && latestOffset(y);
            }, 100);

          }}
        >
          {treeData && treeData.length > 0 ? this._renderList(treeData) : null}
        </ScrollView>
      </View>
    );
  }
}

/**
 * 非叶子节点对象
 */
class TreeItem extends Component {
  constructor(props) {
    super(props);
  }

  _renderChecked = (enabled, doSelect, selected) => {
    if (!enabled) {
      return null;
    }
    return (
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          doSelect();
        }}
      >
        <Image
          source={
            selected ? require('../images/approval/wxz.png') : require('../images/approval/xz.png')
          }
          style={{
            width: 18,
            height: 18,
          }}
        />
      </TouchableOpacity>
    );
  };

  _renderDownLoadContacts = (enable, showDownload, doDownload) => {
    if (enable || !showDownload) {
      return null;
    }
    return (
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          doDownload();
        }}
      >
        <Image
          source={require('../images/contacts/icon_deep_download.png')}
          style={{
            width: 18,
            height: 18,
          }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    let {
      showListCallback,
      id,
      doSelect,
      showDownload,
      doDownload,
      selected,
      expansion,
      title,
      enabled,
      nodeIndex,
    } = this.props;

    return (
      <View
        style={{
          width: '100%',
          minHeight: 50,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingLeft: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            showListCallback && showListCallback();
          }}
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Image
            source={
              expansion
                ? require('../images/approval/arrow_down.png')
                : require('../images/approval/youjiantou.png')
            }
            style={{ width: expansion ? 14 : 7, height: expansion ? 7 : 14 }}
          />
          {/* 树结点名称 */}
          <View style={{ flex: 1, marginLeft: 15, overflow: 'hidden' }}>
            <AutoText
              style={{ fontSize: expansion ? 18 : 16, color: expansion ? '#424141' : '#92949F' }}
            >
              {title}
            </AutoText>
          </View>
        </TouchableOpacity>
        {/* 绘制下载框 */}
        {this._renderDownLoadContacts(enabled, showDownload, doDownload)}
        {/* 区分公司和部门，部门绘制选择框 */}
        {id.search('department') != -1 ? this._renderChecked(enabled, doSelect, selected) : null}
      </View>
    );
  }
}

class PersonItem extends Component {
  constructor(props) {
    super(props);
  }

  _renderChecked = (enabled, doSelect, selected) => {
    if (enabled) {
      return (
        <TouchableOpacity
          style={{
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            doSelect ? doSelect() : (() => {
            })();
          }}
        >
          <Image
            source={
              selected
                ? require('../images/approval/wxz.png')
                : require('../images/approval/xz.png')
            }
            style={{
              width: 18,
              height: 18,
            }}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  render() {
    let {
      title,
      avatar,
      postTitle,
      phone,
      enabled,
      showListCallback,
      doSelect,
      selected,
    } = this.props;
    if (avatar) {
      avatar = { uri: 'data:image/png;base64,' + avatar };
    } else {
      avatar = require('../images/icons/userpic.png');
    }

    return (
      <View
        style={{
          width: '100%',
          minHeight: 60,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginVertical: 10,
          paddingLeft: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            showListCallback && showListCallback();
          }}
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {/* 头像 */}
          <Image source={avatar} style={{ borderRadius: 20, width: 40, height: 40 }}/>
          {/* 姓名 */}
          <View style={{ flex: 1, marginLeft: 15, marginRight: 8, overflow: 'hidden' }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <AutoText style={{ fontSize: 17, color: '#424141' }}>{title}</AutoText>
              <AutoText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ paddingLeft: 15, fontSize: 14, color: '#92949F' }}
              >
                {postTitle}
              </AutoText>
            </View>
            {phone ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                <AutoText
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ fontSize: 16, color: '#424141' }}
                >
                  {phone}
                </AutoText>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
        {/* 单/多选按钮 */}
        {this._renderChecked(enabled, doSelect, selected)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
