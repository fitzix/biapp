import axios from 'axios'
import defaultConfig from './config'
import Toast from 'teaset/components/Toast/Toast'

import storageUtil from '../storage'
import routerUtil from '../router'

// Add a request interceptor
axios.interceptors.request.use(async function (config) {
    // Do something before request is sent
    if (await storageUtil.isLogin()) {
      storageUtil.getUser().then( ret => {
        config.data.user_id = ret.uid
        config.data.sid = ret.sid
      }).catch(err => {
        return Promise.reject(err)
      })
    }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    let reason = {}
    // Do something with response data
    if (response.data.state !== 0) {
        switch (response.data.state) {
            case 7:
                routerUtil.logout()
                reason.isTimeout = true
                break
            default:
                break
        }
        Toast.fail(response.data.msg)
      // 判断是否是超时错误
        return Promise.reject(reason)
    } else if (response.data.hasOwnProperty('response')) {
      if (response.data.response.state !== 0) {
        Toast.fail(response.data.response.msg)
        return Promise.reject(response.data.response.msg)
      }
        return response.data.response
    }
    return response.data;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error)
})

export function post(url, data, timeout) {
    if (timeout !== undefined) {
        defaultConfig.timeout = timeout
    }
    return axios.post(`UrlCenter/${url}`, data, defaultConfig)
}

export function postEntryHandler(menu,data) {
  return axios.post('UrlCenter/RequestEntryHandler', { menu_id: menu, request_data: data }, defaultConfig)
}

 
