import React from "react"
import { View, Text } from 'react-native'
import {createStackNavigator} from 'react-navigation'
import SideBarPage from '../../components/sideBar'

export default class SharedPage extends React.Component {
  // static navigationOptions = SideBarPage.setNavOpt('全名小镇')

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Home Screen</Text>
      </View>
    )
  }
}

// export default createStackNavigator({
//   SharedPage: SharedPage
// })