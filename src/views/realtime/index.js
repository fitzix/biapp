import React, {Component} from 'react'
import {Text, View} from "react-native"


export default class RealTimePage extends Component {

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Home!</Text>
      </View>
    )
  }
}

// export default createStackNavigator({
//   RealTimePage: RealTimePage
// })