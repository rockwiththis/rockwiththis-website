import thunk from 'redux-thunk'
import appReducer from '../src/reducers/index'
import { createStore, applyMiddleware, compose } from 'redux'
import reduxLogger from 'redux-logger'

const composeEnhancers = compose
//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(initialState) {
  const middleware = [
    thunk,
    reduxLogger
  ].filter(Boolean);
  const store = createStore(
    appReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware)
    )
  )
  store.subscribe(() => {
    // Will be called everytime the state updates
  })
  return store
}
