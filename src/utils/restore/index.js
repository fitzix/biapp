
const restoreDataUtil = {
  parseGameTypes(gameTypes, gameLists) {
    gameTypes.forEach(el => {
      el.data = []
    })

    gameLists.forEach(el => {
      let curType = gameTypes.find(cur => {
        return el.type === cur.value
      })
      curType.data.push(el)
    })
  },

  getOptionName(type) {
    switch (type) {
      case 'platforms': return { name: '平台', type: 1 }
      case 'bigChannels': return { name: '大渠道', type: 2 }
      case 'channels': return { name: '渠道', type: 3 }
      case 'regions': return { name: '区服', type: 4 }
    }
  },

  // 根据type 分类选择框数据
  groupedOptionSelected(data) {
    let selected = { platforms: [], bigChannels: [], channels: [], regions: [] }
    data.forEach( el => {
      switch (el.type) {
        case 1:
          selected.platforms.push(el.id)
          break
        case 2:
          selected.bigChannels.push(el.id)
          break
        case 3:
          selected.channels.push(el.id)
          break
        case 4:
          selected.regions.push(el.id)
          break
      }
    })
    return selected
  }
}

export default restoreDataUtil