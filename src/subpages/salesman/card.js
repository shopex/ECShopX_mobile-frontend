import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage } from '@/components'
import CompTabbar from './comps/comp-tabbar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import './card.scss'

const initialConfigState = {
  funcList: [
    { name: '订单管理', icon: 'present' },
    { name: '代客下单', icon: 'present' },
    { name: '业务员推广', icon: 'present' },
    { name: '商家列表', icon: 'present' },
  ]
}

const Card = () => {
  const [data, setData] = useImmer(initialConfigState)

  return (
    <SpPage className={classNames('page-card-index')}
      renderFooter={<CompTabbar/>}
      showNavition={false}
    >
      <view className='card-box'>
        <view className='card-content'>
            <view className='name'>杨建梅</view>
            <view className='store'>上海太古汇店</view>
            <view className='qtr-box'>
              <image className='qtr-img' src='https://img0.baidu.com/it/u=3584759695,3470619884&fm=253&fmt=auto&app=138&f=GIF?w=198&h=198'/>
            </view>
        </view>
      </view>
    </SpPage>
  )
}

export default Card
