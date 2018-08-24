import RestoreUtil from '../restore'


const storageUtil = {
    isLogin() {
        return global.storage.load({ key: 'user'}).then( () => true).catch( () => false)
    },

    getUser() {
        return global.storage.load({ key: 'user'})
    },

    getUserPwd() {
      return global.storage.load({ key: 'userPwd'})
    },

    save(key, data) {
        global.storage.save({
            key: key,
            data: data,
        })
    },

    clearAll() {
      global.storage.clearMap()
      global.storage.remove({ key: 'user' })
      global.storage.remove({ key: 'game' })
      global.storage.remove({ key: 'gameTypes' })
    },

    clearCache() {

    },

  // 获取游戏,分类 数据
    async getSideBarData() {
      let results = await global.storage.getBatchData([
        { key: 'gameTypes', syncInBackground: false },
        {
          key: 'optionList',
          id: -1,
          syncInBackground: false
        }
      ]).then(ret => ret).catch(() => [])
      let curGame = results[1].games[0]
      await this.getCurGame().then(ret => {
        curGame = ret
      }).catch(() => {
        global.storage.save({ key: 'game', data: curGame })
      })
      RestoreUtil.parseGameTypes(results[0], results[1].games)
      return { data:results[0], game: curGame }
    },

  // 获取当前选择游戏
    getCurGame() {
      return global.storage.load({ key: 'game', autoSync: false })
    },

    // 获取当前游戏平台渠道信息
    async getCurSearchOption() {
      let curGame = await this.getCurGame().catch(() => false)
      if (!curGame) {
        await RestoreUtil.sleep(1000) 
        try {
          curGame = await this.getCurGame()
        } catch (e) {
          return Promise.reject(e)
        }
      }

      return global.storage.load({
              key: 'optionList',
              id: curGame.id,
              syncInBackground: false
            })
    }
}

export default storageUtil