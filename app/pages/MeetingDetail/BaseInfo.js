import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground
} from 'react-native';

/**
 * 基本信息
 */
class BaseInfo extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (
      <View style={styles.baseInfoContain}>
        <View style={{ height: 185, }}>
          <View style={styles.baseInfo}>
            <Text style={styles.baseInfoText}>基本信息</Text>
          </View>
          <View style={styles.baseInfoItem}>
            <ImageBackground source={require('../../images/meeting/3.png')} imageStyle={{}} style={styles.iconStyle}>
            </ImageBackground>
            <Text style={styles.baseInfoValue}>会议时间：{this.props.data.issueTime}</Text>
          </View>

          <View style={styles.baseInfoItem}>
            <ImageBackground source={require('../../images/meeting/4.png')} imageStyle={{}} style={styles.iconStyle}>
            </ImageBackground>
            <Text style={styles.baseInfoValue}>会议地点：{this.props.data.issueAddress}</Text>
          </View>

        </View>
        <View style={{ flex: 1,}}>
          <View>
            <View style={styles.unitAndPerson}>
              <Text style={styles.unitAndPersonAllText}>参会单位和人员</Text>
            </View>
            <View>
              <View style={styles.unitAndPersonTitle}>
                <Text style={styles.unitAndPersonAllText}>参会人员</Text>
              </View>
              <View style={styles.unitAndPersonItem}>
                <Text style={styles.unitAndPersonText}>列席人：{this.props.data.lxrName}</Text>
              </View>
              <View style={styles.unitAndPersonItem}>
                <Text style={styles.unitAndPersonText}>出席人：{this.props.data.cxrName}</Text></View>
            </View>
            <View>
              <View style={styles.unitAndPersonTitle}>
                <Text style={styles.unitAndPersonAllText}>参会单位</Text>
              </View>
              <View style={StyleSheet.flatten([styles.unitAndPersonItem, { borderBottomWidth: 1, borderBottomColor: '#f4f4f4', }])}>
                <Text style={styles.unitAndPersonText}>列席单位：{this.props.data.lxdwName}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}


export default BaseInfo;

const styles = StyleSheet.create({
  baseInfoContain: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#f4f4f4',
    backgroundColor:'#fff'
  },
  baseInfo: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center'
  },
  baseInfoText: {
    fontSize: 17,
    fontWeight: 'bold',
    color:'#666666'
  },
  baseInfoItem: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
    alignItems: 'center',
    paddingLeft: 40,
    flexDirection: 'row'
  },
  baseInfoValue: {
    fontSize: 15,
    marginLeft: 20,
    color: '#b6b6b6'
  },
  iconStyle: {
    width: 19,
    height: 19
  },
  unitAndPerson: {
    padding: 13,
    paddingLeft: 25,
    // height: 50,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',

  },
  unitAndPersonAllText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: 'bold',

  },
  unitAndPersonText: {
    fontSize: 14,
    // fontWeight: 'bold',
    // color: '#999999',
    lineHeight: 25,

  },
  unitAndPersonTitle: {
    padding: 13,
    paddingLeft: 25,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',

  },
  unitAndPersonItem: {
    padding: 13,
    paddingLeft: 40,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',
  }
})