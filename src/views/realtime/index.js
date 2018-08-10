import React, {Component} from 'react'
import {Text, View, ScrollView, StyleSheet, Alert} from "react-native"
import {SegmentedBar} from 'teaset'


import SearchPicker from '../../components/SearchPicker'
import WebChart from '../../components/WeCharts'
import HUD from '../../components/Hud'
import { apiRealTime } from '../../api'


export default class RealTimePage extends Component {

  state = {
    curSelected: {},
    curSegmented: 0,
    data: null
  }

  static hudKey = null

  shouldComponentUpdate(nextProps, nextState) {
    console.log('sdsdssssad', nextProps, nextState)
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
                source: this.state.data || [{ axis: null, count1: 0, count2: 0, count3: 0 }]
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
      </ScrollView>
    )
  }

  // 点击查询
  onSearch = (selected) => {
    RealTimePage.hudKey = HUD.show()
    apiRealTime(selected, this.state.curSegmented + 1).then(ret => {
      this.setState({ curSelected: selected, data: ret.info })
      console.log(this.state.data)
    }).finally(() => {
      HUD.hide(RealTimePage.hudKey)
    })
  }


  onSegmentedBarChange(index) {
    this.setState({ curSegmented: index, data: null })
    RealTimePage.hudKey = HUD.show()
    apiRealTime(this.state.curSelected, index + 1).then(ret => {
      this.setState({ data: ret.info })
    }).finally(() => {
      HUD.hide(RealTimePage.hudKey)
    })
  }
}

const styles = StyleSheet.create({
  chart: {
    height: 300,
    marginTop: 10,
    marginRight: 10
  },
})