import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import { SpPrice } from '@/components'
import './commission.scss'

function CommunityCommission(props) {
  return (
    <View className='page-community-commission'>
      <View className='commission-hd'>
        <View className='total-amount'>
          <Text className='label'>活动总额（元）</Text>
          <SpPrice value={100} size={40}/>
        </View>
        <View className='comminssion-price'>
          <Text className='label'>活动佣金（元）</Text>
          <SpPrice value={100} size={40}/>
        </View>
      </View>
      <View className=''>
         <View>可提现金额（元）</View>
         <SpPrice value={100} />
         <AtButton type="primary" ></AtButton>
      </View>
    </View>
  )
}

CommunityCommission.options = {
  addGlobalClass: true
}

export default CommunityCommission
