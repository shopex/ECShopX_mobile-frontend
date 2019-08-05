import req from './req'

export function getShop (params = {}) {
  return req.get('/distributor/is_valid', params)
}

export function list (params = {}) {
  return req.get('/distributor/list', params)
}
