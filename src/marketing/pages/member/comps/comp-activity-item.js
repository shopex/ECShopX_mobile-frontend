import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import './comp-activity-item.scss'

function CompActivityItem(props) {
  const { info, onClick = () => {} } = props
  if (!info) {
    return null
  }

  const handleClickItem = ({ key, action }) => {}

  const handleItemClick = () => {}

  return (
    <View className='activity-item' onClick={handleItemClick}>
      <SpImage className='activity-item__pic' src={'https://daogou-public.oss-cn-hangzhou.aliyuncs.com/image/34/2025/03/13/f536910d6498564e5144051660ee6eea1741856853432.711431e7e521683e7644fe0ba2e35feaN92KyheKw4mxEC6ziwkwUu7kv5q4IZ1R.png'} />
      <View className='activity-item__status'>已结束</View>
      <View className='activity-item__content'>
        <View className='flex-between-center'>
          <View className='activity-item__content-title'>达仁堂股东大会</View>
          <View className='activity-item__content-status'>已拒绝</View>
        </View>
        <View className='flex-between-center'>
          <View className='activity-item__content-time'>2025-02-28 周四：10:00：00</View>
          <View className='activity-item__content-address'>浙江杭州</View>
        </View>
        <View className='activity-item__content-reject'>
          拒绝原因：<Text className='activity-item__content-reject-reson'>xawudgwahgdjhghajdghawjdhjawhd大家哈我喝点酒啊我</Text>
        </View>
        <View className='activity-item__content-btn'>
          重新填写
        </View>
      </View>
    </View>
  )
}

CompActivityItem.options = {
  addGlobalClass: true
}

export default CompActivityItem
