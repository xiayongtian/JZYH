import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
/**
 * 无数据状况显示
 */
class NoData extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
      <View style={styles.noDateView}>
        <Image
          source={require('../images/common/noData.jpg')}
          style={styles.noData}
        />
        <Text style={{ fontSize: 14,color:'#666',fontWeight:'700' }}>暂无数据</Text>
      </View>
     );
  }
}
 // 定义通用的样式
const styles = StyleSheet.create({
  noDateView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    width: 130,
    height: 90
  }
});
export default NoData;