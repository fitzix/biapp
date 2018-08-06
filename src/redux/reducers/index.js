import { combineReducers } from 'redux'
import loginReducer from './login'

const reducer = combineReducers({
    auth: loginReducer
})

export default reducer