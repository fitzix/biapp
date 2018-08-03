import * as types from '../types/login'

export default function login(state, action) {
    switch (action.type) {
        case types.LOGIN_IN_DOING:
            return  {
                ...state,
                status: '正在登陆',
                isSuccess: false,
                user: null
            }
        case types.LOGIN_IN_DONE:
            return {
                ...state,
                status: '登陆成功',
                isSuccess: true,
                user: null
            }
        case types.LOGIN_IN_ERROR:
            return {
                ...state,
                status: '登录出错',
                isSuccess: true,
                user: null
            }
        default:
            return state
    }
}