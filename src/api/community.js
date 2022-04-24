import req from './req'
import { transformPlatformUrl } from '@/utils/platform'

export function getCommunityLits(params) {
  return req.get('/community/orders', params)
}
