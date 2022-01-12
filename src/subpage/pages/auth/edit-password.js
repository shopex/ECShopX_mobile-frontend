import React, { useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { SpPage, SpTimer } from '@/components'
import { classNames, validate, showToast } from '@/utils'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import api from '@/api'
import { useImmer } from 'use-immer'
import './edit-password.scss'

const SYMBOL = 'login'

const initialValue = {
  username: '',
  check_type: SYMBOL,
  yzm: '',
  vcode: '',
  imgInfo: null
}

const PageEditPassword = () => {
  const $instance = getCurrentInstance()

  const {
    params: { unionid }
  } = $instance.router

  const [state, setState] = useImmer(initialValue)

  const { username, yzm, vcode, check_type, imgInfo } = state

  const handleInputChange = (name) => (val) => {
    setState((state) => {
      state[name] = val
    })
  }

  const getImageVcode = async () => {
    const img_res = await api.user.regImg({ type: SYMBOL })
    setState((state) => {
      state.imgInfo = img_res
    })
  }

  const handleTimerStart = async (resolve) => {
    if (!validate.isMobileNum(username)) {
      showToast('请输入正确的手机号')
      return
    }
    if (!validate.isRequired(yzm)) {
      showToast('请输入图形验证码')
      return
    }
    try {
      await api.user.regSmsCode({
        type: SYMBOL,
        mobile: username,
        yzm: yzm,
        token: imgInfo.imageToken
      })
      showToast('验证码已发送')
      resolve()
    } catch (e) {
      getImageVcode()
    }
  }

  const handleSubmit = async () => {
    let url = ''

    await api.user.bind({ username, check_type, vcode, union_id: unionid })

    const { is_new } = await api.wx.getIsNew({ mobile: username })

    //如果是新用户
    if (is_new === 1) {
    } else {
      url = process.env.APP_HOME_PAGE
      Taro.redirectTo({
        url
      })
    }
  }

  useEffect(() => {
    getImageVcode()
  }, [])

  //全填写完
  const isFull = username && yzm && vcode

  return (
    <SpPage
      className={classNames('page-auth-edit-password', {
        'is-full': isFull
      })}
    >
      <View className='auth-hd'>
        <View className='title'>设置密码</View>
        <View className='desc'>请设置密码完成注册</View>
      </View>
      <View className='auth-bd'>
        <AtForm className='form'>
          <View className='form-field'>
            <AtInput
              clear
              name='mobile'
              maxLength={11}
              type='tel'
              value={username}
              placeholder='请输入密码'
              onChange={handleInputChange('username')}
            />
          </View>
          <View className='form-field'>
            <AtInput
              clear
              name='mobile'
              maxLength={11}
              type='tel'
              value={username}
              placeholder='再次输入密码'
              onChange={handleInputChange('username')}
            />
          </View>
          <View className='form-tip'>6-16位密码、数字或字母</View>

          <View className='form-submit'>
            <AtButton
              disabled={!isFull}
              circle
              type='primary'
              className='login-button'
              onClick={handleSubmit}
            >
              完成
            </AtButton>
          </View>
        </AtForm>
      </View>
    </SpPage>
  )
}

export default PageEditPassword
