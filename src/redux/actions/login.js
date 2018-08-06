import * as TYPES from '../types'

// 模拟用户信息
let user = {
    name: 'fitz',
    nikeName: '羿璟',
    age: 30,
    pwd: '123456',
    mobile: '13699146887'
}


export function logIn(account, passwd) {
    return dispatch => {
        dispatch({ type: TYPES.LOGGED_DOING })

        if (account === user.mobile && passwd === user.pwd) {
            dispatch(loginSuccess(user))
        }
    }
}


function loginSuccess(user) {
    console.log(user)

    return {
        type: TYPES.LOGGED_IN,
        user: user
    }
}