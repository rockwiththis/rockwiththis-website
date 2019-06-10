import thunk from 'redux-thunk'
import appReducer from '../reducers/index'
import { createStore, applyMiddleware, compose } from 'redux'
import reduxLogger from 'redux-logger'

export default function configureStore() {
  return createStore(
    appReducer,
    undefined,
    applyMiddleware(thunk, reduxLogger)
  )
}
