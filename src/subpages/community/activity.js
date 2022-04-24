import React, { useEffect, useCallback, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import {
  AtTabs,
  AtTabsPane,
  AtModal,
  AtModalContent,
  AtModalAction,
  AtModalHeader,
  AtInput,
  AtTag
} from 'taro-ui'
import { SpPage, SpScrollView, SpFilterBar, SpPrice } from '@/components'
import { pickBy, classNames } from '@/utils'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import doc from '@/doc'
import api from '@/api'
import CompTabbar from './comps/comp-tabbar'

import './activity.scss'

const initialState = {
  activityList: [],
  curTabIdx: 0,
  isOpened: false
}
const tabList = [
  { title: '默认', type: '0' },
  { title: '上新', type: '1' },
  { title: '销量', type: '2' }
]

const statusList = [
  { name: '未开始', status: 0, fontColor: '#4da915', backgroundColor: '#e1fff3' },
  { name: '活动中', status: 0, fontColor: '#4da915', backgroundColor: '#e1fff3' },
  { name: '已结束', status: 0, fontColor: '#4da915', backgroundColor: '#e1fff3' }
]

function ActivityPage(props) {
  const [state, setState] = useImmer(initialState)
  const [isShowSearch, setIsShowSearch] = useState(false)
  const { colorPrimary } = useSelector((state) => state.sys)
  const activityRef = useRef()

  const { activityList, curTabIdx, isOpened } = state

  const fetch = async ({ pageIndex, pageSize }) => {
    let params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status: 0,
      curTabIdx
    }
    const {
      list,
      pager: { count: total },
      rate_status
    } = await api.trade.list(params)
    const n_list = pickBy(list, doc.community.COMMUNITY_ACTIVITY_LIST)
    setState((draft) => {
      draft.activityList = [...activityList, ...n_list]
    })

    return { total }
  }

  const onFilterChange = async (e) => {
    await setState((draft) => {
      draft.curTabIdx = e.current || 0
    })
    activityRef.current.reset()
  }

  const onModalChange = (isOpened, type) => {
    console.log(type)
    if (type == 'confirm') {
    }
    setState((draft) => {
      draft.isOpened = isOpened
    })
  }

  const handleClickBtn = async () => {
    await setState((draft) => {
      draft.isOpened = true
    })
  }

  return (
    <SpPage className='page-community-activity' renderFooter={<CompTabbar />}>
      <SpScrollView className='page-community-activity-scroll' ref={activityRef} fetch={fetch}>
        <SpFilterBar
          custom
          current={curTabIdx}
          list={tabList}
          onChange={onFilterChange}
          className='page-community-activity-filter'
          color={colorPrimary}
        />
        {activityList.map((item) => (
          <View className='page-community-activity-info'>
            <View className='page-community-activity-head'>
              <View className='goods-hd'>
                <View className='goods-title'>活动名称</View>
                <View className='goods-price'>0.01</View>
              </View>
              <View className='goods-time'>2022/04/01</View>
            </View>
            <View className='page-community-activity-goods'>
              <View className='goods-info'>
                <ScrollView className='scroll-goods' scrollX>
                  <View className='scroll-item'>
                    <View className='goods-imgbox'>
                      <Image
                        src='https://preissue-b-img-cdn.yuanyuanke.cn/image/42/2022/01/12/16c76febe685d4249e419259ad979f9bxZsiiZARkIXx70VrEOdbVANzU96nH7hU'
                        className='goods-img'
                        lazyLoad
                      />
                      {/* <View className='img-desc'>商品已核销</View> */}
                    </View>
                    <View className='goods-desc'>商品描述啊啊啊啊啊啊</View>
                    {/* <View className='goods-num'>+11件</View> */}
                  </View>
                </ScrollView>
              </View>
              {/* <View className='goods-sale'>
                <SpPrice className='sale-price' value={0.03} />
                <View className='sale-num'>共5件</View>
              </View> */}
            </View>
            <View className='page-community-activity-static'>
              <View className='activity-static'>
                <SpPrice value={0.03} primary />
                <View className='activity-static-desc'>实际收入(元)</View>
              </View>
              <View className='activity-static'>
                <SpPrice value={10} noSymbol noDecimal />
                <View className='activity-static-desc'>已跟团</View>
              </View>
              <View className='activity-static'>
                <SpPrice value={20} noSymbol noDecimal />
                <View className='activity-static-desc'>已浏览</View>
              </View>
              <View className='activity-static border'>未发货</View>
            </View>
            <View className='page-community-activity-footer'>
              {statusList.map((item) => (
                <View
                  className='footer-status'
                  key={item.status}
                  style={{ color: item.fontColor, backgroundColor: item.backgroundColor }}
                >
                  {item.name}
                </View>
              ))}
              <View
                onClick={handleClickBtn}
                className='footer-btn'
                style={`border: 1PX solid ${colorPrimary}; color: ${colorPrimary}`}
              >
                确认收货
              </View>
            </View>
          </View>
        ))}
      </SpScrollView>
      <AtModal
        isOpened={isOpened}
        className='activity-modal'
        cancelText='取消'
        confirmText='确认'
        content='是否确认收货'
        closeOnClickOverlay={false}
        onCancel={() => onModalChange(false, 'cancel')}
        onConfirm={() => onModalChange(false, 'confirm')}
      />
    </SpPage>
  )
}

export default ActivityPage
