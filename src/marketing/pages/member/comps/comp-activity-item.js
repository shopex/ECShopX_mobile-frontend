import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage, SpPrice, SpTradeItem } from '@/components'
import './comp-activity-item.scss'

function CompActivityItem(props) {
  const { info, onClick = () => {}, onBtnAction = () => {} } = props
  if (!info) {
    return null
  }

  const handleClickItem = ({ key, action }) => {}

  const statusMap = {
    'pending': '待审核',
    'passed': '已通过',
    'rejected': '已拒绝',
    'verified': '已核销',
    'canceled': '已取消'
  }

  const handleBtnClick = (e, item, type) => {
    e.stopPropagation()
    onBtnAction(item, type)
  }

  console.log('info', info)
  const { activityName, startDate, status, reason,area, statusName, pics, activityId } = info
  return (
    <View className='activity-item' onClick={() => onClick(info)}>
      <SpImage className='activity-item__pic' src={pics} />
      <View className='activity-item__status'>{statusName}</View>
      <View className='activity-item__content'>
        <View className='flex-between-center'>
          <View className='activity-item__content-title'>{activityName}</View>
          <View className='activity-item__content-status'>{statusMap[status]}</View>
        </View>
        <View className='flex-between-center'>
          <View className='activity-item__content-time'>{startDate}</View>
          <View className='activity-item__content-address'>{area}</View>
        </View>
        {reason && (
          <View className='activity-item__content-reject'>
            拒绝原因：
            <Text className='activity-item__content-reject-reson'>{reason}</Text>
          </View>
        )}
        <View className='activity-item__content-btns'>
          {status == 'rejected' && <View
            className='activity-item__content-btn'
            onClick={(e) => handleBtnClick(e, info, 'reFill')}
          >
            重新填写
          </View>}
          <View
            className='activity-item__content-btn'
            onClick={(e) => handleBtnClick(e, info, 'sign')}
          >
            立即报名
          </View>
        </View>
      </View>
    </View>
  )
}

CompActivityItem.options = {
  addGlobalClass: true
}

export default CompActivityItem
