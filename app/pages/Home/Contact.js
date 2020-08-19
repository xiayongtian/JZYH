import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SplitView } from '../../components';
import ContactComponent from '../Contact';
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";

/**
 * 通讯录
 */
class Contact extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * 跳转到通讯录详情
   */
  handleDetail = () => {
    // this.props.navigation.navigate('ContactDetail');
  };

  renderLeft = () => {
    return (
      <View style={styles.container}>
        <Text>left</Text>
      </View>
    );
  };

  renderRight = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.handleDetail}>
          <Text>right</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <ContactComponent navigation={this.props.navigation}/>
      // <SplitView left={this.renderLeft} right={this.renderRight} />
      // <View style={styles.container}>
      //   <Text>通讯录</Text>
      //   <TouchableOpacity style={styles.detailBtn} onPress={this.handleDetail}>
      //     <Text>进入详情</Text>
      //   </TouchableOpacity>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
// export default Contact;

// export default connect(state => {
//   return { ...state };
// })(withNavigation(Contact));

export default Contact;

