import req from './req'

export function getCommunityList(params) {
  return req.get('/community/orders', params)
}

export function getActivityLits(params) {
  // 获取团长活动列表
  return req.get('/community/chief/activity', params)
}

export function confirmDelivery(activity_id) {
  return req.post(`/community/chief/confirm_delivery/${activity_id}`)
}

export function checkChief() {
  // 检查用户是否是团长
  return req.post('/community/checkChief')
}
