import React, { useEffect, useState, useCallback } from 'react'
import Taro, { useShareAppMessage, useShareTimeline, useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpScreenAd, SpPage, SpSearch, SpRecommend, SpPrivacyModal, SpTabbar } from '@/components'
import api from '@/api'
import { isWeixin } from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateLocation } from '@/store/slices/user'
import { useImmer } from 'use-immer'
import { useQwLogin } from '@/hooks'
// import HomeWgts from './home/comps/home-wgts'
import { BaHomeWgts, BaStoreList, BaStore, BaGoodsBuyPanel, BaTabBar, BaNavBar } from './components'
// import { WgtHomeHeader } from '@/pages/home/wgts'

// import './home/index.scss'

const initState = {
  wgts: [],
  shareInfo: {},
  showBackToTop: false
}

function Home() {
  const [state, setState] = useImmer(initState)
  const [likeList, setLikeList] = useImmer([])
  const { isLogin, login } = useQwLogin({
    autoLogin: true
  })

  const sys = useSelector((state) => state.sys)
  const showAdv = useSelector((member) => member.user.showAdv)

  const { openRecommend } = sys
  const { wgts, shareInfo } = state

  const dispatch = useDispatch()

  useEffect(() => {
    if (isLogin) {
      fetchWgts()
      fetchLikeList()
      fetchShareInfo()
    }
  }, [isLogin])

  const fetchWgts = async () => {
    const { config } = await api.shop.getShopTemplate({
      distributor_id: 0 // 平台版固定值
    })
    setState((v) => {
      v.wgts = config
    })
    // 检查隐私协议是否变更或同意
    const checkRes = await checkPolicyChange()
    if (checkRes) {
      fetchLocation()
    }
  }

  const fetchLikeList = async () => {
    if (openRecommend == 1) {
      const query = {
        page: 1,
        pageSize: 1000
      }
      const { list } = await api.cart.likeList(query)
      setLikeList(list)
    }
  }

  const fetchShareInfo = async () => {
    const res = await api.wx.shareSetting({ shareindex: 'index' })
    setState((draft) => {
      draft.shareInfo = res
    })
  }

  // 定位
  const fetchLocation = async () => {
    const res = await entryLaunch.getCurrentAddressInfo()
    dispatch(updateLocation(res))
  }

  useShareAppMessage(async (res) => {
    return {
      title: shareInfo.title,
      imageUrl: shareInfo.imageUrl,
      path: '/pages/index'
    }
  })

  useShareTimeline(async (res) => {
    return {
      title: shareInfo.title,
      imageUrl: shareInfo.imageUrl,
      query: '/pages/index'
    }
  })
  const searchComp = wgts.find((wgt) => wgt.name == 'search')
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search')
  } else {
    filterWgts = wgts
  }
  return (
    <SpPage className='page-index' scrollToTopBtn>
      <BaNavBar title='导购商城' fixed icon='in-icon in-icon-backhome' />

      {guideInfo && (
        <BaStore onClick={this.handleOpenStore} guideInfo={guideInfo} defaultStore={storeInfo} />
      )}

      {/* <View className='home-body'>
        <HomeWgts wgts={filterWgts} />
      </View> */}

      <BaTabBar />
    </SpPage>
  )
}

export default Home
