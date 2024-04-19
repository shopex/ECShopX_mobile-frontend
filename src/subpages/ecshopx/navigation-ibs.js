import React, { useEffect, useRef } from 'react'
import Taro, { useShareAppMessage, useShareTimeline ,getCurrentInstance} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useSelector, useDispatch } from 'react-redux'
import { SpPage, SpSearch, SpRecommend, SpSkuSelect } from '@/components'
import api from '@/api'
import {
  isWeixin,
  isEmpty,
  getDistributorId,
  VERSION_STANDARD,
  VERSION_PLATFORM,
  classNames,
  getCurrentPageRouteParams,
  resolveStringifyParams,
  pickBy,
  showToast
} from '@/utils'
import entryLaunch from '@/utils/entryLaunch'
import { updateLocation } from '@/store/slices/user'
import { platformTemplateName } from '@/utils/platform'
import { updateShopInfo } from '@/store/slices/shop'
import { useImmer } from 'use-immer'
import { useLogin, useNavigation } from '@/hooks'
import doc from '@/doc'
import HomeWgts from '@/pages/home/comps/home-wgts'
import { WgtHomeHeader } from '@/pages/home/wgts'
import { WgtsContext } from '@/pages/home/wgts/wgts-context'
import NavigationClassification from './navigation-classification'

import './navigation-ibs.scss'

const MSpSkuSelect = React.memo(SpSkuSelect)

const initialState = {
  wgts: [],
  showBackToTop: false,
  loading: true,
  searchComp: null,
  pageData: null,
  fixedTop: false,
  filterWgts: [],
  isShowHomeHeader: false,
  info: null,
  skuPanelOpen: false,
  selectType: 'picker',
  content:null,
  id:null,
  seletedTags:[],
  classifyList:null
}

