import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Calendar from '../../components/CalendarWithoutAnimation';
import PropTypes from 'prop-types';
import Popover from '../../components/Popover';
import { connect } from 'react-redux';
import { LoadingUtils, ToastUtils } from '../../utils';
import NoData from '../../components/NoData'
import moment from 'moment';
import { Storage } from '../../utils'
import getServerConfig from '../../config/server/config';

// import Realm from 'realm';

/**
 * 左侧的会议列表页面
 * 包含日历 会议列表
 */
class MeetingList extends React.Component {
  static propTypes = {
    onClickMeetingItem: PropTypes.func.isRequired, // 点击一条会议后的回调
  };

  static defaultProps = {
    onClickMeetingItem: () => { },
  };

  constructor(props) {
    super(props);
    this.state = {
      realm: null,
      param: '',
      calendarMode: 'week',
      meetingList: [],
      showPopover: false,
      selectedMeetingType: 0,
      currentMeetingDate: '',
      clickItemId: '',
      dayPressTime: '',
      isPressDate: false,
      isRefreshing: false, //控制下拉刷新
      loadMoreText: "",
      isLoadMore: '',  //控制上拉加载
      pageNum: 1,  //当前请求的页数
      totalCount: 0,  //数据总条数
      pageSize: 10,  //每页数据
      list: [],
      selectedIssueType: null, //被选中会议类型
      issueType: [
        { type: 'bgh', value: '办公会' },
        { type: 'zwh', value: '专委会' },
        { type: 'dsh', value: '董事会' },
      ]
    };
    this.filterButtonRef = React.createRef();
  }
  componentWillUnmount() {

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedMeetingTyp == null && this.state.selectedMeetingType) {
      // setTimeout(()=>{
      //   this.setState({
      //     pageNum:1
      //   })
      // },1000)
    }
    console.log('componentDidUpdate-------->', prevState.selectedMeetingType, this.state.selectedMeetingType)
  }
  componentDidMount = async () => {
    // 请求会议列表数据
    this.getMeetingList('isShowLoading');
    // 获取服务配置信息
    const serverConfig = getServerConfig();
    // 防止系统杀死进程之后dataUserstore消失,重新赋值
    if (!serverConfig.dataUserstore) {
      const dataUserstore = await Storage.get('dataUserstore');
      serverConfig.dataUserstore = dataUserstore
    }

  }
  // )}
  /**
   * 筛选
   * @param item 会议类型
   * @param isCurrentItem 被点击的item
   */
  clickFilter = (item, isCurrentItem) => {
    console.log('测试成功 item =', item.value);
    this.setState({
      showPopover: false,
      selectedMeetingType: isCurrentItem ? null : item.value,
    });
    let type = isCurrentItem ? null : item.type

    this.setState({
      pageNum: 1,
      selectedIssueType: isCurrentItem ? null : item.type
    }, () => {
      this.getMeetingList(null, type, this.state.dayPressTime)
    })
  }
  /**
   * 比较日期
   * @param {*} dateTime1 会议时间
   * @param {*} dateTime2 日历点击时间
   */
  compareDate = (dateTime1, dateTime2) => {
    var formatDate1 = new Date(dateTime1);
    var formatDate2 = new Date(dateTime2);
    if (formatDate1 >= formatDate2) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * 请求会议列表数据
   * @param isShowLoading 是否显示全局加载
   * @param issueType 会议类型
   * @param time 会议类型  点击日历的日期
   */
  getMeetingList = async (isShowLoading, issueType, time) => {
    // 隐藏全局加载，显示上拉下拉加载
    if (isShowLoading == "isShowLoading") {
      LoadingUtils.show('努力加载中...');
    }
    console.log('进入了---', time)
    let sdate, edate;
    // sdate = moment().format('YMMDD')
    // edate = moment().subtract(-1, 'months').format('YMMDD');
    // if(this.state.dayPressTime){
    //   sdate= this.state.dayPressTime
    //   edate=moment(this.state.dayPressTime).subtract(-1, 'months').format('YMMDD')
    // }else{

    // }

    if (time) {
      this.setState({
        dayPressTime: time,
        // pageNum:
      })
      console.log('dayPressTime----====', time, this.state.dayPressTime)
      sdate = time
      edate = moment(time).subtract(-1, 'months').format('YMMDD');
    } else {

      // this.setState({
      //   dayPressTime: ''
      // })
      sdate = moment().format('YMMDD')
      edate = moment().subtract(-1, 'months').format('YMMDD');
      if (this.state.dayPressTime) {
        sdate = this.state.dayPressTime
        edate = moment(this.state.dayPressTime).subtract(-1, 'months').format('YMMDD');
      }

    }
    let userid = '';
    // 获取userid
    if (this.props.subAccounts.userIdInfo.code == 0) {
      userid = this.props.subAccounts.userIdInfo.data
    } else {
      ToastUtils.show(this.props.subAccounts.userIdInfo.msg)
    }

    console.log('time---------->', time)
    let pageNum = time ? 1 : this.state.pageNum;
    console.log('==========进入', this.state.dayPressTime, this.state.selectedIssueType, pageNum, this.state.pageNum, sdate, edate)

    // if(this.state.selectedMeetingType==null && pageNum!==1){
    //   pageNum=1
    // }
    console.log('查看', {
      // userid: 165545,
      time,
      statePageNum: this.state.pageNum,
      pageNum: pageNum,

      // userid,
      issueType: this.state.selectedIssueType,
      // sdate: '20190825',
      // edate: '20210701',
      sdate,
      edate,

      // orderByColumn: 'issueTime',
      // isAsc: 'asc',
      pageSize: 10
    })
    debugger;
    this.props.dispatch({
      type: 'meetingPage/meetingList',
      payload: {
        // userid: 165545,
        userid,
        issueType: this.state.selectedIssueType,
        // sdate: '20190825',
        // edate: '20210701',
        sdate,
        edate,
        orderByColumn: 'issueTime',
        isAsc: 'asc',
        pageNum: pageNum,
        pageSize: 10
      },
    }).then((res) => {

      res.data.list.map(item => {
        console.log('进入函数', this.state.selectedIssueType, this.state.selectedMeetingType, pageNum, item.type)
      })
      console.log('res.data-------', res, time)
      let totalCount = res.data.total
      let tempData = [];
      if (pageNum == 1) {
        tempData = res.data.list
        this.setState({
          meetingList: [...tempData],
          totalCount,
          isRefreshing: false,
          // pageNum: 1
        });
        this.clickMeetingItem(tempData[0]);
        // 切换筛选重置滚动条拉到顶部
        setTimeout(item => {
          this.flatlist.scrollToOffset({ offset: 0, animated: true });
        }, 100)
      } else {
        tempData = res.data.list
        let listLength = this.state.meetingList.length+tempData.length
        console.log('-----其他----', listLength,totalCount,pageNum, tempData)
        // 月日历有的6行，有的5行，会导致上拉刷新多请求一次
        if (listLength <=totalCount) {
          this.setState({
            meetingList: [...this.state.meetingList, ...tempData],
            totalCount,
          });
        }else{
          // this.setState({
          //   meetingList: [...this.state.meetingList],
          //   totalCount,
          // });
        }
      }
      // 设置加载完成
      if (isShowLoading == "isShowLoading") {
        LoadingUtils.hide();
      }
    });
  };

  /**
   * 点击一条会议触发事件
   * @param item 单条会议对象
   */
  clickMeetingItem = (item) => {
    console.log('点击的是 = ', item);
    this.setState({ clickItemId: item.issueId })
    const { onClickMeetingItem } = this.props;
    onClickMeetingItem(item);
  };

  /**
   * 渲染头像
   */
  renderAvatar = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 7,
          left: 15,
          height: 50,
          width: 50,
          overflow: 'hidden',
          borderRadius: 39,
          backgroundColor: '#ccc',
        }}
      />
    );
  };

  renderCalendarModeSwitchButton = () => {
    const { calendarMode } = this.state;
    const buttons = (
      <View
        style={{
          overflow: 'hidden',
          flexDirection: 'row',
          height: 30,
          width: 140,
          marginTop: 20,
          borderColor: '#409EFF',
          borderStyle: 'solid',
          borderWidth: 1,
          borderRadius: 5,
        }}>
        <TouchableOpacity
          style={{
            ...styles.switchButton,
            borderColor: '#409EFF',
            borderStyle: 'solid',
            borderRightWidth: 1,
            backgroundColor: calendarMode === 'month' ? '#52C1F5' : '#fff',
          }}
          onPress={() => {
            this.setState({ calendarMode: 'month' });
          }}>
          <Text style={styles.switchButtonText}>月</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.switchButton,
            backgroundColor: calendarMode === 'week' ? '#52C1F5' : '#fff',
          }}
          onPress={() => {
            this.setState({ calendarMode: 'week' });
          }}>
          <Text style={styles.switchButtonText}>周</Text>
        </TouchableOpacity>
      </View>
    );

    return <View style={{ flex: 1, alignItems: 'center' }}>{buttons}</View>;
  };

  /**
   * 渲染会议列表抬头
   */
  renderMeetingListHeader = () => {
    return (
      <View style={styles.title}>
        <View style={{ flexDirection: 'row', height: '100%' }}>
          <View style={{ width: 5, backgroundColor: '#409EFF', marginRight: 10 }}>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>会议列表 </Text>
          </View>
        </View>
        <TouchableOpacity
          ref={(r) => (this.filterButtonRef = r)}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginRight: 20,
          }}
          onPress={() => {
            console.log('点击了筛选');
            this.setState({ showPopover: true });
          }}>
          {/*  图片*/}
          <Image
            style={{ width: 14, height: 14, marginRight: 2, marginTop: 1 }}
            source={require('./icon/icon_filter.png')}
          />
          <Text style={{ ...styles.switchButtonText, fontSize: 14 }}>筛选</Text>
        </TouchableOpacity>
        {/*渲染弹出的气泡框*/}
        {this.state.showPopover ? (
          <Popover
            isUpFlag={false}
            mainButton={this.filterButtonRef}
            popoverWidth={100}
            popoverHeight={70}
            renderButton={this.renderFilterButtons()}
            destroy={() => {
              this.setState({
                showPopover: false,
              });
            }}
          />
        ) : null}
      </View>
    );
  };

  /**
   * 渲染会议类型选择弹框中的 DOM
   * @return {*}
   */
  renderFilterButtons = () => {
    const buttonDom = (item) => {
      const { selectedMeetingType } = this.state;
      let isCurrentItem = selectedMeetingType === item.value;
      console.log('---------Test', selectedMeetingType, item.value)
      return (
        <TouchableOpacity
          style={{
            height: 25,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            // paddingLeft: 5,
            borderColor: '#4FC2FD',
            borderStyle: 'solid',
            borderRadius: 3,
            // backgroundColor:'pink',
            borderWidth: isCurrentItem ? 2 : 0,
          }}
          onPress={() => {
            this.clickFilter(item, isCurrentItem)
          }}>
          <Text style={{ color: '#fff', fontSize: 13 }}>{item.value}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <View
        key={0}
        style={{
          height: 90,
          width: 80,
          backgroundColor: '#000',
          opacity: 0.7,
          borderRadius: 10,
          paddingVertical: 5,
        }}>
        {this.state.issueType && this.state.issueType.map(item => {
          return buttonDom(item)
        })}

      </View>
    );
  };
  /**
   * 获取上下滚动的距离，以获取滚动中可见区域中第一条数据，每个元素高度为56
   */
  _onScroll = (event) => {
    console.log('test-------滑动')
    // if(!this.state.isPressDate){
    let positionY = event.nativeEvent.contentOffset.y;
    // 可见区域第一行索引
    let index = positionY >= 0 ? Math.floor(positionY / 46) : 0
    console.log('索引---', index, positionY, Math.floor(positionY / 46))
    const { meetingList } = this.state;
    // 可见区域第一行会议日期
    this.setState({
      currentMeetingDate: meetingList[index].issueTime
    })
    console.log('_onScroll日期--', meetingList[index].issueTime)
    this.$Child.onDayPress(null, meetingList[index].issueTime);
    // }

  }

  _getRef = (flatList) => {
    // this._flatList = flatList; 
    // const reObj = this._flatList; 
    // flatList.scrollToIndex({ viewPosition: 1, index: 1 });
    // return reObj; 
  }
  //   navSelect(index) {
  //     let layoutHeight = 0;
  //     let allLines = 0;
  //     this.nums.map((item, mapIndex) => {
  //       if (index > mapIndex) {
  //         allLines += item.num;
  //       }
  //     });
  //     layoutText.forEach((item, layoutIndex) => {
  //       if (allLines > layoutIndex) {
  //         layoutHeight += layoutText[layoutIndex].height;
  //       }
  //     });
  //     if (index == 0) {
  //       layoutHeight = 0;
  //     } else {
  //       layoutHeight = layoutHeight + px2dp(220);
  //     }

  //     console.log('layoutHeight==', layoutHeight);

  //     this.flatlist.scrollToOffset({offset: layoutHeight, animated: true});
  // }

  /**
   *  列表尾部组件
   */
  ListFooterComponent() {
    let loadMoreStatue, loadMoreText
    if (this.state.meetingList.length < this.state.totalCount) {
      loadMoreStatue = true
      loadMoreText = '加载中...'
    } else {
      loadMoreStatue = false
      loadMoreText = '没有更多了...'
    }

    return (
      <View style={{ height: 55, flexDirection: 'row', color: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        {loadMoreStatue ? <ActivityIndicator color="#888" style={{ marginRight: 3, }} animating={true} /> : null}
        <Text style={{ color: '#888', justifyContent: 'center', marginBottom: 1 }}>{loadMoreText}</Text>
      </View>
    )
  }
  /**
   * 上拉加载
   */
  _onEndReached = async () => {
    const { pageNum, isLoadMore, totalCount } = this.state || {}
    console.log('>>上拉加载>>>', this.state.pageNum, this.state.meetingList.length, totalCount, !isLoadMore)
    if (this.state.meetingList.length < totalCount) {
      this.setState({
        pageNum: pageNum + 1,
        isScrollToOffset: false
      }, async () => {
        await this.getMeetingList()
      })
    } else {

    }

  }
  /**
   * 下拉刷新
   */
  _onRefresh = (time) => {
    console.log('>>下拉刷新>>')

    this.setState({
      isRefreshing: true,
      pageNum: 1
    }, () => {
      // this.getMeetingList()
      if (time) {
        this.getMeetingList(null, null, time)

      } else {
        this.getMeetingList()
      }
    })
  }
  /**
   * 渲染会议列表
   */
  renderMeetingList = () => {
    console.log('-----会议列表', this.state.meetingList)
    let showData = '';
    if (this.state.meetingList && this.state.meetingList.length > 0) {
      showData = <FlatList
        ref={view => {
          this.flatlist = view;
        }}
        onScroll={this._onScroll}
        onEndReached={() => this._onEndReached()}
        onEndReachedThreshold={0.1}
        ListFooterComponent={this.ListFooterComponent()}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            colors={['#ff0000', '#00ff00', '#0000ff']}
            tintColor={'#fff'}
            progressBackgroundColor={"#ffffff"}
            onRefresh={() => {
              this._onRefresh()
            }}
          />
        }
        data={this.state.meetingList}
        contentContainerStyle={{
          marginHorizontal: 10,
        }}
        // keyExtractor={(item) => item.issueTitle}
        renderItem={({ item, index }) => {
          // 计算左侧边框颜色
          let borderColor = '';

          let issueStatus = ''
          if (item.issueStatus == 2) {
            issueStatus = '已确定';
            borderColor = '#58A3F7'
          } else if (item.issueStatus == 3) {
            issueStatus = '已召开';
            borderColor = '#FEC03D'

          }
          let clickItemColor;
          let isClickItem;
          if (this.state.clickItemId == item.issueId) {
            clickItemColor = borderColor;
            isClickItem = '700'
          } else {
            clickItemColor = '#888'
            isClickItem = '500'
          }
          return (
            <TouchableOpacity
              style={{
                borderColor: borderColor,
                borderStyle: 'solid',
                borderLeftWidth: 3,
                backgroundColor: '#FCFCFC',
                // height: 40,
                minHeight: 40,
                marginVertical: 3,
                paddingLeft: 5,
                justifyContent: 'center',
                // alignItems: 'center',
              }}
              onPress={() => {
                this.clickMeetingItem(item);
              }}>
              <View style={{ fontSize: 13, flexDirection: 'row', }}>
                <View style={{ flexDirection: "row", flex: 5, marginRight: 10, alignItems: 'center' }}>
                  <Text style={{ marginRight: 20, color: borderColor, fontWeight: isClickItem }}>{issueStatus}</Text>
                  <Text style={{ color: clickItemColor, flex: 1, fontWeight: isClickItem }}>{item.issueTitle}</Text>
                </View>

                <View style={{ flex: 2, alignItems: 'flex-start' }}>
                  <Text style={{ flex: 1, color: clickItemColor, fontWeight: isClickItem, }}>{item.issueTime}</Text>
                  {/* <Text style={{ flex:1, marginLeft:3,color: clickItemColor, fontWeight: isClickItem }}>{item.issueAddress}</Text> */}
                </View>

              </View>
            </TouchableOpacity>
          );
        }}
      />

    } else {
      showData = <NoData />
    }
    return (
      showData
    );
  };

  render() {
    const { calendarMode } = this.state;
    return (
      <View style={styles.container}>
        {/*第一行 头像和 日历模式切换按钮组*/}
        <View style={styles.firstContainer}>
          {this.renderAvatar()}
          {this.renderCalendarModeSwitchButton()}
        </View>
        {/*第二行 月历*/}
        <Calendar mode={calendarMode} onRefresh={this._onRefresh} getMeetingList={this.getMeetingList} onRef={(ref) => { this.$Child = ref }} />
        {/*/!*第三行 会议列表标题*!/*/}
        {this.renderMeetingListHeader()}
        {/*/!*第三行分割线*!/*/}
        {this.renderMeetingList()}
      </View>
    );
  }
}


export default connect((state) => {
  return { ...state };
})(MeetingList);

// 定义通用的样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    borderColor: '#F2F2F2',
    borderStyle: 'solid',
    backgroundColor: '#fff',

  },
  title: {
    backgroundColor: '#F9F9F9',
    height: 35,
    marginLeft: 1,
    marginBottom: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#F2F2F2',
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  firstContainer: {
    height: 60,
    // backgroundColor: 'pink'
  },
  switchButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#409eff',
    fontSize: 15,
    // fontWeight: 'bold',
  },
});


