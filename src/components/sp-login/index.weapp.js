import Taro from '@tarojs/taro'
import { useState, useCallback } from 'react'
import { View, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import S from '@/spx'
import api from '@/api'
import { isWeixin, isAlipay, classNames, tokenParse } from '@/utils'
import { SG_SHARER_UID, SG_TRACK_PARAMS } from '@/consts'
import { Tracker } from '@/service'
import { SpPrivacyModal } from '@/components'
import { useLogin } from '@/hooks'
import './index.scss'

function SpLogin( props ) {
  const { children, className } = props
  const { isLogin, login, updatePolicyTime, setToken } = useLogin({
    policyUpdateHook: () => {
      setPolicyModal(true)
    }
  })
  const [isNewUser, setIsNewUser ] = useState(false)
  const [policyModal, setPolicyModal] = useState( false )

  const handleClickLogin = async () => {
    try {
      await login()
    } catch ( e ) {
      setIsNewUser(true)
    }
  }

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, cloudID } = e.detail
    if (encryptedData && iv) {
      const { code } = await Taro.login()
      const params = {
        code,
        encryptedData,
        iv,
        cloudID,
        user_type: 'wechat',
        auth_type: 'wxapp'
      }

      const { token, is_new } = await api.wx.newlogin(params)
      if (token) {
        setToken(token)
      }
    }
  }

  const handleOnChange = () => { }

   const handleCloseModal = useCallback(() => {
     setPolicyModal(false)
   }, [])

   const handleConfirmModal = useCallback(() => {
     setPolicyModal(false)
     updatePolicyTime()
     // 自动登录
     login()
   }, [])
  
  return (
    <View className={classNames('sp-login', className)}>
      {isLogin && <View onClick={handleOnChange}>{children}</View>}

      {!isLogin && isNewUser && (
        <Button
          className='login-btn'
          openType='getPhoneNumber'
          onGetPhoneNumber={handleBindPhone}
        >
          {children}
        </Button>
      )}

      {!isLogin && !isNewUser && <View onClick={handleClickLogin}>{children}</View>}

      <SpPrivacyModal
        open={policyModal}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmModal}
      />                                                        
    </View>
  )
}

SpLogin.options = {
  addGlobalClass: true
}

export default SpLogin
