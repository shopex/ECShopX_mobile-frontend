import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducers from './reducers'

const middlewares = [
  thunkMiddleware,
  createLogger()
]

let store

export default function configStore () {
  if (!store) {
    store = createStore(reducers, applyMiddleware(...middlewares))
  }
  return store
}


