import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker ,Button} from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames, showToast, VERSION_IN_PURCHASE } from '@/utils'
import './select-company-phone.scss'
import CompBottomTip from './comps/comp-bottomTip'


function SelectComponent(props) {
  const { userInfo = {} } = useSelector((state) => state.user)
  const { colorPrimary, pointName, openStore } = useSelector((state) => state.sys)
  const $instance = getCurrentInstance()

  const handleBindPhone = async (e) => {
    const { encryptedData, iv, code } = e.detail
    if (encryptedData && iv) {
      console.log(e.detail)
      const { code } = await Taro.login()
      const { phoneNumber } = await api.wx.decryptPhone({
        encryptedData,
        iv,
        code
      })
      validatePhone(phoneNumber)
    }
  }

  const validatePhone = async (mobile) => {
    const { enterprise_id } = $instance.router.params
    const params = {
      enterprise_id,
      mobile
    }
    try {
      await api.purchase.setEmployeeAuth(params)
      showToast('验证成功')
      setTimeout(() => {
        Taro.navigateTo({ url: `/subpages/purchase/select-company-activity` })
      }, 2000)
    } catch (e) {
      Taro.showModal({
        title: VERSION_IN_PURCHASE ? '登录失败' : '验证失败',
        content: `手机号码错误，请更换手机号`,
        confirmColor:'#F4811F',
        showCancel: VERSION_IN_PURCHASE,
        confirmText: VERSION_IN_PURCHASE ? '重新授权' : '我知道了',
        cancelText: '取消',
        cancelColor: '#aaa',
        success: () => {
          Taro.navigateTo({ url: `/subpages/purchase/select-company-activity` })
        }
      })
    }
  }

  console.log(VERSION_IN_PURCHASE)

  return (
    <View className='select-component'>
      <View className='select-component-title'>商派软件有限公司</View>
      <View className='select-component-prompt'>使用手机号进行验证</View>
      {!VERSION_IN_PURCHASE &&
        <>
          <View className='phone-box'>
            <Text>已授权手机号：</Text>
            <Text className='phone-number'>{userInfo.mobile}</Text>
          </View>
          <AtButton circle className='btns-phone' onClick={() => validatePhone(userInfo.mobile)}>
            使用该号码验证
          </AtButton>
          <AtButton circle className='btns-other' openType='getPhoneNumber' onGetPhoneNumber={handleBindPhone} >
            其他手机号码验证
          </AtButton>
        </>
      }
      {VERSION_IN_PURCHASE &&
        <AtButton circle className='btns-phone' openType='getPhoneNumber' onGetPhoneNumber={handleBindPhone} customStyle={{ marginTop: '50%' }}>
          微信授权登录
        </AtButton>
      }
      <CompBottomTip />
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent

// 有商场和无商场 手机号授权登录