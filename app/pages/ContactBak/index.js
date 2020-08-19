import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

/**
 * 通讯录详情
 */
class Contact extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>通讯录详情</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
export default Contact;
