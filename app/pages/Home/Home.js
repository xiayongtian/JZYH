import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  // NativeModules,
} from 'react-native';
// import SubModuleItem from '../../components/SubModuleItem';
// import Submodule from 'react-native-submodule';
import HomeDetail from "../HomePage/HomeDetail";
/**
 * 主页
 */
class Home extends Component {
  constructor(props) {
    super(props);
  }

  openNew = (appId) => {
    // Submodule.open(appId, '');
    // console.log('NativeModules.Submodule', NativeModules.Submodule);
  };

  render() {
    return <HomeDetail />
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
export default Home;
