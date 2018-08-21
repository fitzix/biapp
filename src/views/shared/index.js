import React from "react"
import {View, Text, ScrollView, StyleSheet} from 'react-native'

import SearchPicker from '../../components/SearchPicker'
import HUD from "../../components/Hud"
import {apiGetShared} from "../../api"
import TransferUtil from "../../utils/transfer"
import RestoreUtil from '../../utils/restore'
import {SegmentedBar} from "teaset";
import {Row, Rows, Table, TableWrapper} from "react-native-table-component";


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

  sharedHeaderTitle = {
    out: { data: [], head: ['日期', '类型', '分享点', '分享人数', 'DAU占比', '分享次数'], widthArr: [85, 70, 70, 70, 70, 70] },
    in: { data: [], head: ['日期', '类型', '分享点', '引流人数', 'DAU占比', '分享次数', '新进人数', '新进效率', '有效率'], widthArr: [85, 70, 70, 70, 70, 70, 70, 70, 70] }
  }

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
        </SegmentedBar>
        <ScrollView horizontal={true} style={styles.tableContainer}>
          <Table borderStyle={{borderColor: '#C0C0C0'}}>
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

  loadTableData(selected, index) {
    SharedPage.hudKey = HUD.show()
    let result = {...this.sharedHeaderTitle.out}
    if (index === 1) {
      result = {...this.sharedHeaderTitle.in}
    }
    console.log('selected', selected)
    apiGetShared(selected, index).then(ret => {
      let attrKey = RestoreUtil.getOptionName(this.refs.searchPickerRef.groupType).key
      TransferUtil.searchOption(ret.info, this.refs.searchPickerRef.originOptions, attrKey, dimension)
      ret.info.forEach(el => {
        result.data.push([
          el.dt,
          el.dimension,
          TransferUtil.numFormatter(el.num),
          TransferUtil.numFormatter(el.dau, 'percent'),
          TransferUtil.numFormatter(el.count),
        //  分享入
          TransferUtil.numFormatter(el.newShare),
          TransferUtil.numFormatter(el.newShareRate, 'percent'),
          TransferUtil.numFormatter(el.shareValidRate, 'percent'),
        ])
      })
    }).finally(() => {
      if (this._mounted) {
        this.setState(state => {
          state.curSelected = selected
          state.tableSeg = index
          state.tableData = result
          return state
        })
      }
      HUD.hide(SharedPage.hudKey)
    })
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white'
  },
  tableContainer: {
    marginTop: 2,
    marginHorizontal: 2,
    backgroundColor: 'white'
  },
  tableWrapper: { flexDirection: 'row' },
  tableHeader: {
    height: 25
  },
  tableText: { textAlign: 'center', color: '#5E5E5E' },
  tableRow: { height: 28 }
})
