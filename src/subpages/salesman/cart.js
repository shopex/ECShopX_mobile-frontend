import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage } from '@/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompTabbar from './comps/comp-tabbar'

import './card.scss'

const initialConfigState = {}

const Index = () => {
  const [state, setState] = useImmer(initialConfigState)
  const {} = state

  return (
    <SpPage className={classNames('page-sales-index')} renderFooter={<CompTabbar />}>
      购物车
    </SpPage>
  )
}

export default Index
