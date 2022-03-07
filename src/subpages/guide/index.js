import React, { useEffect, useState, useCallback } from 'react'
import Taro, { useShareAppMessage, useShareTimeline, useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpScreenAd, SpPage, SpSearch, SpRecommend, SpPrivacyModal, SpTabbar } from '@/components'
import api from '@/api'
import { isWeixin, platformTemplateName } from '@/utils'
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
  const { useInfo } = useSelector((state) => state.guide)
  const showAdv = useSelector((member) => member.user.showAdv)

  const { openRecommend } = sys
  const { wgts, shareInfo } = state

  const dispatch = useDispatch()

  useEffect(() => {
    if (isLogin) {
      fetchWgts()
      // fetchShareInfo()
    }
  }, [isLogin])

  const fetchWgts = async () => {
    const { config } = await api.guide.getHomeTmps({
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: 'custom_salesperson',
      company_id: 1
    })
    setState((v) => {
      v.wgts = config
    })
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
      {/* <BaNavBar title='导购商城' fixed icon='in-icon in-icon-backhome' /> */}

      {/* {useInfo && (
        <BaStore onClick={this.handleOpenStore} guideInfo={guideInfo} defaultStore={storeInfo} />
      )} */}

      {/* <View className='home-body'>
        <HomeWgts wgts={filterWgts} />
      </View> */}

      <BaTabBar />
    </SpPage>
  )
}

export default Home
