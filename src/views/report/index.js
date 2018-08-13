import React from 'react'
import {View, Text, ScrollView, StyleSheet} from 'react-native'
import {SegmentedBar} from "teaset"
import DatePicker from 'react-native-datepicker'
import MomentJS from 'moment'
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component'


import SearchPicker from '../../components/SearchPicker'
import HUD from "../../components/Hud"
import {apiGetReport} from "../../api"

export default class ReportPage extends React.Component {

  state = {
    curSelected: {},
    tableSeg: 0,
    dtBegin: MomentJS().add(-7, 'd').format('YYYY-MM-DD'),
    dtEnd: MomentJS().add(-1, 'd').format('YYYY-MM-DD'),
    tableData: {
      head: ['日期', '新增账号', '新增角色', '次留', '付费金额', '付费率', '付费角色ARPU', '活跃角色ARPU'],
      widthArr: [80, 60, 60, 50, 60, 50, 80, 90],
      data: []
    }
  }

  static hudKey = null

  render() {
    const tableData = this.state.tableData
    return (
      <View style={styles.container}>
        <View style={styles.datePickerContainer}>
          <DatePicker
            date={this.state.dtBegin}
            mode="date"
            style={[styles.datePicker, styles.datePickerLeft]}
            placeholder="选择开始时间"
            format="YYYY-MM-DD"
            showIcon={false}
            maxDate={this.state.dtEnd}
            onDateChange={(date) => {this.setState({dtBegin: date})}}
            customStyles={{
              dateInput: {
                borderWidth: 0
              }
            }}
          />
          <DatePicker
            date={this.state.dtEnd}
            mode="date"
            style={styles.datePicker}
            placeholder="选择开始时间"
            format="YYYY-MM-DD"
            showIcon={false}
            maxDate={this.state.dtEnd}
            onDateChange={(date) => {this.setState({dtEnd: date})}}
            customStyles={{
              dateInput: {
                borderWidth: 0
              }
            }}
          />
        </View>
        <SearchPicker ref='searchPickerRef' onSearch={this.onSearch} />
        <SegmentedBar onChange={(index) => this.onTableSegChange(index)}>
          <SegmentedBar.Item title='日报'/>
          <SegmentedBar.Item title='周报'/>
          <SegmentedBar.Item title='月报'/>
        </SegmentedBar>

        <ScrollView horizontal={true} style={styles.tableContainer}>
          <View>
            <Table borderStyle={{borderColor: '#C1C0B9'}}>
              <Row data={tableData.head} widthArr={tableData.widthArr} style={styles.tableHeader} textStyle={styles.tableHeaderText} />
            </Table>
            <ScrollView>
              <Table borderStyle={{borderColor: '#C1C0B9'}}>
                {
                  tableData.data.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={this.state.tableData.widthArr}
                      style={[styles.tableRow, index%2 && {backgroundColor: '#E3E3E3'}]}
                      textStyle={{ textAlign: 'center' }}
                    />
                  ))
                }
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
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
    let result = { data: [] }
    let needSetState = true
    apiGetReport(selected, this.state.dtBegin, this.state.dtEnd, index + 1).then(ret => {
      ret.info.forEach(el => {
        result.data.push([el.date, el.newCount, el.newCharacter, el.twoDay, el.payNum, el.payRate, el.payCharacterARPU, el.activeCharacterARPU ])
      })
    }).catch((err) => {
      if (err.isTimeout) {
        needSetState = false
      }
    }).finally(() => {
      if (needSetState) {
        this.setState(state => {
          state.curSelected = selected
          state.tableSeg = index
          state.tableData.data = result.data
          return state
        })
      }
      HUD.hide(ReportPage.hudKey)
    })
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
  },
  datePickerContainer: {
    marginTop: 5,
    marginHorizontal: 10,
    flexDirection: 'row'
  },
  datePicker: {
    flex: 1,
    backgroundColor: '#E3E3E3',
    borderRadius: 5,
    height: 40
  },
  datePickerLeft: {
    marginRight: 20
  },
  tableContainer: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 10
  },
  // tableHeader: {
  //   height: 50
  // },
  tableHeaderText: { textAlign: 'center' },
  tableRow: { height: 40 }
})