import axios from 'axios'
import defaultConfig from './config'
import Toast from 'teaset/components/Toast/Toast'

import storageUtil from '../storage'
import routerUtil from '../router'

// Add a request interceptor
axios.interceptors.request.use(async function (config) {
    // Do something before request is sent
    if (await storageUtil.isLogin()) {
        let user = await storageUtil.getUser()
        console.log(user)
        config.data.user_id = user.uid
        config.data.sid = user.sid
    }
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.data.state !== 0) {
        switch (response.data.state) {
            case 7:
                routerUtil.logout()
                break
            default: 
                break
        }
        Toast.fail(response.data.msg)
        return Promise.reject(response.data)
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

 
