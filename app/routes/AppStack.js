import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ToastUtils } from '../utils';
// import {connect} from 'react-redux';
// import {FontConfig} from '../config/CommonConfig';
/**
 * 导入 TAB 页组件
 */
import Home from '../pages/Home/Home';
import Meeting from '../pages/Home/Meeting';
import Contact from '../pages/Home/Contact';
import My from '../pages/Home/My';
/**
 * 导入各 TAB 下 stack 数组
 */
import ContactStack from './contact/ContactStack';
import MeetingStack from './meeting/MeetingStack';
import ChooseSubAccountsStack from './chooseSubAccounts/ChooseSubAccountsStack';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

/**
 * Tab 页配置
 */
const HomeTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="MeetingTab"
      tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen name="HomeTab" component={Home} options={{ title: '首页' }} />
      <Tab.Screen name="HomeTab12" component={Home} options={{ title: '待办' }} />

      <Tab.Screen
        name="MeetingTab"
        component={Meeting}
        options={{ title: '会议' }}
      />
      <Tab.Screen
        name="ContactTab"
        component={Contact}
        options={{ title: '通讯录' }}
      />
      <Tab.Screen name="MyTab" component={My} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
};

/**
 * 自定义 tabbar 样式和行为
 */
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabbarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        console.log('route', route);
        console.log('options', options);

        console.log('route.key', route.key);

        console.log('label', label);
        // 当前焦点
        const isFocused = state.index === index;

        const onPress = () => {
          const { name } = route;
          if (name === 'MeetingTab') {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          } else if (name === 'MyTab') {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          } else if (name === 'ContactTab') {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          } else {
            ToastUtils.show('敬请期待');
          }
        };

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}>
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <Text style={{ color: isFocused ? '#333' : '#999' }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  return (
    <Stack.Navigator
      headerMode={'none'}
    >
      {/* 子账号 */}
      {ChooseSubAccountsStack}
      {/* Tab 页配置 */}
      <Stack.Screen
        name="Home"
        component={HomeTabs}
        options={{ headerShown: false }}
      />

      {/* 会议 stack 数组 */}
      {MeetingStack}

      {/* 通讯录 stack 数组 */}
      {ContactStack}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
  },
  tabItem: {
    paddingVertical: 15,
    marginHorizontal: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // width: 100,
    minWidth: 80,
    // backgroundColor: 'red',
    alignItems: 'center',
  },
});
