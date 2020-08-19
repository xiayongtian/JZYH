import React from 'react';
import { View } from 'react-native';
import MeetingList from './MeetingList';
import MeetingInfo from './MeetingInfo';
import { connect } from 'react-redux';
import { LoadingUtils } from '../../utils';
import CustomStatusBar from '../../components/CustomStatusBar'

/**
 * 包含日历 会议列表 会议信息 的页面
 */
class MeetingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickMeetingItem: null,
    };
  }

  componentDidMount() {

  }

  /**
   * 点击单条会议时的回调事件
   */
  onClickMeetingItem = (item) => {
    console.log('这里是 MeetingPage item = [%O]', item);
    // 设置加载中状态
    // LoadingUtils.show('努力加载中...');
    this.props.dispatch({
      type: 'meetingPage/meetingDetail',
      payload: {
        id: item.issueId,
      },
    }).then((res) => {
      this.setState({
        clickMeetingItem: res,
      })
      // 设置加载完成
      LoadingUtils.hide();
    });

  };

  /**
   * 跳转到会议详情
   */
  handleDetail = () => {
    this.props.navigation.navigate('MeetingDetail');
  };

  render() {
    const { clickMeetingItem } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <CustomStatusBar />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
          }}>
          <MeetingList
            onClickMeetingItem={this.onClickMeetingItem}
          />
          <MeetingInfo
            meetingInfo={clickMeetingItem}
            enterDetailFunc={this.handleDetail}
            navigation={this.props.navigation}
          />
        </View>

      </View>

    );
  }
}

export default connect((state) => {
  return { ...state };
})(MeetingPage);
