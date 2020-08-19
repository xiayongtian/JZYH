import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';

/**
 * 日历组件 日期部分
 */
class CalendarBody extends React.Component {
  static propTypes = {
    currentShowMonth: PropTypes.object, // 传入 moment 对象
    mode: PropTypes.string, // 日历模式 month 或 week
    flagDate: PropTypes.array, // TODO 需要增加标注的日期 (暂不考虑, 后续视情况而定)
    onDayPress: PropTypes.func, // 点击一个日期时的回调
    selectedBackgroundColor: PropTypes.string.isRequired, // 选中元素的背景色
  };

  static defaultProps = {
    currentShowMonth: moment(),
    mode: 'month',
    flagDate: [],
    onDayPress: (item) => {
      console.log('日历组件body, 点击了一个日期 item = ', item);
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      // 当前显示的日历数据
      calendarData: [],
    };
  }

  componentDidMount() {
    this.initialCalendarData();
    // 自动点击传入的时间为当前选择时间
    const { currentShowMonth } = this.props;
    this.onDayPress(currentShowMonth);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentShowMonth !== prevProps.currentShowMonth) {
      this.initialCalendarData();
      return;
    }
    if (this.props.mode !== prevProps.mode) {
      this.initialCalendarData();
    }
  }

  /**
   * 初始化日历数据
   */
  initialCalendarData = () => {
    // 计算月历上的数据
    this.generateFullCalendar();
  };

  /**
   * 生成完整日历，包含上月末尾和下月初的几天,用来填充首末星期
   */
  generateFullCalendar = () => {
    console.log('调用更新数据');
    const { currentShowMonth, mode } = this.props;
    console.log('currentShowMonth =', currentShowMonth.format('Y-MM-DD'));
    let currentCalendarFirstDate = moment(currentShowMonth);
    let currentCalendarLastDate = moment(currentShowMonth);
    if (mode === 'month') {
      currentCalendarFirstDate = currentCalendarFirstDate.startOf('month');
      currentCalendarLastDate = currentCalendarLastDate.endOf('month');
    }
    currentCalendarFirstDate = currentCalendarFirstDate.startOf('week');
    currentCalendarLastDate = currentCalendarLastDate.endOf('week');

    // 计算日历上需要显示的所有日期
    const result = [];
    const temp = currentCalendarFirstDate;
    while (!currentCalendarFirstDate.isAfter(currentCalendarLastDate)) {
      // result.push(temp.clone());
      result.push(temp.clone());
      temp.add(1, 'days');
    }
    this.setState({ calendarData: result });
  };

  /**
   * 点击一个日期的触发事件
   * @param item 被点击日期的 moment 对象
   */
  onDayPress = (item) => {
    const { onDayPress } = this.props;
    // let time= item.format('YMMDD');
    let time= item.format('YMMDD');
    console.log('--->',this.props)
    // this.props.getMeetingList(null,null,time)
    this.props.onRefresh(time)
    console.log(
      '日历组件body, 点击了一个日期 item = [%O]',
      item.format('YMMDD'),
    );
    onDayPress(item);
  
  };

  /**
   * 判断传入的日期 应该显示什么背景色
   * @param date moment对象表示的日期
   */
  getDateItemBackgroundColor = (date) => {
    const { currentShowMonth } = this.props;
    if (currentShowMonth && currentShowMonth.isSame(date, 'day')) {
      return this.props.selectedBackgroundColor;
    }
    return null;
  };

  /**
   * 判断传入的日期 应该显示什么文字颜色
   * @param date moment对象表示的日期
   */
  getDateItemTextColor = (date) => {
    const { currentShowMonth } = this.props;
    // 选中的文字颜色
    if (currentShowMonth && currentShowMonth.isSame(date, 'day')) {
      return '#F6F6F6';
    }
    // 周六周日的文字颜色
    const day = date.day();
    if (day === 0 || day === 6) {
      return '#aaa';
    }
    // 周一至周五的文字颜色
    return '#111';
  };

  /**
   * 渲染一个日期
   * @param item 日期的 moment 对象
   */
  renderDateItem = ({ item }) => {
    // console.log('渲染一个日期 item = [%O]', item.format('MM-DD'));
    return (
      <TouchableOpacity
        style={{
          ...styles.dateItem,
          
          backgroundColor: this.getDateItemBackgroundColor(item),
        }}
        onPress={() => {
          this.onDayPress(item);
        }}>
        <Text
          style={{
            color: this.getDateItemTextColor(item),
            fontSize: 14,
            fontWeight: '700',

          }}>
          {item.format('DD')}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <FlatList
        contentContainerStyle={styles.container}
        columnWrapperStyle={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        data={this.state.calendarData}
        numColumns={7}
        keyExtractor={(item) => item.toString()}
        renderItem={this.renderDateItem}
      />
    );
  }
}

export default CalendarBody;

const styles = StyleSheet.create({
  container: {
    maxHeight: 250,
    // marginTop: 10,
    backgroundColor: '#fff',
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    width: 30,
    height: 30,
    borderRadius: 18,
  },
});
