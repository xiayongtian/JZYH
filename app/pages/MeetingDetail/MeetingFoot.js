import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground
} from 'react-native';
/**
 * 会议标签
 */
class MeetingFoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      footImg: [
        { type: require('../../images/meeting/foot.png') },
      ],
      footText: [
        { label: "会议投票" },
        { label: "会议签到" },
        { label: "会议记录" },
        { label: "会议决议" },
        { label: "会议评价" },
      ]
    }
  }
  render() {
    return (
      <View style={styles.footContainer}>

        {this.state.footText && this.state.footText.map(item => {
          return (
            <View style={styles.footItem}>
              <ImageBackground source={this.state.footImg[0].type} imageStyle={{}} style={{ width: 25, height: 25 }}>
              </ImageBackground>
              <Text style={styles.footLabel}>{item.label}</Text>
            </View>
          )
        })}
      </View>

    );
  }
}

export default MeetingFoot;

const styles = StyleSheet.create({
  footContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  footItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%'
  },
  footLabel: {
    fontSize: 19,
    color: '#cccccc'
  }

});