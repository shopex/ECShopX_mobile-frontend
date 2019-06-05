import Taro from '@tarojs/taro'
import req from './req'

export function info (data) {
  return req.post('/wx.info', data)
}

export function code (code) {
  return req.get('/wx.code', { code })
}

export function userInfo () {
  return req.get('/wx.user.info')
}

export function login (data) {
  return Taro.request({
    url: 'https://bbc54.shopex123.com/index.php/api/wxapp/login',
    method: 'post',
    data
  }).then(res => {
    return res.data
  })
}

export function decryptPhoneInfo (params) {
  const config = {
    header: {
      'Accept': 'application/vnd.espier.v2+json'
    }
  }
  return req.get(`https://bbc54.shopex123.com/index.php/api/wxapp/member/decryptPhoneInfo`, params, config)
}