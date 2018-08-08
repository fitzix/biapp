/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import { createStackNavigator } from 'react-navigation'

import LoginPage from './src/views/login/login'
import MainPage from './src/views/main/main'

import storage from './src/utils/storage/storage'
import NavigatorService from './src/services/navigator'

type Props = {}

// 全局变量
global.storage = storage

const TopLevelNavigator = createStackNavigator(
  {
    LoginPage: LoginPage,
    MainPage: MainPage
  },
  {
    initialRouteName: 'LoginPage',
    headerMode: 'screen'
  }
)

if (__DEV__) {
  GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest
}


export default class App extends Component<Props> {
  render() {
    return (
      <TopLevelNavigator ref={ navigatorRef => { NavigatorService.setTopLevelNavigator(navigatorRef) }} />
    )
  }
}

