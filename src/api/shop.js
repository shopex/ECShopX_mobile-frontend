import req from './req'

export function getShop (params = {}) {
  return req.get('/distributor/is_valid', params)
}

export function list (params = {}) {
  return req.get('/distributor/list', params)
}

export function getStoreStatus (params = {}) {
  return req.get('/nostores/getstatus', params)
}

// 获取首页配置
export function homeSetting (params = {
  type: 'frontend'
}) {
  return req.get('common/setting', params)
}