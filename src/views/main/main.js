import React, {Component} from 'react'
import {createBottomTabNavigator} from 'react-navigation'
import {SectionList, View, PixelRatio} from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Drawer, ListRow, Theme} from "teaset"
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import PropTypes from "prop-types"

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

export default class tabPage extends Component {
  static router = TabNavigator.router

  state = {
    sectionData: [],
    curGame: {}
  }

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
    this.drawer = Drawer.open(<SideBar onGameChange={this.onGameChange} sectionData={this.state.sectionData} curGame={this.state.curGame} />)
  }

  onGameChange = () => {
    this.drawer && this.drawer.close()
  }
}



class SideBar extends Component {

  constructor(props) {
    super(props)

    this.getItemLayout = sectionListGetItemLayout({
      // The height of the row with rowData at the given sectionIndex and rowIndex
      getItemHeight: (rowData, sectionIndex, rowIndex) => sectionIndex === 0 ? 0 : 44,

      // These four properties are optional
      getSeparatorHeight: () => 1 / PixelRatio.get(), // The height of your separators
      getSectionHeaderHeight: () => 44, // The height of your section headers
      getSectionFooterHeight: () => 0, // The height of your section footers
      listHeaderHeight: 0, // The height of your list header
    })
  }

  static propTypes = {
    onGameChange: PropTypes.func,
    sectionData: PropTypes.array,
    curGame: PropTypes.object
  }

  componentDidMount() {
    this.scrollToCurGame()
  }

  render() {
    let {sectionData} = this.props

    return (
      <View style={{backgroundColor: Theme.defaultColor, width: 260, flex: 1}}>
        <View style={{height: 40}}/>
        <SectionList
          ref={ref => this.sectionList = ref}
          renderItem={({item}) => <ListRow title={ item.name } titleStyle={{ fontSize: 14 }} onPress={() =>  this.onChooseGame(item) } /> }
          renderSectionHeader={({section: { name }}) => {
            return <ListRow titleStyle={{ color: 'tomato', textAlign: 'center', fontSize: 16 }} title={ name } bottomSeparator='none'/>
          }}
          sections={ sectionData }
          keyExtractor={(item, index) => item + index}
          getItemLayout={this.getItemLayout}
        />
        <View style={{height: 40}}/>
      </View>
    )
  }

  onChooseGame(game) {
    this.props.onGameChange(game)
    // 当前游戏
    global.storage.save({
      key: 'game',
      data: game
    })
    NavService.reset('MainPage')
  }

  scrollToCurGame() {
    let {sectionData,curGame} = this.props
    let sectionIndex = sectionData.findIndex(el => curGame.type === el.value)
    let itemIndex = sectionData[sectionIndex].data.findIndex(el => el.id === curGame.id)

    this.sectionList.scrollToLocation({
      sectionIndex: sectionIndex,
      itemIndex: itemIndex
    })
  }
}