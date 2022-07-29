import React, { useRef, useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { AtDrawer, AtTabs } from 'taro-ui'
import {
  SpFilterBar,
  SearchBar,
  GoodsItem,
  SpTagBar,
  SpGoodsItem,
  SpSearchBar,
  SpNote,
  SpNavBar,
  SpLoadMore,
  TabBar,
  SpPage,
  SpScrollView,
  SpDrawer,
  SpSelect,
  SpPoint,
  SpImage
} from '@/components'
import doc from '@/doc'
import api from '@/api'
import {
  pickBy,
  classNames,
  isWeixin,
  getDistributorId,
  styleNames,
  VERSION_STANDARD
} from '@/utils'
import { getMypoint } from '@/api/pointitem'

import './list.scss'

const initialState = {
  leftList: [],
  rightList: [],
  brandList: [],
  brandSelect: [],
  filterList: [
    { title: '全部' },
    { title: '销量' },
    { title: '积分', icon: ['icon-shengxu-01', 'icon-jiangxu-01'], sort: 1 },
  ],
  curFilterIdx: 0,
  sort: -1,
  tagList: [],
  curTagIdx: 0,
  keywords: '',
  show: false,
  point: 0,
}

function PointShopList() {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const {
    keywords,
    leftList,
    rightList,
    brandList,
    brandSelect,
    curFilterIdx,
    sort,
    filterList,
    tagList,
    curTagIdx,
    show,
    point
  } = state
  const [isShowSearch, setIsShowSearch] = useState(false)
  const { userInfo } = useSelector((state) => state.user)
  const goodsRef = useRef()

  useEffect(() => {
    getMypoint()
  }, [])

  useEffect(() => {
    goodsRef.current.reset()
  }, [curFilterIdx, sort])

  const getMypoint = async () => {
    const { point } = await api.pointitem.getMypoint()
    setState((draft) => {
      draft.point = point
    })
  }

  const fetch = async ({ pageIndex, pageSize }) => {
    const { keywords, dis_id, cat_id, main_cat_id } = $instance.router.params
    let params = {
      page: pageIndex,
      pageSize,
      item_type: 'normal'
      // keywords: keywords,
      // approve_status: 'onsale,only_show',
      // item_type: 'normal',
      // is_point: 'false'
    }

    if (curFilterIdx == 1) {
      // 销量
      params['goodsSort'] = 1
    } else if (curFilterIdx == 2) {
      // 价格升序
      if(sort == 1) {
        params['goodsSort'] = 3
      } else {
        params['goodsSort'] = 2
      }
    }

    if (cat_id) {
      params['category'] = cat_id
    }

    if (main_cat_id) {
      params['main_category'] = main_cat_id
    }

    if (VERSION_STANDARD) {
      params.distributor_id = getDistributorId()
    }

    const {
      list,
      total_count,
      item_params_list = [],
      brand_list
    } = await api.pointitem.search(params)
    const n_list = pickBy(list, doc.goods.ITEM_LIST_POINT_GOODS)
    const resLeftList = n_list.filter((item, index) => {
      if (index % 2 == 0) {
        return item
      }
    })
    const resRightList = n_list.filter((item, index) => {
      if (index % 2 == 1) {
        return item
      }
    })

    setState((draft) => {
      draft.leftList[pageIndex - 1] = resLeftList
      draft.rightList[pageIndex - 1] = resRightList
      draft.brandList = pickBy(brand_list?.list, doc.goods.WGT_GOODS_BRAND)
    })

    return { total: total_count }
  }

  const handleOnFocus = () => {
    setIsShowSearch(true)
  }

  const handleOnChange = (val) => {
    setState((v) => {
      v.keywords = val
    })
  }

  const handleOnClear = async () => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.keywords = ''
    })
    setIsShowSearch(false)
    goodsRef.current.reset()
  }

  const handleSearchOff = async () => {
    setIsShowSearch(false)
    await setState((v) => {
      v.keywords = ''
    })
  }

  const handleConfirm = async (val) => {
    setIsShowSearch(false)
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.keywords = val
    })
    goodsRef.current.reset()
  }

  const handleFilterChange = ({ current, sort}) => {
    setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.curFilterIdx = current || 0
      draft.sort = sort
    })
  }

  const onChangeBrand = (val) => {
    setState((draft) => {
      draft.brandSelect = val
    })
  }

  const onConfirmBrand = async () => {
    await setState((draft) => {
      draft.leftList = []
      draft.rightList = []
      draft.show = false
    })
    goodsRef.current.reset()
  }

  const onResetBrand = async () => {
    await setState((draft) => {
      draft.brandSelect = []
      draft.leftList = []
      draft.rightList = []
      draft.show = false
    })
    goodsRef.current.reset()
  }

  const handleClickStore = (item) => {
    const url = `/subpages/store/index?id=${item.distributor_info.distributor_id}`
    Taro.navigateTo({
      url
    })
  }
  return (
    <SpPage scrollToTopBtn className={classNames('page-pointshop-list')}>
      <View className='page-hd'>
        <View className='pointshop-hd'>
          <View className='point-info'>
            <View className='point-info-hd'>
              <SpImage src={userInfo?.avatar || 'user_icon.png'} width={80} height={80} />
              <Text className='user-name'>{userInfo?.username}</Text>
            </View>
            <View className='point-total'>
              <SpPoint value={point} />
            </View>
          </View>
        </View>
        <View className='item-list-head'>
          <SpFilterBar
            custom
            current={curFilterIdx}
            list={filterList}
            onChange={handleFilterChange}
          >
            <View
              className='filter-btn'
              onClick={() => {
                setState((v) => {
                  v.show = true
                })
              }}
            >
              筛选<Text className='iconfont icon-filter'></Text>
            </View>
            <SpSearchBar
              keyword={keywords}
              placeholder='搜索'
              onFocus={handleOnFocus}
              onChange={handleOnChange}
              onClear={handleOnClear}
              onCancel={handleSearchOff}
              onConfirm={handleConfirm}
            />
          </SpFilterBar>
        </View>
      </View>
      <SpScrollView className='item-list-scroll' auto={false} ref={goodsRef} fetch={fetch}>
        <View className='goods-list'>
          <View className='left-container'>
            {leftList.map((list, idx) => {
              return list.map((item, sidx) => (
                <View className='goods-item-wrap' key={`goods-item-l__${idx}_${sidx}`}>
                  <SpGoodsItem onStoreClick={handleClickStore} info={item} />
                </View>
              ))
            })}
          </View>
          <View className='right-container'>
            {rightList.map((list, idx) => {
              return list.map((item, sidx) => (
                <View className='goods-item-wrap' key={`goods-item-r__${idx}_${sidx}`}>
                  <SpGoodsItem onStoreClick={handleClickStore} info={item} />
                </View>
              ))
            })}
          </View>
        </View>
      </SpScrollView>

      {/* <SpDrawer
        show={show}
        onClose={() => {
          setState(v => {
            v.show = false;
          });
        }}
        onConfirm={onConfirmBrand}
        onReset={onResetBrand}
      >
        <View className="brand-title">品牌</View>
        <SpSelect
          multiple
          info={brandList}
          value={brandSelect}
          onChange={onChangeBrand}
        />
      </SpDrawer> */}
    </SpPage>
  )
}

export default PointShopList
