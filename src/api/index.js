import {post, postEntryHandler} from '../utils/http/fetch'
import encryptUtil from '../utils/encrypt'
import {desPubKey} from '../../app.json'

export function apiLogin(uname, pwd) {
  return post('UserLoginHandler', {username: uname, password: encryptUtil.strEnc(pwd, desPubKey[0], desPubKey[1], desPubKey[2])})
}

export function apiGameTypes() {
  return postEntryHandler(113012)
}

export function apiListByType(types) {
  return postEntryHandler(106012, { types: types })
}