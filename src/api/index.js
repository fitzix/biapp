import MomentJS from 'moment'

import {post, postEntryHandler} from '../utils/http/fetch'
import encryptUtil from '../utils/encrypt'
import StorageUtil from '../utils/storage'
import {desPubKey} from '../../app.json'

export function apiLogin(uname, pwd) {
  return post('UserLoginHandler', {username: uname, password: encryptUtil.strEnc(pwd, desPubKey[0], desPubKey[1], desPubKey[2])})
}

// 游戏分类
export function apiGameTypes() {
  return postEntryHandler(113012)
}

// 游戏,渠道, 大渠道, 平台 列表
export function apiListByType(types, game = -1) {
  return postEntryHandler(106012, { types: types, gameId: game })
}

// 获取实时数据
export async function apiRealTime(options, type) {

  options.dtBegin = MomentJS().add(-7, 'd').format('YYYY-MM-DD')
  options.dtEnd = MomentJS().add(-1, 'd').format('YYYY-MM-DD')

  if (type === 2) {
    delete options.regions
  }

  try {
    let curGame = await StorageUtil.getCurGame()
    return postEntryHandler(104004, { ...options, type, gameId: curGame.id })
  } catch (e) {
    return Promise.reject(e)
  }
}

// 区服top5
export async function apiGetTop5(curPage, pageSize, type) {
  try {
    let curGame = await StorageUtil.getCurGame()
    return postEntryHandler(200031004, { curPage, pageSize, type, gameId: curGame.id })
  }catch (e) {
    return Promise.reject(e)
  }
}
