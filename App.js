/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {Alert, Platform, Linking} from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { Theme } from 'teaset'
import {
  isFirstTime,
  isRolledBack,
  checkUpdate,
  downloadUpdate,
  switchVersion,
  switchVersionLater,
  markSuccess,
} from 'react-native-update'


import LoginPage from './src/views/login/login'
import MainPage from './src/views/main/main'

import storage from './src/utils/storage/storage'
import NavigatorService from './src/services/navigator'
import _updateConfig from './update.json'

type Props = {}

const {appKey} = _updateConfig[Platform.OS]

// 全局变量
global.storage = storage
// ipx
Theme.set({
  fitIPhoneX: true,
  primaryColor: 'tomato',
  sbBtnActiveTitleColor: 'tomato',
  sbIndicatorLineColor: 'tomato'
})


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

  componentWillMount() {

    if(!__DEV__) {
      this.checkUpdate()
      if (isFirstTime) {
        markSuccess()
      } else if (isRolledBack) {
        Alert.alert('提示', '刚刚更新失败了,版本被回滚.')
      }
    }
  }

  doUpdate = info => {
    downloadUpdate(info).then(hash => {
      Alert.alert('提示', '更新下载完毕,是否重启应用?', [
        {text: '是', onPress: ()=>{switchVersion(hash)}},
        {text: '下次启动时', onPress: ()=>{switchVersionLater(hash)}},
      ]);
    }).catch(err => {
      Alert.alert('提示', '更新失败.')
    })
  }

  checkUpdate = () => {
    checkUpdate(appKey).then(info => {
      if (info.expired) {
        Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
          {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
        ])
      } else if (info.update) {
        // 强制更新
        Alert.alert('提示', `检查到新的版本${info.name}\n\n${info.description}`, [
          {text: '开始下载', onPress: ()=>{this.doUpdate(info)}}
        ])
      }
    })
  }

  render() {
    return (
      <TopLevelNavigator ref={ navigatorRef => { NavigatorService.setTopLevelNavigator(navigatorRef) }} />
    )
  }
}

