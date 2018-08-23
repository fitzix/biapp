
const restoreDataUtil = {
  parseGameTypes(gameTypes, gameLists) {
    if (gameTypes[0].value === 0) {
      gameTypes.shift()
    }

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
      case 'platforms':
      case 2:
        return {key: 'platforms', name: '平台', type: 2 }
      case 'bigChannels':
      case 5:
        return { key: 'bigChannels', name: '大渠道', type: 5 }
      case 'channels':
      case 4:
        return {key: 'channels', name: '渠道', type: 4 }
      case 'regions':
      case 3:
        return { key: 'regions', name: '区服', type: 3 }
    }
  },

  // 根据type 分类选择框数据
  groupedOptionSelected(data) {
    let selected = { platforms: [], bigChannels: [], channels: [], regions: [] }
    data.forEach( el => {
      switch (el.type) {
        case 2:
          selected.platforms.push(el.id)
          break
        case 5:
          selected.bigChannels.push(el.id)
          break
        case 4:
          selected.channels.push(el.id)
          break
        case 3:
          selected.regions.push(el.id)
          break
      }
    })
    return selected
  }
}

export default restoreDataUtil