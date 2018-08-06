import axios from 'axios'
import store from '../../redux/store'

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
    if (resp.data.response.state === -6)

    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
});

 
