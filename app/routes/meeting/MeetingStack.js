import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MeetingDetail from '../../pages/MeetingDetail';
import Preview from '../../pages/MeetingDetail/Preview';

const Stack = createStackNavigator();
/**
 * 会议 Stack 数组
 */
const meetingStack = [
  // 会议详情
  <Stack.Screen key="MeetingDetail" name="MeetingDetail" component={MeetingDetail} />,
  <Stack.Screen key="Preview" name="Preview" component={Preview} />,

];
export default meetingStack;
