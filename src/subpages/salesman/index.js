import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage } from '@/components'
import CompTabbar from './comps/comp-tabbar'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import './index.scss'

const initialConfigState = {
  funcList: [
    { name: '订单管理', icon: 'present' },
    { name: '代客下单', icon: 'present' },
    { name: '业务员推广', icon: 'present' },
    { name: '商家列表', icon: 'present' },
  ]
}

const Index = () => {
  const [data, setData] = useImmer(initialConfigState)

  return (
    <SpPage className={classNames('page-sales-index')}
    renderFooter={<CompTabbar/>}
    >
      <view className='sales-back'></view>
      <view className='sales-header'>
        <view className='iconfont icon-present sales-header-icon'></view>
        <view className='sales-header-title'>业务员端</view>
      </view>
      <view className='sales-content'>
        <view className='sales-content-panel'>
          <view className='panel-header'>
            <view className='iconfont icon-present panel-header-icon'></view>
            <view className='panel-header-title'>实时概况</view>
          </view>
          <view className='panel-content'>
            <view className='panel-content-top'>
              <view className='panel-content-top-title'>
                <view className='real-monet'>
                  <view className='panel-title  mb-0'>实付金额</view>
                  <view className='iconfont icon-present view-icon'></view>
                </view>

                <view className='look-detail'>查看数据总览&nbsp; &gt;</view>
              </view>
              <view className='panel-num mt-12'>9,999,999.88</view>
            </view>
            <view className='panel-content-btm'>
              <view className='panel-content-btm-item'>
                <view className='panel-title'>支付订单（笔）</view>
                <view className='panel-num'>1,999</view>
              </view>
              <view className='panel-content-btm-item'>
                <view className='panel-title'>退款订单（笔）</view>
                <view className='panel-num'>999</view>
              </view>
              <view className='panel-content-btm-item'>
                <view className='panel-title'>退款（元）</view>
                <view className='panel-title'>1,999,00</view>
              </view>
              <view className='panel-content-btm-item'>
                <view className='panel-title'>实付会员（人）</view>
                <view className='panel-title'>1,999</view>
              </view>
            </view>
          </view>
        </view>

        <view className='sales-content-func'>
          <view className='func-title'>常用功能</view>
          <view className='func-content'>
            {data.funcList.map((item, idx) => (
              <view className='func-content-item'>
                <view
                  className={classNames({
                  'iconfont':true,
                  [`icon-${item.icon}`]: true,
                  'func-item-icon':true
                  })}
                ></view>
                <view className='func-item-name'>{item.name}</view>
              </view>
            ))}
          </view>
        </view>
      </view>
    </SpPage>
  )
}

export default Index
