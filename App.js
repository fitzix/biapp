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

import storage from './src/utils/storage'
import NavigatorService from './src/services/navigator'

const Navigator = createStackNavigator(
  {
    Login: LoginPage,
    Main: {
      screen: MainPage,
      navigationOptions: {
        header: null, //去头部
        headerLeft: null
      }
    }
  },
  {
    initialRouteName: 'Login',
    headerMode: 'screen'
  }
)



export default class App extends Component {
  render() {
    return (
      <Navigator ref={ navigatorRef => { NavigatorService.setContainer(navigatorRef) }} />
    )
  }
}

