import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker, Button } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-company-activity.scss'
import CompBottomTip from './comps/comp-bottomTip'
import { SpPage, SpTabbar } from '@/components'
import CompTabbar from './comps/comp-tabbar'
import actEnd from '@/assets/imgs/act_end.jpg'

function SelectComponent(props) {
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    account: '用户账号',
    role: '员工',
    company: '商派软件有限公司'
  })
  const [activity, setActivity] = useState({
    pending: [
      { title: '活动标题1' },
      { title: '活动标题2' },
      { title: '活动标题打打交道吧杰进步1级背sdadadadada景百1', isHot: true },
      { title: '活动标题4', isHot: true },
      { title: '活动标题1' },
      { title: '活动标题2' },
      { title: '活动标题打打交道吧杰进步1级背sdadadadada景百1', isHot: true },
      { title: '活动标题4', isHot: true },
    ],
    end: [{ title: '结束活动标题1' }, { title: '结束活动标题2' },{ title: '结束活动标题3' }, { title: '结束活动标题4' }]
  })
  const { colorPrimary, pointName, openStore } = useSelector((state) => state.sys)

  const handleToggleRole = ()=>{
    Taro.navigateTo({
      url:'/subpages/purchase/select-identity'
    })
  }

  return (
    <>
      <View className='user-box'>
        <View>
          <Image
            className='user-avatar'
            src={userInfo?.avatar || `${process.env.APP_IMAGE_CDN}/user_icon.png`}
          />
        </View>
        <View className='user-content'>
          <View className='user-content-account'>{userInfo?.account}</View>
          <View className='user-content-info'>
            <View className='user-content-role'>{userInfo?.role}</View>
            <View className='user-content-company'>{userInfo?.company}</View>
          </View>
        </View>
        <View className='user-more' onClick={handleToggleRole}>
          <Text className='iconfont icon-qianwang-01 more'></Text>
        </View>
      </View>
      <SpPage className='select-component' renderFooter={<CompTabbar />}>
        <View>
          <View className='activity-title'>进行中活动</View>
          {activity?.pending.map((item,index) => {
            return (
              <View
                key={item.title}
                className={classNames(
                  'activity-item',
                  `act${(index%4)+1}`
                )}
              >
                <View className='activity-item-title'>{item.title}</View>
                {item.isHot && <View className='hot'>预热中</View>}
              </View>
            )
          })}
        </View>
        <View>
          <View className='activity-title'>已结束活动</View>
          {activity?.end.map((item) => {
            return (
              <View key={item.title} className='activity-item end'>
                <View className='activity-item-title'>{item.title}</View>
              </View>
            )
          })}
        </View>
      </SpPage>
    </>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent

// 内购活动列表