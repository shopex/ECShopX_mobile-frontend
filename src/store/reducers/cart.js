import { createReducer } from 'redux-create-reducer'
import { pickBy } from '@/utils'

const initState = {
  list: [],
  fastbuy: null
}

const cart = createReducer(initState, {
  ['cart/update'](state, action) {
    const { list } = action.payload

    return {
      ...state,
      list
    }
  },

  ['cart/checkout'](state, action) {
    const checkoutItem = action.payload

    return {
      ...state,
      checkoutItem
    }
  },

  ['cart/fastbuy'](state, action) {
    const { item , num = 1 } = action.payload

    return {
      ...state,
      fastbuy: {
        ...item,
        num
      }
    }
  },

  ['cart/clearFastbuy'](state) {
    return {
      ...state,
      fastbuy: null
    }
  }
})

export default cart
