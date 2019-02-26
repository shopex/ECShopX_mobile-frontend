import req from './req'

export function get () {
  return req.get('/cart.get')
}

export function getBasic () {
  return req.get('/cart.get.basic')
}

export function add ({ sku_id, quantity }) {
  return req.post('/cart.add', { sku_id, quantity })
}

export function update ({ cart_params }) {
  return req.post('/cart.update', { cart_params })
}

export function del ({ cart_id }) {
  return req.post('/cart.del', { cart_id })
}

export function checkout () {
  return req.get('/cart.checkout')
}
