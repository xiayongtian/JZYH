import React from 'react';
import { FlatList, Text, View } from 'react-native';

/**
 * 一周 栏目
 * ["日", "一", "二", "三", "四", "五", "六"] 部分
 */
class WeekBar extends React.Component {
  /**
   * 渲染 周日至周六
   */
  renderItemInner = ({ item }) => {
    let color = '#111';
    if (item === '六' || item === '日') {
      color = '#aaa';
    }
    return (
      <View
        key={item}
        style={{
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: color, fontSize: 18, fontWeight: 'bold' }}>{item}</Text>
      </View>
    );
  };

  render() {
    const weekArray = ['日', '一', '二', '三', '四', '五', '六'];
    return (
      <View
        style={{
          zIndex: 10,
          height: 30,
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        {weekArray.map((item) => this.renderItemInner({ item }))}
      </View>
    );
  }
}

export default WeekBar;
