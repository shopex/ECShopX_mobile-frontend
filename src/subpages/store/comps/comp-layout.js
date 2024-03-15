import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { SpImage, SpLogin, SpShopCoupon, SpPrice } from '@/components'
import { pickBy, showToast, classNames } from '@/utils'
import S from '@/spx'
import './comp-layout.scss'
import CompTab from './comp-tab'

const initialState = {
  fav: false
}
function CompLayout(props) {
  const { shopCartCount } = useSelector((state) => state.cart)

  const { settlement = {} } = props
  const [state, setState] = useImmer(initialState)
  const { fav } = state

  return (
    <View className='comp-shop-brand-layout'>
      {/* 全选 */}
      <View>
        <Text
          className={classNames(
            {
              iconfont: true
            },
            fav ? 'icon-roundcheckfill' : 'icon-round'
          )}
        ></Text>
      </View>
      {/* 列表 */}
      <View></View>
      {/* 底部 */}
      <CompTab settlement={settlement} />
    </View>
  )
}

CompLayout.options = {
  addGlobalClass: true
}

export default CompLayout
