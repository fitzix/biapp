import { post } from '../utils/http/fetch'

export function apiLogin(uname, pwd) {
    return post('UserLoginHandler', {username: uname, password: pwd})
}