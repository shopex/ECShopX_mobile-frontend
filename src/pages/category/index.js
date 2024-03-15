import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro, { useDidShow, getCurrentInstance } from '@tarojs/taro'
import { Text, View, Image, ScrollView } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpScrollView, SpPage, SpTabbar, SpCategorySearch, SpSkuSelect, SpLogin } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { useDebounce } from '@/hooks'
import S from '@/spx'
import { pickBy, classNames, styleNames, showToast, entryLaunch } from '@/utils'
import './index.scss'
import CompsCategoryOld from './comps/comps-category-old'

const initialState = {
  keywords: ''
}

function StoreItemList(props) {
  const [state, setState] = useImmer(initialState)
  // const { purchase_share_info = {} } = useSelector((state) => state.purchase)
  const {
    keywords,
  } = state

  useEffect(() => {
    getCategoryList()
  }, [])

  

  const getCategoryList = async () => {
    const res = await api.category.getCommonSetting()
    //category  老的
    setState((draft) => {
      draft.keywords = res.category_style == 'category'?true:false
    })
  }


  return (
    <View className=''>
      {
        keywords?"":<CompsCategoryOld></CompsCategoryOld>
      }
    </View>
  )
}

export default StoreItemList
