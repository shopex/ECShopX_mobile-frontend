import req from './req'

export function getShop () {
  return req.get('/distributor/is_valid')
}
