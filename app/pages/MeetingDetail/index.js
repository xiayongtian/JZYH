import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ImageBackground
} from 'react-native';
import Report from './Report'
import MeetingFoot from './MeetingFoot'
import TitleBar from '../../components/TitleBar'
import BaseInfo from './BaseInfo';
import { connect } from 'react-redux';
import NoData from '../../components/NoData'
/**
 * 会议详情
 */
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingInfo: {},
      processInfo: []
    }
  }
  componentDidMount = async () => {
    console.log('--------meetingPage--------', this.props)
    this.setState({
      meetingInfo: this.props.meetingPage.baseInfo,
      processInfo: this.props.meetingPage.baseInfo.process
    })

  }
  setting = () => {
    alert("setting")
  }
  render() {
    const rightImage = require('../../images/meeting/settings.png')
    let showData;
    if (this.state.processInfo && this.state.processInfo.length > 0) {
      showData = <Report data={this.state.processInfo} navigation={this.props.navigation}/>
    } else {
      showData = <View style={styles.reportContain}><NoData /></View>
    }
    return (
      //  <View style={{flex: 1,justifyContent:'center'}}>
      //    <Text style={{width:100,height:100,backgroundColor:'pink',color:'blue'}}>213</Text>
      //  </View>
      <View style={styles.container}>
        {/* 标题栏 */}
        <TitleBar
          left={'返回'}
          rightImage={rightImage}
          backgroundColor='#fff'
          title={this.state.meetingInfo.issueTitle}
          pressRight={this.setting}
          titleColor='#7f7f7f'
          navigation={this.props.navigation}
        />

        {/* 会议详情 */}
        <View style={{ flex: 1, flexDirection: 'row', }}>
          <BaseInfo data={this.state.meetingInfo} />
          {showData}
        </View>

        {/* 会议标签 */}
        {/* <View style={{ height: 70 }}>
      //     <MeetingFoot />
      //   </View> */}

      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  title: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  reportContain: {
    flex: 3,
    padding: 15,
    paddingBottom: 0,
    borderWidth: 1,
    borderColor: '#f4f4f4',
    borderLeftWidth: 0,
  },
})

export default connect((state) => {
  return { ...state };
})(Detail);


