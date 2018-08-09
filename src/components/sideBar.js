import React from "react"
import { ListRow, Drawer, Theme } from 'teaset'
import { View, SectionList } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"

import RestoreDataUtil from '../utils/restore'

export default class SideBarPage {
  static sectionData = []

  static setNavOpt(title) {
    SideBarPage.loadData().then().catch()
    return {
      title: title,
      headerLeft: (
        <Ionicons name="ios-menu" style={{marginLeft: 10, marginBottom: -8}} size={25} color="tomato" />
      )
    }
  }

  static async loadData() {
    let types = await global.storage.load({ key: 'GAME_TYPES' }).then(ret => ret).catch(() => [])
    let games = await global.storage.load({ key: 'GAME_LIST' }).then(ret => ret).catch(() => [])
    SideBarPage.sectionData = RestoreDataUtil.parseGameTypes(types, games)
  }

  static show() {
    Drawer.open(SideBarPage.renderDrawerMenu())
  }

  static renderDrawerMenu() {
    return (
      <View style={{backgroundColor: Theme.defaultColor, width: 260, flex: 1}}>
        <View style={{height: 60}} />
        <SectionList
          renderItem={({ item }) => <ListRow title={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <ListRow titleStyle={{ color: 'tomato' }} title={title} bottomSeparator='none'/>
          )}
          sections={ SideBarPage.sectionData }
          keyExtractor={(item, index) => item + index}
        />
      </View>
    )
  }
}