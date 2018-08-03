import TYPES from '../types/login'
import login from '../reducers/login'

// 模拟用户信息
let user = {
    name: 'fitz',
    nikeName: '羿璟',
    age: 30,
    pwd: '123456',
    mobile: 13510005217
}


export function login(account, passwd) {
    return dispatch => {
        dispatch(isLogining)

        if (account === user.mobile && passwd === user.pwd) {
            dispatch(loginSuccess(true, user))
        }
    }
}

function isLogining() {
    return {
        types: TYPES.LOGIN_DOING
    }
}

function loginSuccess(succeed, user) {
    console.log(user)

    return {
        type: TYPES.LOGIN_DONE,
        user: user
    }
}