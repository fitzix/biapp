import React from "react"
import { ActivityIndicator } from 'react-native'
import { Toast } from 'teaset'

export default class HudProgress {
  static show() {
    return Toast.show({
      text: '加载中',
      icon: <ActivityIndicator size='large' color='tomato' />,
      position: 'center',
      duration: 1000000,
      overlayOpacity: 0.4,
      modal: true
    })
  }

  static hide(key) {
    Toast.hide(key)
  }
}