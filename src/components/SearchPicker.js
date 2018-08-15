import React,{ Component } from 'react'
import  PropTypes from 'prop-types'
import MomentJS from 'moment'

import SectionedMultiSelect from '../components/MultiSelect'
import StorageUtil from '../utils/storage'
import RestoreUtil from '../utils/restore'

export default class SearchPicker extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
    useDate: PropTypes.bool
  }

  state = {
    originOptions: {},
    options: [],
    selected: [],
    date: {
      dtBegin: MomentJS().add(-7, 'd').format('YYYY-MM-DD'),
      dtEnd: MomentJS().add(-1, 'd').format('YYYY-MM-DD')
    }
  }

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
          ret[i].forEach( el => {
            el.type = category.type
          })
          temp.data = ret[i]
          options.push(temp)
          selected = selected.concat(ret[i])
        }
      }
      let sorted = options.sort((x,y) => {
        return x.type > y.type
      })
      this.setState({originOptions: ret, options: sorted, selected: selected })
      this.onConfirm(true)
    })
  }

  onSelectedItemObjectsChange = (selectedItems) => {
    this.setState({ selected: selectedItems })
  }

  onDateChange = (date) => {
    this.setState({ date: date })
  }

  parseSelected() {
    let selected = []
    this.state.selected.forEach(el => {
      selected.push(el.id)
    })
    return selected
  }

  onConfirm = (isFirst) => {
    const { onSearch } = this.props
    let groupSelected = RestoreUtil.groupedOptionSelected(this.state.selected)
    if (this.props.useDate) {
      groupSelected.dtBegin = this.state.date.dtBegin
      groupSelected.dtEnd = this.state.date.dtEnd
    }
    onSearch(groupSelected, isFirst)
  }

  render() {
    return (
        <SectionedMultiSelect
          styles={{
            container: {
              marginVertical: 50,
            },
            selectToggle: {
              backgroundColor: '#F8F8F8',
              height: 40,
              borderRadius: 5,
              marginHorizontal: 5,
              marginVertical: 5
            },
            selectToggleText: {
              marginLeft: 20,
              color: '#525252'
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
          selectText='选择查询条件'
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
    )
  }
}