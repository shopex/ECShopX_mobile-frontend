import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { log } from '@/utils'

import './wxauth.scss'

export default class WxAuth extends Component {
  componentDidMount () {
    // this.getUserInfo()
  }

  async getUserInfo () {
    const { authSetting } = await Taro.getSetting()
    
    if (authSetting['scope.userInfo']) {
      userInfo = await Taro.getUserInfo({ lang: 'zh_CN' })
      console.info(userInfo)
    }
  }

  redirect () {
    const redirect = this.$router.params.redirect
    let redirect_url = redirect
      ? decodeURIComponent(redirect)
      : '/pages/home/index'

    Taro.redirectTo({
      url: redirect_url
    })
  }

  handleGetUserInfo = async (res) => {
    const loginParams = res.detail
    const { iv, encryptedData } = loginParams

    if (!iv || !encryptedData) {
      Taro.showModal({
        title: '授权提示',
        content: `${APP_NAME}需要您的授权才能正常运行`,
        showCancel: false,
        confirmText: '知道啦'
      })

      return
    }

    const { code } = await Taro.login()
    const extConfig = wx.getExtConfigSync? wx.getExtConfigSync(): {}
    loginParams.appid = extConfig.appid
    loginParams.code = code

    Taro.showLoading({
      mask: true,
      title: '正在加载...'
    })

    try {
      const userInfo = await api.wx.login(loginParams)
      log.debug(`[authorize] userInfo:`, userInfo)

      const { mobile } = userInfo.memberInfo
      Taro.setStorageSync('user_info', userInfo)
      Taro.setStorageSync('user_mobile', mobile)
      this.redirect()
    } catch (e) {
      console.info(e)
      Taro.showToast({
        title: '授权失败，请稍后再试',
        icon: 'none'
      })
    }

    Taro.hideLoading()
  }

  handleGetPhoneNumber = async (e) => {
    // TODO: handle phone
    const { iv, encryptedData, errMsg } = e.detail
    const { code } = await Taro.login()
    const res = await api.wx.decryptPhoneInfo({
      code,
      iv,
      encryptedData
    })

    console.info(res)
    debugger
  }

  render () {
    const { userInfo } = this.state

    return (
      <View className='page-wxauth'>
        {!userInfo && (
          <View className='sec-auth'>
            <Text className='auth-hint'>需要您的授权才能继续</Text>
            <AtButton
              type='primary'
              openType='getUserInfo'
              onGetUserInfo={this.handleGetUserInfo}
            >点此授权</AtButton>
          </View>
        )}
        {/*<AtButton
          type='primary'
          openType='getPhoneNumber'
          onGetPhoneNumber={this.handleGetPhoneNumber}
        >获取手机号</AtButton>*/}
      </View>
    )
  }
}
