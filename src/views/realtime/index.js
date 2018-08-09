import React, {Component} from 'react'

import {Text, View, ScrollView, StyleSheet} from "react-native"

import SearchPicker from '../../components/SearchPicker'


export default class RealTimePage extends Component {

  onSearch(selected) {
    console.log(selected)
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always" style={{ backgroundColor: '#f8f8f8' }}>
        <SearchPicker onSearch={this.onSearch} />
      </ScrollView>
    )
  }
}

// export default createStackNavigator({
//   RealTimePage: RealTimePage
// })