import React, { useEffect, useState, useCallback } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import {
  SpPage,
  SpSearch,
  SpPrivacyModal,
  SpTabbar,
} from '@/components'
import api from '@/api'
import {
  isWeixin,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  classNames
} from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateLocation } from '@/store/slices/user'
import { updateShopInfo } from '@/store/slices/shop'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { WgtHomeHeader } from '@/pages/home/wgts'

import '@/pages/home/index.scss'

const MSpPrivacyModal = React.memo(SpPrivacyModal)

const initialState = {
  wgts: [],
  loading: true
}

function Home() {
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])
  const { initState, openRecommend, openLocation, openStore, appName } = useSelector(
    (state) => state.sys
  )
  const { isLogin, login, checkPolicyChange } = useLogin({
    policyUpdateHook: (isUpdate) => {
      if (isUpdate) {
        setPolicyModal(true)
      } else {
      }
    }
  })

  const [policyModal, setPolicyModal] = useState(false)
  const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { openScanQrcode } = useSelector((state) => state.sys)
  const { setNavigationBarTitle } = useNavigation()

  const { wgts, loading } = state

  const dispatch = useDispatch()

  useEffect(() => {
    if (initState) {
      init()
      setNavigationBarTitle(appName)
    }
  }, [initState])

  useDidShow(() => {
    // 检查隐私协议是否变更或同意
    checkPolicyChange()
  })

  const init = async () => {
    // if (!VERSION_STANDARD) {
    await fetchWgts()
    // }
  }

  const fetchWgts = async () => {
    const { config } = await api.shop.getShopTemplate({
      distributor_id: getDistributorId()
    })
    setState((draft) => {
      draft.wgts = config
      draft.loading = false
    })
  }

  const handleConfirmModal = useCallback(async () => {
    setPolicyModal(false)
  }, [])

  const fetchStoreInfo = async (location) => {
    let params = {
      distributor_id: getDistributorId() // 如果店铺id和经纬度都传会根据哪个去定位传参
    }
    if (openLocation == 1 && location) {
      const { lat, lng } = location
      params.lat = lat 
      params.lng = lng
      // params.distributor_id = undefined
    }
    const res = await api.shop.getShop(params)
    console.log('fetchStoreInfo:', res)
    dispatch(updateShopInfo(res))
    await fetchWgts()
  }

  const searchComp = wgts.find((wgt) => wgt.name == 'search')
  const pageData = wgts.find((wgt) => wgt.name == 'page')
  let filterWgts = []
  if (searchComp && searchComp.config.fixTop) {
    filterWgts = wgts.filter((wgt) => wgt.name !== 'search' && wgt.name != 'page')
  } else {
    filterWgts = wgts.filter((wgt) => wgt.name != 'page')
  }

  const fixedTop = searchComp && searchComp.config.fixTop

  const isShowHomeHeader =
    VERSION_PLATFORM ||
    (openScanQrcode == 1 && isWeixin) ||
    (VERSION_STANDARD && openStore && openLocation == 1) ||
    fixedTop

  console.log('pageData:', pageData)

  return (
    <SpPage
      className='page-index'
      scrollToTopBtn
      // renderNavigation={renderNavigation()}
      pageConfig={pageData?.base}
      renderFooter={<SpTabbar />}
      loading={loading}
    >
      <View
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
      >
        {isShowHomeHeader && <WgtHomeHeader>{fixedTop && <SpSearch />}</WgtHomeHeader>}
        <HomeWgts wgts={filterWgts} />
      </View>

      {/* 隐私政策 */}
      <MSpPrivacyModal
        open={policyModal}
        onCancel={() => {
          setPolicyModal(false)
        }}
        onConfirm={handleConfirmModal}
      />

    </SpPage>
  )
}

export default Home