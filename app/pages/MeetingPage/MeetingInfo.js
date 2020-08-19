import React from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NoData from '../../components/NoData'
/**
 * 右侧的会议信息页面
 */
class MeetingInfo extends React.Component {
  static propTypes = {
    meetingInfo: PropTypes.object, // 会议信息对象 或者会议ID,有的子账户无会议
    enterDetailFunc: PropTypes.func.isRequired, // 跳转进入详情
  };

  constructor(props) {
    super(props);
    this.state = {
      meetingItem: null,
      topicArr: null,
    };
  }

  componentDidMount() {
    this.initialMeetingInfo().then();
    // this.setState({
    //   topicArr:this.props.meetingPage.baseInfo.process
    // })
  }

  componentDidUpdate(prevProps) {
    if (this.props.meetingInfo !== prevProps.meetingInfo) {
      this.initialMeetingInfo().then();
    }
  }
  /**
   * 初始化会议议题
   */
  initialMeetingInfo = async () => {
    const { meetingInfo } = this.props;
    this.setState({
      meetingItem: meetingInfo,
      topicArr: meetingInfo.process
    });
  };

  /**
   * 渲染头部 "会议信息"文字和右上角的会议状态
   */
  renderHeader = () => {
    let issueStatus;
    if(this.state!==null && this.state.meetingItem!==null){
      const { meetingItem } = this.state;  
      if (meetingItem.issueStatus == 2) {
        issueStatus = '已确定';
      } else if ( meetingItem.issueStatus == 3) {
        issueStatus = '已召开';
      }
    }
  
    return (
      <View
        style={{
          height: 70,
          alignItems: 'center',
          overflow: 'hidden',
          marginTop: 5,
          marginRight: 5,
        }}
      >
        <Text style={{ marginTop: 15, fontSize: 17, fontWeight: 'bold', color: '#666' }}>
          会议信息
        </Text>
        <View
          style={{
            position: 'absolute',
            height: 32,
            width: 110,
            top: 5,
            right: -35,
            transform: [{ rotate: '45deg' }],
            backgroundColor: '#F95E5A',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>{issueStatus}</Text>
        </View>
      </View>
    );
  };
  /**
   * 渲染会议信息部分
   */
  renderMeetingInfo = () => {
    const { meetingItem } = this.state;
    // if (!meetingItem) {
    //   return null;
    // }
    return (
      <View
        style={{
          minHeight: 150,
          marginLeft: 15,
        }}
      >
        {this.renderMeetingInfoItem(true, {
          label: '会议名称',
          value: !meetingItem ? '' : meetingItem.issueTitle,
        })}
        {this.renderMeetingInfoItem(false, {
          label: require('./icon/icon_time.png'),
          value: !meetingItem ? '' : meetingItem.issueTime,
        })}
        {this.renderMeetingInfoItem(false, {
          label: require('./icon/icon_address.png'),
          value: !meetingItem ? '' : meetingItem.issueAddress,
        })}
        {this.renderMeetingInfoItem(true, {
          label: '主持人',
          value: meetingItem && meetingItem.zcrName !== null ? `${meetingItem.zcrName}` : "",
        })}
      </View>
    );
  };

  /**
   * 渲染会议信息的单个项目
   */
  renderMeetingInfoItem = (isTextLabel, item) => {
    let label;
    // let valueColor = '#a2a2a2';
    let valueColor = item.label == '会议名称' || item.label == '主持人' ? '#757575' : '#a2a2a2';
    if (isTextLabel) {
      label = (
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666', marginLeft: 0 }}>{item.label}：</Text>
      );
    } else {
      label = <Image style={{ width: 18, height: 18, marginRight: 5 }} source={item.label} />;
      valueColor = '#aaa';
    }
    return (
      <View
        style={{
          minHeight: 15,
          flexDirection: 'row',
          paddingVertical: 10,
          paddingRight: 10,
          borderColor: '#F2F2F2',
          borderStyle: 'solid',
          borderTopWidth: item.label == '会议名称' ? 1 : 0,
          borderBottomWidth: 1,
        }}
      >
        <View
          style={{
            height: 25,
            width: 80,
            justifyContent: 'center',
            alignItems: isTextLabel ? 'flex-end' : 'center',
          }}
        >
          {label}
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ lineHeight: 25, fontSize: 14, color: valueColor }}>{item.value}</Text>
        </View>
      </View>
    );
  };

  /**
   * 渲染议题标题 和议题列表
   */
  renderTopic = () => {
    let showData;
    if (this.state.topicArr && this.state.topicArr.length > 0) {
      showData = <FlatList
        data={this.state.topicArr}
        contentContainerStyle={{
          marginLeft: 15,
        }}
        // keyExtractor={(item) => item.meetingId}
        renderItem={this.renderTopicItem}
      />
    } else {
      showData = <NoData />
    }
    return (
      <View
        style={{
          flex: 1,
          marginLeft: 15,
          marginTop: 5,
        }}
      >
        <View style={{
          flexDirection: 'row',
          height: 37,
          borderBottomColor: '#F2F2F2',
          borderBottomWidth: 1,
        }}>
          <View style={{ width: 5, backgroundColor: '#409EFF', marginRight: 10 }}>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>会议议题 </Text>
          </View>
        </View>
        {showData}
      </View>
    );
  };

  /**
   * 渲染单条议题
   * @param item 单条议题对象
   * @param index 下标
   */
  renderTopicItem = ({ item, index }) => {
    return (
      <View
        style={{
          borderColor: '#F2F2F2',
          borderStyle: 'solid',
          justifyContent: 'center',
          borderBottomWidth: 1,
        }}
      >
        <View
          style={{
            marginTop: 15,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>{item.meetingTitle}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ width: '50%', fontSize: 13, color: '#858585' }}>
            汇报人：{item.reportUserName}
          </Text>
          <Text style={{ fontSize: 13, color: '#858585' }}>
            汇报时长：{item.timeLength}分钟
          </Text>
        </View>
      </View>
    );
  };

  /**
   * 渲染 "进入" 按钮
   */
  renderEnterButton = () => {
    return (
      <View
        style={{
          height: 80,
          // backgroundColor:'blue',
          marginLeft: 20,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#F2F2F2',
          borderStyle: 'solid',
          borderTopWidth: 1,
        }}
      >
        <TouchableOpacity
          style={{
            // 样式
            // marginBottom: 20,
            height: 40,
            width: '60%',
            borderRadius: 25,
            borderColor: '#5FAEFF',
            borderStyle: 'solid',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            // 点击事件
            console.log('进入详情');
              this.props.navigation.navigate('MeetingDetail');
            
            // this.props.enterDetailFunc();
          }}
        >
          <Text style={{ fontSize: 16, color: '#5FAEFF' }}>进入</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderMeetingInfo()}
        {this.renderTopic()}
        {this.renderEnterButton()}
      </View>
    );
  }
}


export default connect((state) => {
  return { ...state };
})(MeetingInfo);


// 定义通用的样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    borderColor: '#F2F2F2',
    borderStyle: 'solid',
    borderLeftWidth: 1,
    // #F2F2F2
  },
  firstContainer: {
    height: 110,
  },
  switchButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#409EFF',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

