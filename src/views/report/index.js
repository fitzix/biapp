import React from 'react'
import {ScrollView, StyleSheet} from 'react-native'
import {SegmentedBar} from "teaset"
import {Table, TableWrapper, Row, Rows} from 'react-native-table-component'


import SearchPicker from '../../components/SearchPicker'
import HUD from "../../components/Hud"
import {apiGetReport} from "../../api"
import TransferUtil from '../../utils/transfer'

export default class ReportPage extends React.Component {

  state = {
    curSelected: {},
    tableSeg: 0,
    tableData: {
      head: [],
      widthArr: [],
      data: []
    }
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
        <SearchPicker useDate={true} onSearch={this.onSearch}/>
        <SegmentedBar onChange={(index) => this.onTableSegChange(index)}>
          <SegmentedBar.Item title='日报'/>
          <SegmentedBar.Item title='周报'/>
          <SegmentedBar.Item title='月报'/>
        </SegmentedBar>

        <ScrollView horizontal={true} style={styles.tableContainer}>
          <Table borderStyle={{borderColor: '#DADADA', borderWidth: .5}}>
            <Row data={tableData.head} widthArr={tableData.widthArr} style={styles.tableHeader} textStyle={styles.tableText}/>
            <TableWrapper style={styles.tableWrapper}>
              <Rows data={tableData.data} widthArr={tableData.widthArr} style={styles.tableRow} textStyle={styles.tableText}/>
            </TableWrapper>
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
    ReportPage.hudKey = HUD.show()
    let result = {head: ['日期', '新增账号', '新增角色', '次留', '登录账号', '登录角色', '付费金额', '付费率', '付费角色ARPU', '活跃角色ARPU'], data: [], widthArr: [85, 70, 70, 70, 70, 70, 70, 60, 100, 100]}
    if (index === 1) {
      result.widthArr[0] = 150
    }
    console.log('selected', selected)
    apiGetReport(selected, index + 1).then(ret => {
      ret.info.forEach(el => {
        result.data.push([
          el.date,
          TransferUtil.numFormatter(el.newCount),
          TransferUtil.numFormatter(el.newCharacter),
          TransferUtil.numFormatter(el.twoDay, 'percent'),
          TransferUtil.numFormatter(el.loginCount),
          TransferUtil.numFormatter(el.loginCharacter),
          TransferUtil.numFormatter(el.payNum),
          TransferUtil.numFormatter(el.payRate, 'percent'),
          TransferUtil.numFormatter(el.payCharacterARPU),
          TransferUtil.numFormatter(el.activeCharacterARPU)
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
      HUD.hide(ReportPage.hudKey)
    })
  }
}

const styles = StyleSheet.create({
  container: {},
  tableContainer: {
    marginHorizontal: 1,
    backgroundColor: 'white'
  },
  tableWrapper: {flexDirection: 'row'},
  tableHeader: {
    height: 25
  },
  tableText: {textAlign: 'center', color: '#5E5E5E'},
  tableRow: {height: 28}
})