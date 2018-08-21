import React, {Component} from 'react'
import {View} from 'react-native'
import {Select} from 'teaset'
import PropTypes from 'prop-types'
import MomentJS from 'moment'

import SectionedMultiSelect from '../components/MultiSelect'
import StorageUtil from '../utils/storage'
import RestoreUtil from '../utils/restore'

export default class SearchPicker extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
    useDate: PropTypes.bool,
    useGroup: PropTypes.bool
  }

  groupItems = [
    { id: 2, name: '平台维度' },
    { id: 5, name: '大渠道' },
    { id: 4, name: '渠道' },
    { id: 3, name: '区服' },
    // { id: 6, name: '渠道-区服' },
  ]

  state = {
    originOptions: {},
    options: [],
    selected: [],
    groupType: 2,
    date: {
      dtBegin: MomentJS().add(-7, 'd').format('YYYY-MM-DD'),
      dtEnd: MomentJS().add(-1, 'd').format('YYYY-MM-DD')
    }
  }

  parsedOptions = new Map()

  componentWillMount() {
    StorageUtil.getCurSearchOption().then(ret => {
      let options = []
      let selected = []
      for (let i in ret) {
        let temp = {}
        if (i !== 'games') {
          let category = RestoreUtil.getOptionName(i)
          temp.name = category.name
          temp.type = category.type
          temp.id = i
          ret[i].forEach(el => {
            el.type = category.type
          })
          temp.data = ret[i]
          options.push(temp)
          selected = selected.concat(ret[i])
          if(this.props.useGroup) {
            this.parsedOptions.set(category.type, temp)
          }
        }
      }
      let sorted = options.sort((x, y) => {
        return x.type > y.type
      })

      if(this.props.useGroup) {
        sorted = [this.parsedOptions.get(this.state.groupType)]
        selected = sorted[0].data
      }
      this.setState({originOptions: ret, options: sorted, selected: selected})
      this.onConfirm(true)
    })
  }

  onSelectedItemObjectsChange = (selectedItems) => {
    this.setState({selected: selectedItems})
  }

  onDateChange = (date) => {
    this.setState({date: date})
  }

  onGroupChange(item){
    let option = []
    // let select = []
    // if (item === 6) {
    //   option = [this.parsedOptions.get(4), this.parsedOptions.get(3)]
    //   select = option[0].data.connect(option[1].data)
    // } else {
    //   option.push(this.parsedOptions.get(item.id))
    //   select = option[0].data
    // }
    option.push(this.parsedOptions.get(item.id))
    this.setState({options: option, groupType: item.id, selected: option[0].data})
  }

  parseSelected() {
    let selected = []
    this.state.selected.forEach(el => {
      selected.push(el.id)
    })
    return selected
  }

  onConfirm = (isFirst) => {
    const {onSearch} = this.props
    let groupSelected = {}
    if (this.props.useDate) {
      groupSelected.dtBegin = this.state.date.dtBegin
      groupSelected.dtEnd = this.state.date.dtEnd
    }
    if (this.props.useGroup) {
      groupSelected.type = this.state.groupType
      groupSelected.item = []
      this.state.selected.forEach(el => {
        groupSelected.item.push(el.id)
      })
      onSearch(groupSelected)
    } else {
      groupSelected = Object.assign(groupSelected, RestoreUtil.groupedOptionSelected(this.state.selected))
      onSearch(groupSelected, isFirst)
    }
  }

  render() {
    return (
      <View style={{flexDirection: 'row', marginVertical: 2, marginHorizontal: 2}}>
        { this.props.useGroup &&
        <Select
          style={{flex: 0.5, height: 40, borderWidth: 0, marginRight: 2}}
          value={this.state.groupType}
          items={this.groupItems}
          getItemValue={(item, index) => item.id}
          getItemText={(item, index) => item.name}
          placeholder='选择查询维度'
          valueStyle={{color: 'tomato', textAlign: 'center'}}
          pickerTitle='选择查询维度'
          onSelected={(item, index) => this.onGroupChange(item)}
        />
        }
        <SectionedMultiSelect
          styles={{
            container: {
              marginVertical: 50,
            },
            selectToggle: {
              backgroundColor: 'white',
              height: 40,
            },
            selectToggleText: {
              marginLeft: 20,
              color: 'tomato'
            }
          }}
          colors={{
            cancel: 'tomato'
          }}
          useDate={this.props.useDate}
          date={this.state.date}
          onDateChange={this.onDateChange}
          items={this.state.options}
          uniqueKey='id'
          subKey='data'
          selectText='选择条件'
          selectedText='项选中'
          confirmText='查询'
          showDropDowns={true}
          showChips={false}
          readOnlyHeadings={true}
          showCancelButton={true}
          onSelectedItemsChange={() => {}}
          onSelectedItemObjectsChange={this.onSelectedItemObjectsChange}
          onConfirm={this.onConfirm}
          selectedItems={this.parseSelected()}
        />
      </View>
    )
  }
}