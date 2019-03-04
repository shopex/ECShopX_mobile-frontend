import req from './req'

export function detail (id) {
  return req.get(`http://pjj.aixue7.com/index.php/api/wxapp/article/management/${id}`)
}

export default {}
