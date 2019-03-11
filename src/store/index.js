import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist-weapp-storage'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducers from './reducers'

const middlewares = [
  thunkMiddleware,
  createLogger()
]

const reducer = persistReducer({
  key: 'root',
  storage
}, reducers)

let store, persistor

export default function configStore () {
  if (!store) {
    store = createStore(reducer, applyMiddleware(...middlewares))
    persistor = persistStore(store)
  }

  return {
    store,
    persistor
  }
}


