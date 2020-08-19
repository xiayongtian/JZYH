import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MeetingPage from "../MeetingPage";

/**
 * 会议首页
 */
class Meeting extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <MeetingPage navigation={this.props.navigation}/>
  }
}

export default Meeting;
