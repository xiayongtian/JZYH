import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import base64 from 'react-native-base64'

/**
 * 我的
 */
class My extends Component {
  constructor(props) {
    super(props);
    console.log('my props', props);
  }

  logout = () => {

    // let a = base64.encode('Some string to encode to base64');
    // console.log('base64', a)
    // console.log('base64', base64.decode(a))

    this.props.dispatch({
      type: 'user/logout',
      payload: {},
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>我的</Text>
        <TouchableOpacity style={styles.logout} onPress={this.logout}>
          <Text>退出登录</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logout: {
    marginTop: 10,
  },
});
export default connect(state => {
  return { ...state };
})(My);
