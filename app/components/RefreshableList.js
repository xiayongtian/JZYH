import React, { Component } from "react";
import { View,Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { default as AutoText } from "./AutoText";

export const RefreshState = {
  Idle: 0,
  HeaderRefreshing: 1,
  FooterRefreshing: 2,
  NoMoreData: 3,
  Failure: 4,
  EmptyData: 5
};

class RefreshableList extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    /**
     * 列表刷新状态：
     1、Idle（普通状态）
     2、HeaderRefreshing（头部菊花转圈圈中）
     3、FooterRefreshing（底部菊花转圈圈中）
     4、NoMoreData（已加载全部数据）
     5、Failure（加载失败）
     */
    refreshState: PropTypes.number,
    /**
     * type: (refreshState: number) => void
     * 下拉刷新回调方法 refreshState参数值为RefreshState.HeaderRefreshing
     */
    onHeaderRefresh: PropTypes.func,
    /**
     * type: (refreshState: number) => void
     * 上拉翻页回调方法 refreshState参数值为RefreshState.FooterRefreshing
     */
    onFooterRefresh: PropTypes.func,
    data: PropTypes.array,

    footerRefreshingText: PropTypes.string,
    footerFailureText: PropTypes.string,
    footerNoMoreDataText: PropTypes.string,
    footerEmptyDataText: PropTypes.string,

    footerRefreshingComponent: PropTypes.element,
    footerFailureComponent: PropTypes.element,
    footerNoMoreDataComponent: PropTypes.element,
    footerEmptyDataComponent: PropTypes.element,

    renderItem: PropTypes.func,

    refCallback: PropTypes.func // FlatList ref实例回调
  };

  static defaultProps = {
    footerRefreshingText: "数据加载中…",
    footerFailureText: "点击重新加载",
    footerNoMoreDataText: "已加载全部数据",
    footerEmptyDataText: "暂时没有相关数据"
  };

  onHeaderRefresh = () => {
    if (this.shouldStartHeaderRefreshing()) {
      this.props.onHeaderRefresh(RefreshState.HeaderRefreshing);
    }
  };

  onEndReached = () => {
    if (this.shouldStartFooterRefreshing()) {
      this.props.onFooterRefresh && this.props.onFooterRefresh();
    }
  };

  shouldStartHeaderRefreshing = () => {
    const { refreshState } = this.props;
    if (
      refreshState === RefreshState.HeaderRefreshing ||
      refreshState === RefreshState.FooterRefreshing
    ) {
      return false;
    }
    return true;
  };

  shouldStartFooterRefreshing = () => {
    let { refreshState, data } = this.props;
    if (data.length === 0) {
      return false;
    }
    debugger;
    return refreshState === RefreshState.Idle;
  };

  renderFooter = () => {
    let footer = null;

    let {
      footerRefreshingText,
      footerFailureText,
      footerNoMoreDataText,
      footerEmptyDataText,

      footerRefreshingComponent,
      footerFailureComponent,
      footerNoMoreDataComponent,
      footerEmptyDataComponent
    } = this.props;
    // console.log(this.props.refreshState)
    switch (this.props.refreshState) {
      case RefreshState.Idle:
        footer = <View style={styles.footerContainer}/>;
        break;
      case RefreshState.Failure: {
        footer = (
          <TouchableOpacity
            onPress={() => {
              if (this.props.data.length === 0) {
                this.props.onHeaderRefresh &&
                this.props.onHeaderRefresh(RefreshState.HeaderRefreshing);
              } else {
                this.props.onFooterRefresh &&
                this.props.onFooterRefresh(RefreshState.FooterRefreshing);
              }
            }}
          >
            {footerFailureComponent ? (
              footerFailureComponent
            ) : (
              <View style={styles.footerContainer}>
                <AutoText style={styles.footerText}>{footerFailureText}</AutoText>
              </View>
            )}
          </TouchableOpacity>
        );
        break;
      }
      case RefreshState.EmptyData: {
        footer = (
          <TouchableOpacity
            onPress={() => {
              this.props.onHeaderRefresh &&
              this.props.onHeaderRefresh(RefreshState.HeaderRefreshing);
            }}
          >
            {footerEmptyDataComponent ? (
              footerEmptyDataComponent
            ) : (
              <View style={styles.footerContainer}>
                <AutoText style={styles.footerText}>{footerEmptyDataText}</AutoText>
              </View>
            )}
          </TouchableOpacity>
        );
        break;
      }
      case RefreshState.FooterRefreshing: {
        footer = footerRefreshingComponent ? (
          footerRefreshingComponent
        ) : (
          <View style={styles.footerContainer}>
            <ActivityIndicator size="small" color="#888888"/>
            <AutoText style={{ ...styles.footerText, marginLeft: 7 }}>
              {footerRefreshingText}
            </AutoText>
          </View>
        );
        break;
      }
      case RefreshState.NoMoreData: {
        footer = footerNoMoreDataComponent ? (
          footerNoMoreDataComponent
        ) : (
          <View style={styles.footerContainer}>
            <AutoText style={styles.footerText}>{footerNoMoreDataText}</AutoText>
          </View>
        );
        break;
      }
    }

    return footer;
  };

  render() {
    let { renderItem, refreshState, refCallback, ...rest } = this.props;
   console.log('刷新一下-------->',this.state)
    return (
      <FlatList
        ref={ref => refCallback && refCallback(ref)}
        onEndReached={() => this.onEndReached()}
        onRefresh={() => this.onHeaderRefresh()}
        refreshing={refreshState === RefreshState.HeaderRefreshing}
        ListFooterComponent={() => this.renderFooter()}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 44
  },
  footerText: {
    fontSize: 14,
    color: "#555555"
  }
});

export default RefreshableList;
