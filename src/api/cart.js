import qs from 'qs'
import req from './req'

export function get (params) {
  // return req.get('/cart.get')
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/cart', {
    shop_type: 'distributor',
    ...params
  })
}

export function getBasic (params) {
  // return req.get('/cart.get.basic')
  return req.get('http://pjj.aixue7.com/index.php/api/h5app/wxapp/cart', {
    shop_type: 'distributor',
    ...params
  })
}

export function add (item, num = 1) {
  // return req.post('/cart.add', { sku_id, quantity })
  const { item_id, shop_id } = item
  const q = qs.stringify({
    item_id,
    shop_id,
    num,
    shop_type: 'distributor',
    activity_type: 'normal'
  })
  return req.get(`http://pjj.aixue7.com/index.php/api/h5app/wxapp/cart?${q}`)
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
