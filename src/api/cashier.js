import req from './req'

export function detail () {
  return req.get('http://pjj.aixue7.com/index.php/api/wxapp/payment/config')
}

export default {}