function navigationIbs() {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const [likeList, setLikeList] = useImmer([])
  const pageRef = useRef()

  const { initState, openRecommend, openLocation, openStore, appName, openScanQrcode } =
    useSelector((state) => state.sys)
  const { shopInfo } = useSelector((state) => state.shop)

  const showAdv = useSelector((member) => member.user.showAdv)
  const { location } = useSelector((state) => state.user)
  const { setNavigationBarTitle } = useNavigation()

  const {
    wgts,
    loading,
    searchComp,
    pageData,
    fixedTop,
    filterWgts,
    isShowHomeHeader,
    info,
    skuPanelOpen,
    selectType,
    content,
    id,
    seletedTags,
    classifyList
  } = state


  const dispatch = useDispatch()

  useEffect(() => {
    let {content,id,seletedTags} = $instance.router.params
    setState((draft) => {
        draft.content = content
        draft.id = id
        draft.seletedTags = JSON.parse(seletedTags)
      })
    if (initState) {
      goodsCategoryin()
      setNavigationBarTitle(content)
    }
  }, [initState])

  useEffect(() => {
    if (shopInfo && VERSION_STANDARD) {
      fetchWgts()
    }
  }, [shopInfo])

  useEffect(() => {
    if (location && VERSION_STANDARD) {
      fetchWgts()
    }
  }, [location])

  useEffect(() => {
    if (skuPanelOpen) {
      pageRef.current.pageLock()
    } else {
      pageRef.current.pageUnLock()
    }
  }, [skuPanelOpen])

  useEffect(() => {
   if(classifyList){
    init()
   }
  }, [classifyList])


  const goodsCategoryin = async()=>{
    let res = await api.item.goodsCategoryinfo({category_id:$instance.router.params.id})
    if($instance.router.params.seletedTags.length > 0){
      res.children.unshift({
        category_name:'推荐'
      })
    }
    res.children.forEach(element => {
      element?.children?.unshift({
        category_name:'全部',
        category_id:element.category_id
      })
    });
    setState((draft) => {
      draft.classifyList = res
    })
    
  }

  // useShareAppMessage(async (res) => {
  //   const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
  //   let params = getCurrentPageRouteParams()
  //   const dtid = getDistributorId()
  //   if (dtid && !('dtid' in params)) {
  //     params = Object.assign(params, { dtid })
  //   }
  //   let path = `/pages/index${isEmpty(params) ? '' : '?' + resolveStringifyParams(params)}`

  //   console.log('useShareAppMessage path:', path, params)

  //   return {
  //     title: title,
  //     imageUrl: imageUrl,
  //     path
  //   }
  // })

  // useShareTimeline(async (res) => {
  //   const { title, imageUrl } = await api.wx.shareSetting({ shareindex: 'index' })
  //   let params = getCurrentPageRouteParams()
  //   const dtid = getDistributorId()

  //   if (dtid && !('dtid' in params)) {
  //     params = Object.assign(params, { dtid })
  //   }

  //   console.log('useShareTimeline params:', params)
  //   return {
  //     title: title,
  //     imageUrl: imageUrl,
  //     query: resolveStringifyParams(params)
  //   }
  // })

  const init = async () => {
    fetchLocation()
    // 非云店
    if (!VERSION_STANDARD) {
      fetchWgts()
    } else {
      fetchStoreInfo(location)
    }
  }

  const fetchWgts = async () => {
    console.log(classifyList,'ooooclassifyList');
    setState((draft) => {
      draft.wgts = []
      draft.pageData = []
      draft.filterWgts = []
      draft.loading = true
    })
    const query = {
      template_name: platformTemplateName,
      version: 'v1.0.1',
      page_name: `custom_${classifyList.customize_page_id}`
    }
    const { config } = await api.category.getCategory(query)

    // const { config } = await api.shop.getShopTemplate({
    //   distributor_id:classifyList.customize_page_id
    // })
    const searchComp = config.find((wgt) => wgt.name == 'search')
    const pageData = config.find((wgt) => wgt.name == 'page')
    let filterWgts = []
    if (searchComp && searchComp.config.fixTop) {
      filterWgts = config.filter((wgt) => wgt.name !== 'search' && wgt.name != 'page')
    } else {
      filterWgts = config.filter((wgt) => wgt.name != 'page')
    }

    const fixedTop = searchComp && searchComp.config.fixTop
    const isShowHomeHeader =
      VERSION_PLATFORM ||
      (openScanQrcode == 1 && isWeixin) ||
      (VERSION_STANDARD && openStore && openLocation == 1) ||
      fixedTop

    setState((draft) => {
      draft.wgts = config
      draft.searchComp = searchComp
      draft.pageData = pageData
      draft.fixedTop = fixedTop
      draft.isShowHomeHeader = isShowHomeHeader
      draft.filterWgts = filterWgts
      draft.loading = false
    })
  }

  const fetchLikeList = async () => {
    if (openRecommend == 1) {
      const query = {
        page: 1,
        pageSize: 30
      }
      const { list } = await api.cart.likeList(query)
      setLikeList(list)
    }
  }

  // 定位
  const fetchLocation = () => {
    if (!location && ((VERSION_STANDARD && openLocation == 1) || VERSION_PLATFORM)) {
      try {
        entryLaunch.isOpenPosition((res) => {
          if (res.lat) {
            dispatch(updateLocation(res))
          }
        })
      } catch (e) {
        console.error('map location fail:', e)
      }
    }
  }

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
  }

  const onAddToCart = async ({ itemId, distributorId }) => {
    Taro.showLoading()
    try {
      const itemDetail = await api.item.detail(itemId, {
        showError: false,
        distributor_id: distributorId
      })
      Taro.hideLoading()
      setState((draft) => {
        draft.info = pickBy(itemDetail, doc.goods.GOODS_INFO)
        draft.skuPanelOpen = true
        draft.selectType = 'addcart'
      })
    } catch (e) {
      showToast(e.message)
      Taro.hideLoading()
    }
  }

  return (
    <SpPage
      className='page-navigation-ibs'
      scrollToTopBtn
      pageConfig={pageData?.base}
      loading={loading}
      ref={pageRef}
    >
      <View
        className={classNames('home-body', {
          'has-home-header': isShowHomeHeader && isWeixin
        })}
      >
        {console.log('searchComp:', searchComp,location)}
        {isShowHomeHeader && (
          <WgtHomeHeader className='home-header-ibs' jump={1 == 2} >{fixedTop && <SpSearch info={searchComp} />}</WgtHomeHeader>
        )}
        {filterWgts.length > 0 && (
          <WgtsContext.Provider
            value={{
              onAddToCart
            }}
          >
            <HomeWgts wgts={filterWgts} onLoad={fetchLikeList}>
              <SpRecommend className='recommend-block' info={likeList} />
            </HomeWgts>
          </WgtsContext.Provider>
        )}
        <NavigationClassification seletedTags={seletedTags} classifyList={classifyList} />
      </View>

      {/* Sku选择器 */}
      <MSpSkuSelect
        open={skuPanelOpen}
        type={selectType}
        info={info}
        onClose={() => {
          setState((draft) => {
            draft.skuPanelOpen = false
          })
        }}
        onChange={(skuText, curItem) => {
          setState((draft) => {
            draft.skuText = skuText
            draft.curItem = curItem
          })
        }}
      />
    </SpPage>
  )
}

export default navigationIbs
