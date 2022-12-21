import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker, Button } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './neigou-order.scss'
import CompBottomTip from './comps/comp-bottomTip'
import { SpPage, SpTabbar } from '@/components'
import CompTabbar from './comps/comp-tabbar'
import actEnd from '@/assets/imgs/act_end.jpg'

const tabbarState = [{ title: '全部' }, { title: '待支付' }, { title: '待收货' }]

function SelectComponent(props) {
  const [activeIndex, setActiveIndex] = useState(0)

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
      { title: '活动标题4', isHot: true }
    ],
    end: [
      { title: '结束活动标题1' },
      { title: '结束活动标题2' },
      { title: '结束活动标题3' },
      { title: '结束活动标题4' }
    ]
  })
  const { colorPrimary, pointName, openStore } = useSelector((state) => state.sys)

  const handleTitleClick = (index) => {
    setActiveIndex(index)
  }

  return (
    <>
      <View className='order-tabbar'>
        {tabbarState.map((item, index) => {
          return (
            <View key={index} className={classNames('order-item', { 'active': activeIndex === index })} onClick={()=>handleTitleClick(index)}>
              {item.title}
            </View>
          )
        })}
      </View>
      <SpPage className='select-component' renderFooter={<CompTabbar />}>
        <View></View>
      </SpPage>
    </>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent
