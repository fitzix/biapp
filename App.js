/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import { Provider } from 'react-redux'
import { createStackNavigator } from 'react-navigation'

import LoginPage from './src/views/login/login'
import MainPage from './src/views/main/main'

import initStore from './src/redux/store'
import storage from './src/utils/storage'

const Store = initStore()

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
      // 实现app和store的关联，等于整个系统的组件都被包含住了
      <Provider store={Store}>
        <Navigator />
      </Provider>
    )
  }
}

