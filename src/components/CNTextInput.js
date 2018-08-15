import React, {Component} from 'react'
import {Platform, TextInput} from 'react-native'

// 处理iOS 无法输入中文
export default class CNTextInput extends Component {

  shouldComponentUpdate(nextProps){
    return Platform.OS !== 'ios' || this.props.value === nextProps.value;
  }
  render() {
    return <TextInput {...this.props} />;
  }
}