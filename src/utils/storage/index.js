
const storageUtil = {
    async isLogin() {
        return await global.storage.load({ key: 'user'}).then( _ => true).catch( _ => false)
    },

    async getUser() {
        return await global.storage.load({ key: 'user'}).then(ret => ret.user)
    },
    
    save(key, data) {
        global.storage.save({
            key: key,
            data: data,
        })
    }
}

export default storageUtil