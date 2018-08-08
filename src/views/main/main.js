import React from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import {SectionList, View} from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Drawer, ListRow, Theme} from "teaset"


import RealTimePage from '../realtime'
import ReportPage from '../report'
import SharedPage from '../shared'
import UserPage from '../user'

import RestoreUtil from "../../utils/restore"

const TabNavigator = createBottomTabNavigator(
  {
    RealTimePage: {
      screen: RealTimePage,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <Ionicons name="ios-pulse" size={25} color={tintColor}/>
        },
        tabBarLabel: '实时数据'
      }
    },
    ReportPage: {
      screen: ReportPage,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <Ionicons name="ios-document" size={25} color={tintColor}/>
        },
        tabBarLabel: '数据报表'
      }
    },
    SharedPage: {
      screen: SharedPage,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <Ionicons name="ios-paper-plane" size={25} color={tintColor}/>
        },
        tabBarLabel: '分项数据'
      }
    },
    UserPage: {
      screen: UserPage,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => {
          return <Ionicons name="ios-contact" size={25} color={tintColor}/>
        },
        tabBarLabel: '个人中心'
      }
    }
  },
  {
    navigationOptions: {
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }
    }
  }
)

export default class tabPage extends React.Component {

  static router = TabNavigator.router

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('navBarTitle', '全民小镇'),
      headerLeft: (
        <Ionicons name="ios-menu" style={{marginLeft: 10, marginBottom: -8}} size={25} color="tomato" onPress={navigation.getParam('openSideBar')}/>
      )
    }
  }

  state = {
    sectionData: []
  }

  _showSideBar = () => {
    Drawer.open(this.renderDrawerMenu())
  }

  async componentWillMount() {
    console.log('will mount')
    let types = await global.storage.load({key: 'gameTypes'}).then(ret => ret).catch(() => [])
    let games = await global.storage.load({key: 'gameList'}).then(ret => ret).catch(() => [])
    console.log(types, games)
    RestoreUtil.parseGameTypes(types, games)
    this.setState({sectionData: types})
  }

  componentDidMount() {
    this.props.navigation.setParams({openSideBar: this._showSideBar})
  }

  renderDrawerMenu() {
    console.log(this.state.sectionData)
    return (
      <View style={{backgroundColor: Theme.defaultColor, width: 260, flex: 1}}>
        <View style={{height: 60}}/>
        <SectionList
          renderItem={({item}) => <ListRow title={ item.name } titleStyle={{ fontSize: 14 }}  /> }
          renderSectionHeader={({section: { name }}) => {
              return <ListRow titleStyle={{ color: 'tomato', textAlign: 'center' }} title={ name } bottomSeparator='none'/>
          }}
          sections={ this.state.sectionData }
          keyExtractor={(item, index) => item + index}
        />
        <View style={{height: 60}}/>
      </View>
    )
  }


  render() {
    return (
      <TabNavigator navigation={this.props.navigation}/>
    )
  }
}