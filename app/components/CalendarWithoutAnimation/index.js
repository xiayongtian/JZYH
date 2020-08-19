import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarHeader from './CalendarHeader';
import WeekBar from './WeekBar';
import CalendarBody from './CalendarBody';

/**
 * 日历组件
 */
class Calendar extends Component {
  static propTypes = {
    mode: PropTypes.string, // 日历模式 月(month) 和 周(week)
    dateChange: PropTypes.func, // 返回选中的日期
    selectedBackgroundColor: PropTypes.string, // 选中元素的背景色
  };

  static defaultProps = {
    mode: 'month',
    selectedBackgroundColor: '#52C1F5',
  };

  constructor(props) {
    super(props);
    this.state = {
      // 当前选中的日期
      showMonth: moment(),
    };
  }

  /**
   * 点击左右切换月历按钮事件
   */
  changeMonth = (isLeft) => {
    console.log('点击了向[%O]按钮', isLeft ? '左' : '右');
    const { showMonth } = this.state;
    const { mode } = this.props;
    // 月模式 才可以左右切换
    if (mode === 'month') {
      if (isLeft) {
        showMonth.subtract(1, 'months');
      } else {
        showMonth.add(1, 'months');
      }
    } else {
      if (isLeft) {
        showMonth.subtract(1, 'weeks');
      } else {
        showMonth.add(1, 'weeks');
      }
    }
    this.setState({ showMonth: showMonth.clone() });
  };

  /**
   * clickDate:日历直接点击日期
   * currentMeetingDate：会议列表滚动切换日期
   */
  onDayPress = (clickDate, currentMeetingDate) => {
    // 保存点击的日期
    if (currentMeetingDate) {
      this.setState({ showMonth: moment(currentMeetingDate) });
    } else {
      this.setState({ showMonth: clickDate });
    }
    // this.setState({showMonth: clickDate});
    // console.log('点击的本月日期 showMonth =', clickDate.format('Y-MM-DD'));
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  render() {
    const { showMonth } = this.state;
    return (
      <View style={styles.container}>
        <CalendarHeader
          fullYearMonthStr={showMonth.format('Y年M月')}
          changeMonth={this.changeMonth}
        />
        <WeekBar />
        <CalendarBody
          mode={this.props.mode}
          getMeetingList={this.props.getMeetingList}
          onRefresh={this.props.onRefresh}
          currentShowMonth={showMonth}
          onDayPress={this.onDayPress}
          selectedBackgroundColor={this.props.selectedBackgroundColor}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    minHeight: 105,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
});

export default Calendar;
