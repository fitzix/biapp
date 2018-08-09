import React from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import {SectionList, View} from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Drawer, ListRow, Theme} from "teaset"


import RealTimePage from '../realtime'
import ReportPage from '../report'
import SharedPage from '../shared'
import UserPage from '../user'

import StorageUtil from '../../utils/storage'

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
        tabBarLabel: '分享数据'
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
      title: navigation.getParam('navBarTitle', ''),
      headerLeft: (
        <Ionicons name="ios-menu" style={{marginLeft: 10, marginBottom: -8}} size={25} color="tomato" onPress={navigation.getParam('openSideBar')}/>
      )
    }
  }

  state = {
    sectionData: []
  }


  componentWillMount() {
    console.log('render sidebar')
    StorageUtil.getSideBarData().then(({data, game}) => {
      console.log(data, game)
      this.props.navigation.setParams({navBarTitle: game.name})
      this.setState({sectionData: data})
    }).catch(() => {})
  }

  componentDidMount() {
    this.props.navigation.setParams({openSideBar: this._showSideBar})
  }

  render() {
    return (
      <TabNavigator navigation={this.props.navigation}/>
    )
  }

  _showSideBar = () => {
    this.drawer = Drawer.open(this.renderDrawerMenu())
  }

  onChooseGame(game) {
    // 当前游戏
    global.storage.save({
      key: 'game',
      data: game
    })
    this.props.navigation.setParams({navBarTitle: game.name})
    this.drawer && this.drawer.close()
  }

  renderDrawerMenu() {
    return (
      <View style={{backgroundColor: Theme.defaultColor, width: 260, flex: 1}}>
        <View style={{height: 40}}/>
        <SectionList
          renderItem={({item}) => <ListRow title={ item.name } titleStyle={{ fontSize: 14 }} onPress={() =>  this.onChooseGame(item) } /> }
          renderSectionHeader={({section: { name, data }}) => {
            if (data.length > 0) {
                return <ListRow titleStyle={{ color: 'tomato', textAlign: 'center', fontSize: 16 }} title={ name } bottomSeparator='none'/>
              }
          }}
          sections={ this.state.sectionData }
          keyExtractor={(item, index) => item + index}
        />
        <View style={{height: 60}}/>
      </View>
    )
  }
}