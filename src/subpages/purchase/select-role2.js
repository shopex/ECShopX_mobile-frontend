import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-role2.scss'
import userIcon from '@/assets/imgs/user-icon.png'

const initialState = {}

function SelectRole(props) {
  useEffect(() => {}, [])

  return (
    <View className='select-role'>
      <View className='header'>
        <Image className='header-avatar' src={userIcon} mode='aspectFill' />
        <Text className='welcome'>欢迎登陆</Text>
        <Text className='title'>上海商派员工亲友购</Text>
      </View>
      <View className='select'>
        <View className='select-title'>我是</View>
        <View className='select-options'>
          <View className='select-friend'>
            <View className='select-pic'></View>
            <View className='select-content'>亲友</View>
          </View>
          <View className='select-friend'>
            <View className='select-pic'></View>
            <View className='select-content'>员工</View>
          </View>
        </View>
        <View className='btn-confirm'>
          <button className='confirm'>确定</button>
        </View>

      </View>
      <View className='end-text'>* 本功能仅供企业内部人员使用，不对外开</View>
    </View>
  )
}

SelectRole.options = {
  addGlobalClass: true
}

export default SelectRole
