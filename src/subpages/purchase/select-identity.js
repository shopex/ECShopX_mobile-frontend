import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker, Button } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-identity.scss'
import CompBottomTip from './comps/comp-bottomTip'
import { SpPage, SpTabbar } from '@/components'
import CompTabbar from './comps/comp-tabbar'
import actEnd from '@/assets/imgs/act_end.jpg'

const initialState = {
  identity: [
    {
      avatar: `${process.env.APP_IMAGE_CDN}/user_icon.png`,
      company: '商派软件有限公司',
      role: '员工',
      account: '18888888888'
    },
    {
      avatar: `${process.env.APP_IMAGE_CDN}/user_icon.png`,
      company: '商派软件有限公司',
      role: '亲友',
      account: 'youxiang@youxiang.com',
      isUse: true
    },
    {
      avatar: '',
      company: '公司名称公司名称公司名称公司名称',
      role: '亲友',
      account: '用户账号'
    }
  ],
  invalidIdentity: [
    {
      avatar: `${process.env.APP_IMAGE_CDN}/user_icon.png`,
      company: '商派软件有限公司',
      role: '员工',
      account: '18888888888'
    }
  ]
}

function SelectIdentity(props) {
  const [state, setState] = useImmer(initialState)
  const { colorPrimary, pointName, openStore } = useSelector((state) => state.sys)

  const handletoggleIdentity = (item) => {
    console.log('item',item)
  }

  return (
    <View className='select-identity'>
      <View className='head'>
        <View className='head-title'>轻触头像以切换身份</View>
        <View className='head-line'></View>
      </View>
      <View className='content'>
        <View className='identity'>
          {state.identity.map((item, index) => {
            return (
              <View key={index} className='identity-item' onClick={()=>handletoggleIdentity(item)}>
                <View className='identity-item-avatar'>
                  <Image src={item?.avatar} className='avatar' />
                </View>
                <View className='identity-item-content'>
                  <View className='content-top'>
                    <View className='company'>{item.company}</View>
                    {item.isUse && <View className='nowuse'>当前使用</View>}
                  </View>
                  <View className='content-bottom'>
                    <View className={classNames('role', item.role !== '员工' ? 'friend' : '')}>
                      {item.role}
                    </View>
                    <View className='account'>{item.account}</View>
                  </View>
                </View>
              </View>
            )
          })}
          <View className='identity-item'>
                <View className='identity-item-avatar'>
                  <Text className='iconfont icon-tianjia1 add-icon avatar'></Text>
                </View>
                <View className='add-identity'>添加身份</View>
          </View>
        </View>
        <View className='invalid-identity'>
          <View className='title'>已失效身份</View>
          {state.invalidIdentity?.map((item, index) => {
            return (
              <View key={index} className='identity-item'>
                <View className='identity-item-avatar'>
                  <Image src={item?.avatar} className='avatar' />
                </View>
                <View className='identity-item-content'>
                  <View className='content-top'>
                    <View className='company'>{item.company}</View>
                  </View>
                  <View className='content-bottom'>
                    <View className={classNames('role', item.role !== '员工' ? 'friend' : '')}>
                      {item.role}
                    </View>
                    <View className='account'>{item.account}</View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

SelectIdentity.options = {
  addGlobalClass: true
}

export default SelectIdentity
