import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Contact from '../../pages/Contact/index';
import TreeFullScreen from "../../pages/Contact/TreeFullScreen";

const Stack = createStackNavigator();
/**
 * 通讯录 Stack 数组
 */
const ContactStack = [
  // 通讯录页面
  <Stack.Screen key="ContactDetail" name="ContactDetail" component={Contact} />,
  // 全屏
  <Stack.Screen key="TreeFullScreen" name="TreeFullScreen" component={TreeFullScreen} />,

];
export default ContactStack;
