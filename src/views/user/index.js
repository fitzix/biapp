import React from "react"
import { ScrollView, View, Alert } from 'react-native'
import { ListRow } from 'teaset'
import RouterUtil from '../../utils/router'

export default class UserPage extends React.Component {

  logout() {
    Alert.alert(
      '退出',
      '',
      [
        {text: '确定', onPress: () => RouterUtil.logout() },
        {text: '取消', style: 'cancel'},
      ]
    )
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{height: 20}} />
        <ListRow title='Title' topSeparator='full' />
        <ListRow title='Title' topSeparator='full' />
        <ListRow title='Title' topSeparator='full' />
        <ListRow title='Title' topSeparator='full' />
        <View style={{height: 20}} />
        <ListRow title='退出' titleStyle={{ textAlign: 'center', color: 'red' }} accessory='none' topSeparator='full' onPress={ () => { this.logout() }} />
      </ScrollView>
    )
  }
}