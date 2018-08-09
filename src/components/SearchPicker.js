import React,{ Component } from 'react'
import { View } from 'react-native'
import  PropTypes from 'prop-types'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'

import StorageUtil from '../utils/storage'
import RestoreUtil from '../utils/restore'

export default class SearchPicker extends Component {
  static propTypes = {
    onSearch: PropTypes.func
  }

  state = {
    options: [],
    selected: [],
  }

  componentWillMount() {
    StorageUtil.getCurSearchOption().then(ret => {
      let options = []
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
        }
      }
      let sorted = options.sort((x,y) => {
        return x.type > y.type
      })
      this.setState({ options: sorted })
    })
  }

  onSelectedItemObjectsChange = (selectedItems) => {
    this.setState({ selected: selectedItems })
    console.log('obj', selectedItems)
  }

  parseSelected() {
    let selected = []
    this.state.selected.forEach(el => {
      selected.push(el.id)
    })
    return selected
  }


  onConfirm = () => {
    const { onSearch } = this.props
    let groupSelected = RestoreUtil.groupedOptionSelected(this.state.selected)
    onSearch(groupSelected)
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionedMultiSelect
          styles={{
            container: {
              marginVertical: 60
            },
            selectToggle: {
              backgroundColor: '#E3E3E3',
              height: 40,
              borderRadius: 5
            },
            selectToggleText: {
              marginLeft: 20
            }
          }}
          items={this.state.options}
          uniqueKey='id'
          subKey='data'
          selectText='选择查询条件'
          confirmText='查询'
          showDropDowns={true}
          showChips={false}
          readOnlyHeadings={true}
          showCancelButton={true}
          showRemoveAll={true}
          onSelectedItemsChange={() => {}}
          onSelectedItemObjectsChange={this.onSelectedItemObjectsChange}
          onConfirm={this.onConfirm}
          selectedItems={this.parseSelected()}
        />
      </View>
    )
  }
}

const styles = {
  container: {
    paddingTop: 10,
    paddingHorizontal: 10
  }
}