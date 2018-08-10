import React, {Component} from 'react'
import { ScrollView, StyleSheet } from "react-native"
import {SegmentedBar} from 'teaset'
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component'


import SearchPicker from '../../components/SearchPicker'
import WebChart from '../../components/WeCharts'
import HUD from '../../components/Hud'
import { apiRealTime, apiGetTop5 } from '../../api'


export default class RealTimePage extends Component {

  state = {
    curSelected: {},
    chartSeg: 0,
    tableSeg: 0,
    chartData: null,
    tableData: {
      head: ['#', '类型', '数量', '日环比'],
      title: [],
      data: []
    }
  }

  static hudKey = null

  componentWillMount() {
    let result = { title: [], data: [] }
    apiGetTop5(1, 5, this.state.tableSeg + 1).then(ret => {
      ret.info.forEach((el, index) => {
        result.title.push(index)
        result.data.push([el.id, el.count, el.day])
      })
    }).finally(() => {
      this.setState(state => {
        state.tableData.title = result.title
        state.tableData.data = result.data
        return state
      })
    })
  }


  render() {
    return (
      <ScrollView style={{backgroundColor: '#f8f8f8'}}>
        <SearchPicker onSearch={this.onSearch} />
        <SegmentedBar justifyItem='scrollable' onChange={(index) => this.onSegmentedBarChange(index)}>
          <SegmentedBar.Item title='在线玩家'/>
          <SegmentedBar.Item title='新增账号'/>
          <SegmentedBar.Item title='新增角色'/>
          <SegmentedBar.Item title='付费金额'/>
          <SegmentedBar.Item title='付费角色'/>
          <SegmentedBar.Item title='实时留存'/>
          <SegmentedBar.Item title='首次区服新增'/>
          <SegmentedBar.Item title='实时DAU'/>
        </SegmentedBar>

        <WebChart
          style={styles.chart}
          option={
            {
              legend: {
                data: ['每天', '每周', '上周']
              },
              tooltip: {},
              dataset: {
                dimensions: ['axis', 'count1', 'count2', 'count3'],
                source: this.state.chartData || [{ axis: null, count1: 0, count2: 0, count3: 0 }]
              },
              xAxis: {type: 'category'},
              yAxis: {},
              series: [
                {name:'每天', type: 'line'},
                {name:'每周', type: 'line'},
                {name:'上周', type: 'line'}
              ]
            }
          }
        />

        <SegmentedBar  style={styles.topDataSeg} justifyItem='scrollable' onChange={(index) => this.onTabSegChange(index)}>
          <SegmentedBar.Item title='渠道新增Top5' />
          <SegmentedBar.Item title='渠道付费Top5' />
          <SegmentedBar.Item title='区服在线Top5' />
          <SegmentedBar.Item title='区服付费Top5' />
        </SegmentedBar>

        <Table style={styles.topTableContainer} borderStyle={{borderColor: '#C0C0C0'}}>
          <Row data={this.state.tableData.head} flexArr={[1, 1, 1, 1]} style={styles.topTableHead} textStyle={styles.topTableText}/>
          <TableWrapper style={styles.topTableWrapper}>
            <Col data={this.state.tableData.title} style={styles.topTableTitle} heightArr={[28,28]} textStyle={styles.topTableText}/>
            <Rows data={this.state.tableData.data} flexArr={[1, 1, 1]} style={styles.topTableRow} textStyle={styles.topTableText}/>
          </TableWrapper>
        </Table>

      </ScrollView>
    )
  }

  // 点击查询
  onSearch = (selected) => {
    RealTimePage.hudKey = HUD.show()
    apiRealTime(selected, this.state.chartSeg + 1).then(ret => {
      this.setState({ curSelected: selected, chartData: ret.info })
    }).finally(() => {
      HUD.hide(RealTimePage.hudKey)
    })
  }


  onSegmentedBarChange(index) {
    let chartData = null
    RealTimePage.hudKey = HUD.show()
    apiRealTime(this.state.curSelected, index + 1).then(ret => {
      chartData = ret.info
    }).finally(() => {
      this.setState({ chartSeg: index, chartData: chartData })
      HUD.hide(RealTimePage.hudKey)
    })
  }

  onTabSegChange(index) {
    let result = { title: [], data: [] }
    RealTimePage.hudKey = HUD.show()
    apiGetTop5(1, 5, index + 1).then(ret => {
      ret.info.forEach((el, i) => {
        result.title.push(i)
        result.data.push([el.id, el.count, el.day])
      })
    }).finally(() => {
      this.setState(state => {
        state.tableData.title = result.title
        state.tableData.data = result.data
        state.tableSeg = index
        return state
      })
      HUD.hide(RealTimePage.hudKey)
    })
  }
}

const styles = StyleSheet.create({
  chart: {
    height: 300,
    marginTop: 10,
  },
  topDataSeg: {
    marginTop: -20
  },
  topTableContainer: {
    marginTop: 10
  },
  topTableHead: {
    height: 20,
  },
  topTableWrapper: { flexDirection: 'row' },
  topTableTitle: { flex: 1 },
  topTableRow: {  height: 28  },
  topTableText: { textAlign: 'center', color: '#5E5E5E' }
})