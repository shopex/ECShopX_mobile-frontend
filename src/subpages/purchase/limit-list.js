import Taro, {
  useDidShow,
  useShareAppMessage,
  getCurrentPages,
  getCurrentInstance,
  useRouter
} from '@tarojs/taro'
import { useState, useEffect, useCallback, useRef } from 'react'
import { View, ScrollView, Text, Image, Button } from '@tarojs/components'
import { SG_ROUTER_PARAMS, SG_APP_CONFIG, MERCHANT_TOKEN, SG_TOKEN } from '@/consts'
import { updateUserInfo } from '@/store/slices/user'
import { updateIsOpenPurchase } from '@/store/slices/purchase'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'

import {
  SpLogin,
  SpImage,
  SpPrice,
  CouponModal,
  SpPrivacyModal,
  SpTabbar,
  SpNote,
  SpPage
} from '@/components'
import api from '@/api'
import {} from '@/utils'

import './limit-list.scss'

const initialState = {
  list: []
}

function LimitList(props) {
  const [state, setState] = useImmer(initialState)
  const router = useRouter()

  const { list } = state

  useEffect(() => {
    fetch()
  }, [])

  const fetch = () => {
    setState((darft) => {
      darft.list = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7]
    })
  }

  const limitNode = ({}, idx) => {
    return (
      <View key={idx} className='list-item'>
        <View className='list-item__title'>欢迎新春大吉我和道加瓦河的</View>
        <View className='list-item__time'>欢迎新春大吉我和道加瓦河的</View>
        <View className='list-item__content'>
          <View className='list-item__content-item'>
            <View className='list-item__content-item-key'>总额度</View>
            <View className='list-item__content-item-val'>1000.00</View>
          </View>
          <View className='list-item__content-item'>
            <View className='list-item__content-item-key'>已使用额度</View>
            <View className='list-item__content-item-val'>1000.00</View>
          </View>
          <View className='list-item__content-item'>
            <View className='list-item__content-item-key'>剩余额度</View>
            <View className='list-item__content-item-val'>1000.00</View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SpPage className='page-limit-list' scrollToTopBtn>
      {list.length > 0 && <View className='limit-list__hd'></View>}
      {list.length > 0 ? (
        list.map((item, idx) => limitNode(item, idx))
      ) : (
        <SpNote img='empty_activity.png' title='没有查询到数据' />
      )}
    </SpPage>
  )
}

export default LimitList
