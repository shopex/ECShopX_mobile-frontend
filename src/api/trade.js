import req from './req'

export function list (params) {
  return req.get('/trade.list', params)
}

export function detail (tid) {
  return req.get('/trade.get', { tid })
}

export function create (data) {
  return req.post('/trade.create', data)
}

export function confirm (tid) {
  return req.get('/trade.confirm', { tid })
}
