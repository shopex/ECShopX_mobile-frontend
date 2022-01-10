import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { SpPrice, SpLogin } from '@/components'
import './comp-couponlist.scss'

function CompCouponList (props) {
  const { info } = props

  const onChangeLogin = () => {
    Taro.navigateTo({
      url: `/subpage/pages/vip/vipgrades?grade_name=${info.vipgrade_name}`
    })
  }

  return (
    <View className='comp-couponlist'>
      <View className='couponlist-hd'>
        <ScrollView className='coupons-block' scrollX>
          {info.list.map((item, index) => (
            <View className='coupon-item' key={`coupon-item__${index}`}>
              {item.title}
            </View>
          ))}
        </ScrollView>
      </View>
      <View className='couponlist-ft'>
        领券<Text className='iconfont icon-qianwang-01'></Text>
      </View>
    </View>
  )
}

CompCouponList.options = {
  addGlobalClass: true
}

export default CompCouponList
