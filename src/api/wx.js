import Taro from '@tarojs/taro'
import req from './req'

const { appid } = wx.getExtConfigSync? wx.getExtConfigSync(): {}

export function info (data) {
  return req.post('/wx.info', data)
}

export function code (code) {
  return req.get('/wx.code', { code })
}

export function userInfo () {
  return req.get('/wx.user.info')
}

export function login (params) {
  return req.post('/login', {
    ...params,
    appid,
    auth_type: 'wxapp'
  }, { showError: false })
}

export function prelogin (params) {
  return req.post('/prelogin', {
    ...params,
    appid,
    auth_type: 'wxapp'
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