import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChooseSubAccounts from '../../pages/ChooseSubAccounts';

const Stack = createStackNavigator();
/**
 * 通讯录 Stack 数组
 */
const ChooseSubAccountsStack = [
  // 通讯录详情
  <Stack.Screen key="ChooseSubAccounts" name="ChooseSubAccounts" component={ChooseSubAccounts} />,
];
export default ChooseSubAccountsStack;
