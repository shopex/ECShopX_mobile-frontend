import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

function BaCoupon(props) {
  return <View className='ba-coupon'></View>
}

BaCoupon.options = {
  addGlobalClass: true
}

export default BaCoupon
