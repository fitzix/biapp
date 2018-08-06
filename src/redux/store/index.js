import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from '../reducers'

// const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore)

// export default function initStore(initState) {
//     return createStoreWithMiddleware(reducer, initState)
// }

const store = applyMiddleware(thunkMiddleware)(createStore)(reducer)

export default store