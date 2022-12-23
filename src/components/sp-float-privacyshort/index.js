import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { connect } from 'react-redux'
import { AtButton, AtFloatLayout } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { isWeixin, isWeb, isAlipay, classNames, showToast, navigateTo } from '@/utils'
// import { Tracker } from '@/service'
import './index.scss'

@connect(
  () => ({}),
  (dispatch) => ({
    setMemberInfo: (memberInfo) => dispatch({ type: 'member/init', payload: memberInfo })
  })
)
export default class SpFloatPrivacyShort extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    isOpened: false,
    wxUserInfo: true,
    callback: () => {},
    onClose: () => {},
    onConfirm: () => {},
    onChange: () => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      info: null
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    const data = await api.shop.getStoreBaseInfo()
    this.setState({
      info: data
    })
  }

  navigateTo = navigateTo

  handleCancel () {
    this.props.onClose()
  }

  handleValidate = (fn) => {
    this.handleCancel()
    if (this.props.wxUserInfo) {
      fn && fn()
    } else {
      this.props.onChange()
    }
    Taro.setStorageSync('Privacy_agress', '1')
  }

  handleConfirm () {
    this.handleValidate(() => {
      S.OAuthWxUserProfile(() => {
        this.props.onChange()
      }, true)
    })
  }

  handleConfirmAlipay = (e) => {
    this.handleValidate(() => {
      if (!S.getAuthToken()) {
        showToast('请先登录')
        return
      }
      my.getOpenUserInfo({
        fail: (res) => {},
        success: async (res) => {
          let userInfo = JSON.parse(res.response).response
          await api.member.updateMemberInfo({
            username: userInfo.nickName,
            avatar: userInfo.avatar
          })
          await S.getMemberInfo()
          this.props.onChange()
        }
      })
    })
  }

  render () {
    const { isOpened } = this.props
    const { info } = this.state
    console.log('====',info)
    if (!info) {
      return null
    }
    return (
      <View
        className={classNames(
          'sp-float-privacy',
          {
            'sp-float-privacy__active': isOpened
          },
          this.props.className
        )}
      >
        <View className='sp-float-privacy__overlay'></View>
        <View className='sp-float-privacy__wrap'>
          <View className='privacy-hd'>个人隐私保护指引</View>

          {(isWeixin || isWeb) && (
            <View className='privacy-bd'>
              为了更好的保障你的个人信息安全及权利行使，并允许我们在必要场景下，合理使用你的个人信息，并充分保障你的合法权，请仔细阅读并理解
              <Text
                className='privacy-txt'
                onClick={this.navigateTo.bind(this, '/subpages/auth/reg-rule?type=member_register')}
              >
                《{info.protocol.privacy}》
              </Text>
              和
              <Text
                className='privacy-txt'
                onClick={this.navigateTo.bind(this, '/subpages/auth/reg-rule?type=privacy')}
              >
                {/* 《{info.protocol.privacy}》 */}
                《用户协议》
              </Text>
              的内容。
            </View>
          )}

          {/* {isAlipay && (
            <View className='privacy-bd'>
              您可以在“设置”中查看、变更、删除个人授权信息。
              如您同意，请点击“同意”开始接受我们的服务。
            </View>
          )} */}

          <View className='privacy-ft'>
            <View className='btn-wrap'>
              <AtButton onClick={this.handleCancel.bind(this)} className='close'>取消</AtButton>
            </View>
            <View className='btn-wrap'>
              {isWeixin && (
                <AtButton className='allow'  onClick={this.handleConfirm.bind(this)}>
                  允许
                </AtButton>
              )}
              {isAlipay && (
                <Button
                  className='ali-button'
                  openType='getAuthorize'
                  scope='userInfo'
                  onGetAuthorize={this.handleConfirmAlipay}
                >
                  允许
                </Button>
              )}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
