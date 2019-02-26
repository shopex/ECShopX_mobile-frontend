import { createReducer } from 'redux-create-reducer'

const initState = {
  list: []
}

const cart = createReducer(initState, {
  ['cart/update'](state, action) {
    const { list } = action.payload

    return {
      ...state,
      list
    }
  }
})

export default cart
