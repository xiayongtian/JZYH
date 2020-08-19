import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
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
      // 显示的月份
      showMonth: moment(),
      // 当前被选中的日期
      clickDate: 0,
    };

    // [140, 340]
    this.parentHeight = new Animated.Value(340);
    // [未知, 0]
    this.calendarBodyTop = new Animated.Value(0);
    console.log('Animated.Value = [%O]', this.parentHeight);
  }

  componentDidUpdate(prevProps) {
    const { mode } = this.props;
    const { mode: oldMode } = prevProps;
    if (mode !== oldMode) {
      console.log('切换了吗');
      this.modeSwitch();
    }
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
        showMonth.subtract(1, 'month');
      } else {
        showMonth.add(1, 'month');
      }
      this.setState({ showMonth: showMonth.clone() });
    }
  };

  onDayPress = (clickDate) => {
    // 保存点击的日期
    this.setState({ clickDate });
    console.log('点击的本月日期');
  };

  /**
   * 月模式和周模式切换时调用
   */
  modeSwitch = () => {
    const { mode } = this.props;
    if (mode === 'month') {
      // 展开
      this.expandToMonthMode();
      return;
    }
    // 收缩
    const { clickDate, showMonth } = this.state;
    // 当前日历显示的第一个日期
    const currentCalendarFirstDate = moment(showMonth)
      .startOf('month')
      .startOf('week');
    // 当前日历显示的最后一个日期
    const currentCalendarLastDate = moment(showMonth)
      .endOf('month')
      .endOf('week');
    // if  a.diff(b, 'days') // 1
    if (
      !clickDate.isBetween(currentCalendarFirstDate, currentCalendarLastDate, 'day', null, '[]')
    ) {
      this.shrinkToWeekMode(0);
      return;
    }
    // 距离选中日期的天数
    const diff = clickDate.diff(currentCalendarFirstDate, 'day');
    // 计算需移动的行数
    const moveLineNum = Math.floor(diff / 7);
    console.log('需要向上移动 [%O]行', moveLineNum);
    this.shrinkToWeekMode(moveLineNum);
  };

  /**
   * 展开为月历模式
   */
  expandToMonthMode = () => {
    const bodyAnimated = Animated.timing(this.calendarBodyTop, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    });
    const parentAnimated = Animated.timing(this.parentHeight, {
      toValue: 360,
      duration: 500,
      useNativeDriver: false,
    });
    parentAnimated.start();
    bodyAnimated.start();
  };

  /**
   * 收缩为周模式
   * @param lineNumber 需向上移动的行数
   */
  shrinkToWeekMode = (lineNumber) => {
    console.log('需要收缩 [%O]行', lineNumber);
    const tempHeight = lineNumber * -48;
    const bodyAnimated = Animated.timing(this.calendarBodyTop, {
      toValue: tempHeight,
      duration: 500,
      useNativeDriver: false,
    });
    const parentAnimated = Animated.timing(this.parentHeight, {
      toValue: 140,
      duration: 500,
      useNativeDriver: false,
    });
    parentAnimated.start();
    bodyAnimated.start();
  };

  render() {
    const { showMonth } = this.state;
    return (
      <Animated.View
        style={{
          ...styles.container,
          // 展开 360, 收起 140
          height: this.parentHeight,
          // height: 140,
        }}
      >
        <CalendarHeader
          fullYearMonthStr={showMonth.format('Y年M月')}
          changeMonth={this.changeMonth}
        />
        <WeekBar />
        <Animated.View
          style={{
            ...styles.calendar,
            // 收起一行 移动 100像素
            top: this.calendarBodyTop,
          }}
        >
          <CalendarBody
            currentShowMonth={showMonth}
            onDayPress={this.onDayPress}
            selectedBackgroundColor={this.props.selectedBackgroundColor}
          />
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 40,
    // backgroundColor: 'yellow',
  },
  calendar: {
    height: 270,
    zIndex: 1,
    position: 'relative',
  },
});

export default Calendar;
