import axios from 'axios'
import store from '../../redux/store'
import defaultConfig from './config'
import NavigatorService from '../../services/navigator'
import Toast from 'teaset/components/Toast/Toast'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    let auth = store.getState().auth
    if (auth.isLoggedIn) {
        config.data.user_id = auth.user.uid
        config.data.sid = auth.user.sid
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
            case -6:
                NavigatorService.reset('login')
                break
            default: 
                break
        }
        Toast.fail(response.data.msg)
        return Promise.reject(response.data)
    }
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
})

export function post(url, data, timeout) {
    if (timeout !== undefined) {
        defaultConfig.timeout = timeout
    }
    return axios.post(`UrlCenter/${url}`, data, defaultConfig)
}

 
