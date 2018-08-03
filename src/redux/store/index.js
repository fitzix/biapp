import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from '../reducers'

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

export default function initStore(initState) {
    const store = createStoreWithMiddleware(reducer, initState)
    return store
}