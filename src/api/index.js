import MomentJS from 'moment'

import {post, all, postEntryHandler} from '../utils/http/fetch'
import encryptUtil from '../utils/encrypt'
import StorageUtil from '../utils/storage'
import ENV from '../config'

export function apiLogin(uname, pwd) {
  return post('UserLoginHandler', {username: uname, password: encryptUtil.strEnc(pwd, ENV.desPubKey[0], ENV.desPubKey[1], ENV.desPubKey[2])})
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
    return all(postEntryHandler(104004, { ...options, type, gameId: curGame.id }), postEntryHandler(200032004, { ...options, type, gameId: curGame.id }))
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

// 数据报表
export async function apiGetReport(options, type) {
  try {
    let curGame = await StorageUtil.getCurGame()
    return postEntryHandler(102004, { ...options, type, gameId: curGame.id, curPage: 1, pageSize: 90 })
  }catch (e) {
    return Promise.reject(e)
  }
}

// 分项数据
export async function apiGetShared(options, seg) {
  let menuID = [60121011, 60122011, 60111011][seg]
  try {
    let curGame = await StorageUtil.getCurGame()
    return postEntryHandler(menuID, { ...options, gameId: curGame.id, curPage: 1, pageSize: 60 })
  }catch (e) {
    return Promise.reject(e)
  }
}

// 翻译数据
export async function apiGetTranslate(options) {
  try {
    let curGame = await StorageUtil.getCurGame()
    return postEntryHandler(203006, {gameId: curGame.id, ...options})
  } catch (e) {
    return Promise.reject(e)
  }
}
