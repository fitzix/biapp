import React, {Component} from 'react'
import {Platform, TextInput} from 'react-native'

// 处理iOS 无法输入中文
export default class LLTextInput extends Component {

  shouldComponentUpdate (nextProps){
    return Platform.OS !== 'ios'
      || (this.props.value === nextProps.value && (nextProps.defaultValue === undefined || nextProps.defaultValue === '' ))
      || (this.props.defaultValue === nextProps.defaultValue && (nextProps.value === undefined || nextProps.value === '' ));
  }

  render() {
    return <TextInput {...this.props} />
  }
}