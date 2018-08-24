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
import NavService from '../../services/navigator'

let TabNavigator = createBottomTabNavigator(
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
        style: { padding: 5 }
      }
    }
  }
)

export default class tabPage extends React.Component {

  state = {
    sectionData: [],
    curGame: {}
  }

  static router = TabNavigator.router

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('navBarTitle', ''),
      headerLeft: (
        <Ionicons name="ios-menu" style={{marginLeft: 10, marginBottom: -8}} size={25} color="tomato" onPress={navigation.getParam('openSideBar')}/>
      )
    }
  }

  componentDidMount() {
    this._mounted = true
    this.props.navigation.setParams({openSideBar: this._showSideBar})
    StorageUtil.getSideBarData().then(({data, game}) => {
      this.props.navigation.setParams({navBarTitle: game.name})
      if (this._mounted) {
        this.setState({sectionData: data, curGame: game})
      }
    }).catch(() => {})
  }

  componentWillUnmount() {
    this._mounted = false
  }


  render() {
    return (
      <TabNavigator navigation={this.props.navigation} />
    )
  }

  _showSideBar = () => {
    this.drawer = Drawer.open(this.renderDrawerMenu())

    let curGame = this.state.curGame

    let sectionIndex = this.state.sectionData.findIndex(el => curGame.type === el.value)
    console.log(sectionIndex)

    let itemIndex = this.state.sectionData[sectionIndex].data.findIndex(el => {
      el.id === curGame.id
    })

    // this.sectionList.scrollToLocation({
    //   sectionIndex: sectionIndex,
    //   itemIndex: itemIndex
    // })
    console.log(this.sectionList)

    this.sectionList.scrollToLocation({
      sectionIndex: 4,
      itemIndex: 2
    })

    // try {
     
    // } catch (e) {

    // }
  }

  onChooseGame(game) {


    // 当前游戏
    global.storage.save({
      key: 'game',
      data: game
    })
    this.drawer && this.drawer.close()
    NavService.reset('MainPage')
  }

  renderDrawerMenu() {
    let _this = this
    return (
      <View style={{backgroundColor: Theme.defaultColor, width: 260, flex: 1}}>
        <View style={{height: 40}}/>
        <SectionList
          ref={ref => _this.sectionList = ref}
          renderItem={({item}) => <ListRow title={ item.name } titleStyle={{ fontSize: 14 }} onPress={() =>  this.onChooseGame(item) } /> }
          renderSectionHeader={({section: { name }}) => {
            return <ListRow titleStyle={{ color: 'tomato', textAlign: 'center', fontSize: 16 }} title={ name } bottomSeparator='none'/>
          }}
          sections={ this.state.sectionData }
          keyExtractor={(item, index) => item + index}
        />
        <View style={{height: 40}}/>
      </View>
    )
  }
}