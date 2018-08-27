import React from "react"
import { ScrollView, StyleSheet } from 'react-native'

import SearchPicker from '../../components/SearchPicker'
import HUD from "../../components/Hud"
import {apiGetShared} from "../../api"
import TransferUtil from "../../utils/transfer"
import RestoreUtil from '../../utils/restore'
import StoreUtil from '../../utils/storage'
import {SegmentedBar} from "teaset";
import {Row, Rows, Table} from "react-native-table-component"


export default class SharedPage extends React.Component {

  state = {
    curSelected: {},
    tableSeg: 0,
    tableData: {
      head: [],
      widthArr: [],
      data: []
    }
  }

  sharedHeaderTitle = [
    { head: ['日期', '来源', '分享点', '分享人数', 'DAU占比', '分享次数'], widthArr: [85, 70, 90, 70, 70, 70] },
    { head: ['日期', '来源', '分享点', '引流人数', 'DAU占比', '分享次数', '新进人数', '新进效率', '有效率'], widthArr: [85, 70, 90, 70, 70, 70, 70, 70, 70] },
    { head: ['日期', '来源', '视频触发点', '主动触发人数', '主动触发次数', '主动关闭人数', '主动关闭次数', '播放人数', '播放次数', '中途关闭人数', '中途关闭次数', '观看结束人数', '观看结束次数', '获得奖励人数', '获得奖励次数', '完成DAU占比'], widthArr: [85, 70, 90, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70, 70] }
  ]

  static hudKey = null

  componentDidMount() {
    this._mounted = true
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    const tableData = this.state.tableData
    return (
      <ScrollView style={styles.container}>
        <SearchPicker ref='searchPickerRef' useDate={true} useGroup={true} onSearch={this.onSearch} />
        <SegmentedBar onChange={(index) => this.onTableSegChange(index)}>
          <SegmentedBar.Item title='分享出'/>
          <SegmentedBar.Item title='分享入'/>
          <SegmentedBar.Item title='广告统计'/>
        </SegmentedBar>
        <ScrollView horizontal={true} style={styles.tableContainer}>
          <Table borderStyle={{borderColor: '#DADADA', borderWidth: .5}}>
            <Row data={tableData.head} widthArr={tableData.widthArr} style={styles.tableHeader} textStyle={styles.tableText}/>
            <Rows data={tableData.data} widthArr={tableData.widthArr} style={styles.tableRow} textStyle={styles.tableText}/>
          </Table>
        </ScrollView>
      </ScrollView>
    )
  }

  // 点击查询
  onSearch = (selected) => {
    this.loadTableData(selected, this.state.tableSeg)
  }
  // 切换tab
  onTableSegChange = (index) => {
    this.loadTableData(this.state.curSelected, index)
  }

  async loadTableData(selected, index) {
    SharedPage.hudKey = HUD.show()
    let result = Object.assign({ data: [] }, this.sharedHeaderTitle[index])
    let ret = await apiGetShared(selected, index).catch(() => false)
    if (ret) {
      let attrKey = RestoreUtil.getOptionName(this.refs.searchPickerRef.state.groupType).key
      TransferUtil.searchOption(ret.info, this.refs.searchPickerRef.state.originOptions, attrKey, 'dimension')
      let translateOptions = await StoreUtil.getTranslate({ type:  [19, 19, 21][index]}).catch(() => false)
      if (translateOptions) {
        TransferUtil.unionTranslate(ret.info, translateOptions, 'point')
      }
      ret.info.forEach(el => {
        let temp = [el.dt, el.dimension, el.point]
        if (index === 2) {
          temp.push(
            TransferUtil.numFormatter(el.activeOpenNum),
            TransferUtil.numFormatter(el.activeOpenCount),
            TransferUtil.numFormatter(el.activeCloseNum),
            TransferUtil.numFormatter(el.activeCloseCount),
            TransferUtil.numFormatter(el.openVideoNum),
            TransferUtil.numFormatter(el.openVideoCount),
            TransferUtil.numFormatter(el.midwayCloseVideoNum),
            TransferUtil.numFormatter(el.midwayCloseVideoCount),
            TransferUtil.numFormatter(el.watchEndNum),
            TransferUtil.numFormatter(el.watchEndCount),
            TransferUtil.numFormatter(el.obtainRewardNum),
            TransferUtil.numFormatter(el.obtainRewardCount),
            TransferUtil.numFormatter(el.dau, 'percent'),
          )
        } else {
          temp.push(
            TransferUtil.numFormatter(el.num),
            TransferUtil.numFormatter(el.dau, 'percent'),
            TransferUtil.numFormatter(el.count),
            //  分享入
            TransferUtil.numFormatter(el.newShare),
            TransferUtil.numFormatter(el.newShareRate, 'percent'),
            TransferUtil.numFormatter(el.shareValidRate, 'percent')
          )
        }
        result.data.push(temp)
      })

      if (this._mounted) {
        this.setState(state => {
          state.curSelected = selected
          state.tableSeg = index
          state.tableData = result
          return state
        })
      }
      HUD.hide(SharedPage.hudKey)
    }
  }

}

const styles = StyleSheet.create({
  container: {
  },
  tableContainer: {
    marginHorizontal: 1,
    backgroundColor: 'white',
    marginTop: 5
  },
  tableWrapper: { flexDirection: 'row' },
  tableHeader: {
    height: 25
  },
  tableText: { textAlign: 'center', color: '#5E5E5E' },
  tableRow: { height: 28 }
})
