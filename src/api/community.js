import req from './req'
import { transformPlatformUrl } from '@/utils/platform'

export function getCommunityLits(params) {
  return req.get('/community/orders', params)
}

export function getActivityLits(params) {
  return req.get('/community/chief/activity', params)
}

export function createActivityZiti(params) {
  return req.post('/community/chief/ziti', params)
}

export function modifyActivityZiti(id, params) {
  return req.post(`/community/chief/ziti/${id}`, params)
}

export function getActivityZiti(id) {
  return req.get(`/community/chief/ziti`)
}

export function getChiefItems(params) {
  return req.get(`/community/chief/items` ,params)
}