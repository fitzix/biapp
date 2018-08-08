
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
  }
}

export default restoreDataUtil