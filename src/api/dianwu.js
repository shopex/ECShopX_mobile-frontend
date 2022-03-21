import req from './req'

export function is_admin(params) {
    return req.get('/distributor/bind/checkout', params)
}