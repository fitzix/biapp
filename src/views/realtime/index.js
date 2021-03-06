import React, {Component} from 'react'
import { ScrollView, StyleSheet, Text } from "react-native"
import {SegmentedBar} from 'teaset'
import { Table, Row, Rows } from 'react-native-table-component'


import SearchPicker from '../../components/SearchPicker'
import WebChart from '../../components/WebCharts'
import HUD from '../../components/Hud'
import TransferUtil from '../../utils/transfer'
import StorageUtil from '../../utils/storage'
import { apiRealTime, apiGetTop5 } from '../../api'

export default class RealTimePage extends Component {

  state = {
    curSelected: {},
    yFormatter: 'thousand',
    chartSeg: 0,
    tableSeg: 0,
    total: null,
    chartData: null,
    tableData: {
      head: ['#', '类型', '数量', '日环比'],
      title: [],
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
    return (
      <ScrollView style={styles.container}>
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

        <Text style={styles.totalText}>累计: {this.state.total}</Text>
        <WebChart
          style={styles.chart}
          option={
            {
              //自定义属性 percent
              yFormatter: this.state.yFormatter,
              legend: { 
                data: ['今日', '昨日', '上周'],
                top: 5
              },
              tooltip: {},
              dataset: {
                dimensions: ['axis', 'count1', 'count2', 'count3'],
                source: this.state.chartData || [{ axis: null, count1: 0, count2: 0, count3: 0 }]
              },
              grid: {
                left: '9%',
                top: 30,
                right: '5%',
                bottom: 25
              },
              xAxis: {type: 'category'},
              yAxis: {
                axisLabel: {

                }
              },
              series: [
                {name:'今日', type: 'line'},
                {name:'昨日', type: 'line'},
                {name:'上周', type: 'line'}
              ]
            }
          }
        />

        <SegmentedBar justifyItem='scrollable' onChange={(index) => this.onTabSegChange(index)}>
          <SegmentedBar.Item title='渠道新增Top5' />
          <SegmentedBar.Item title='渠道付费Top5' />
          <SegmentedBar.Item title='区服在线Top5' />
          <SegmentedBar.Item title='区服付费Top5' />
        </SegmentedBar>

        <Table style={styles.topTableContainer} borderStyle={{borderWidth: .5, borderColor: '#DADADA'}}>
          <Row data={this.state.tableData.head} flexArr={[1, 3, 2, 2]} style={styles.topTableHead} textStyle={styles.topTableText}/>
          <Rows data={this.state.tableData.data} flexArr={[1, 3, 2, 2]} style={styles.topTableRow} textStyle={styles.topTableText}/>
        </Table>

      </ScrollView>
    )
  }

  // 点击查询
  onSearch = (selected, loadTop5) => {
    this.loadChartData(this.state.chartSeg, selected)
    if (loadTop5 !== undefined) {
      this.loadTop5(this.state.tableSeg)
    }
  }

  onSegmentedBarChange(index) {
    this.loadChartData(index, this.state.curSelected)
  }

  onTabSegChange(index) {
    RealTimePage.hudKey = HUD.show()
    this.loadTop5(index).finally(() => {
      HUD.hide(RealTimePage.hudKey)
    })
  }

  loadChartData(index, selected) {
    let chartData = null
    let totalText = null
    RealTimePage.hudKey = HUD.show()
    apiRealTime(selected, index + 1).then(ret => {
      chartData = ret[0].info
      totalText = ret[1].info
    }).finally( () => {
      if (this._mounted) {
        this.setState({
          curSelected: selected, 
          chartSeg: index, 
          total: totalText, 
          chartData: chartData, 
          yFormatter: index === 5 ? 'percent' : '' 
        })
      }
      HUD.hide(RealTimePage.hudKey)
    })
  }

  async loadTop5(index) {
    let result = { data: [] }
    try {
      let ret = await apiGetTop5(1, 5, index + 1)
      let curSearchOption = await StorageUtil.getCurSearchOption()
      TransferUtil.top5(ret.info, curSearchOption, index + 1)
      console.log('trans', ret.info)
      ret.info.forEach((el, index) => {
        result.data.push([index + 1,el.id, el.count, el.day])
      })

    } finally {
      if (this._mounted) {
        this.setState(state => {
          state.tableSeg = index
          state.tableData.data = result.data
          return state
        })
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white'
  },
  totalText: {
    textAlign: 'center',
    backgroundColor: '#FFF',
    height: 35,
    lineHeight: 35,
    fontSize: 15,
    marginTop: 4,
    color: '#5A5A5A'
  },
  chart: {
    height: 300,
    marginVertical: 1,
    marginHorizontal: 2,
    marginBottom: 3
  },
  topTableContainer: {
    backgroundColor: 'white',
    marginTop: 5
  },
  topTableHead: {
    height: 20,
  },
  topTableWrapper: { flexDirection: 'row' },
  topTableTitle: { flex: 1 },
  topTableRow: {  height: 28  },
  topTableText: { textAlign: 'center', color: '#5E5E5E' }
})