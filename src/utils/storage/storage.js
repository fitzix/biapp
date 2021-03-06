import React from 'react'
import {AsyncStorage} from 'react-native'
import Storage from 'react-native-storage'

import { apiGameTypes, apiListByType, apiGetTranslate } from '../../api/index'

let storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,

    // 数据过期时间，默认30天（1000 * 3600 * 24 * 30 毫秒），设为null则永不过期
    defaultExpires: 1000 * 3600 * 24 * 30,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是写到另一个文件里，这里require引入
    // 或是在任何时候，直接对storage.sync进行赋值修改
    sync: {
        gameTypes(params) {
          let { resolve, reject } = params
          apiGameTypes().then(ret => {
            storage.save({ key: 'gameTypes', data: ret.info })
            resolve && resolve(ret.info)
          }).catch(err => {
            reject && reject(err)
          })
        },
      // 获取下拉框数据
        optionList(params) {
          let { id, resolve, reject } = params
          apiListByType([1, 2, 3, 4, 5], id).then( ret => {
            storage.save({ key: 'optionList', id: id, data: ret.info })
            resolve && resolve(ret.info)
          }).catch(err => {
            reject && reject(err)
          })
        },
      // 获取翻译数据
        translateList(params) {
          let { id, resolve, reject, syncParams: { extraFetchOptions } } = params
          apiGetTranslate(extraFetchOptions).then(ret => {
            storage.save({ key: 'translateList', id, data: ret.infos })
            resolve && resolve(ret.infos)
          }).catch(err => {
            reject && reject(err)
          })
        }
    }
})

export default storage