
const storageUtil = {
    async isLogin() {
        return await global.storage.load({ key: 'user'}).then( () => true).catch( () => false)
    },

    async getUser() {
        return await global.storage.load({ key: 'user'}).then(ret => ret)
    },
    
    save(key, data) {
        global.storage.save({
            key: key,
            data: data,
        })
    },

    clearAll() {
      global.storage.remove({ key: 'user' })
      global.storage.remove({ key: 'gameTypes' })
      global.storage.remove({ key: 'gameList' })
    }
}

export default storageUtil