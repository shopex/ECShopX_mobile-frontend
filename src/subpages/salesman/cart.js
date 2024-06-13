import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpPage, SpGoodsInvalidItems, SpGoodsItems } from '@/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompTabbar from './comps/comp-tabbar'

import './cart.scss'

const initialConfigState = {
  allChecked: true
}

const Cart = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { allChecked } = state

  //全选
  const onSelectAll = (val, value) => {
    console.log(val, value, 'onSelectAll')
  }

  //单选
  const onSingleChoice = (value) => {
    console.log(value, '单选')
  }

  // 商品数量变化
  const onChangeInputNumber = (ele, value) => {
    console.log(ele, value, '商品数量变化1')
  }

  //结算
  const balance = () => {
    console.log('结算')
  }

  // 清除无效商品（失效）
  const handleClearInvalidGoods = (val) => {
    console.log(val, '清除无效商品（失效）')
  }

  // 删除商品（失效和可下单）
  const deletesItem = (val) => {
    console.log(val, '删除商品（失效和可下单）')
    Taro.showLoading({
      title: '加载中',
      icon: 'none'
    })
    Taro.hideLoading()
    S.toast('删除成功')
  }

  return (
    <SpPage classNames='page-cart' renderFooter={<CompTabbar />}>
      <SpGoodsItems
        deletes={deletesItem}
        onSelectAll={onSelectAll}
        onSingleChoice={onSingleChoice}
        onChangeInputNumber={onChangeInputNumber}
        balance={balance}
      />
      <SpGoodsInvalidItems empty={handleClearInvalidGoods} deletes={deletesItem} />
    </SpPage>
  )
}

export default Cart
