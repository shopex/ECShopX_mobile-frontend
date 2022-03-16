import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { SpPage, SpScrollView, CouponItem } from '@/components'
import api from '@/api'
import {
  BaHomeWgts,
  BaStoreList,
  BaStore,
  BaGoodsBuyPanel,
  BaTabBar,
  BaNavBar,
  BaCoupon
} from '@/subpages/guide/components'
import './index.scss'

const initialState = {
  list: []
}
function GuideCouponIndex(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { list } = state
  const { userInfo } = useSelector((state) => state.guide)

  // useEffect(() => {
  //   fetch()
  // }, [])

  useDidShow(() => {
    Taro.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  })

  const fetch = async () => {
    const { card_id = '', item_id = '' } = $instance.router.params
    const { distributor_id } = userInfo
    const params = {
      end_date: 1,
      distributor_id,
      card_id,
      item_id
    }
    const { list, total_count } = await api.member.homeCouponList(params)

    setState((draft) => {
      draft.list = list
    })
    return { total: total_count }
  }
  console.log('list:', list)
  return (
    <SpPage className='page-guide-coupon'>
      <BaNavBar home title='优惠券' />
      <SpScrollView fetch={fetch}>
        {list.map((item) => (
          // <CouponItem info={item} />
          <BaCoupon />
        ))}
      </SpScrollView>
    </SpPage>
  )
}

GuideCouponIndex.options = {
  addGlobalClass: true
}

export default GuideCouponIndex
