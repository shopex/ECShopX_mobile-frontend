import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { useRouter } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { SpPage, SpScrollView, SpTagBar, SpImage, SpTradeItem } from '@/components'
import api from '@/api'
import doc from '@/doc'
import { pickBy } from '@/utils'
import CompActivityItem from './comps/comp-activity-item'
import './item-activity.scss'

const initialState = {
  tradeStatus: [
    { tag_name: '全部', value: '0' },
    { tag_name: '待审核', value: '1' },
    { tag_name: '已报名', value: '2' },
    { tag_name: '已拒绝', value: '3' },
    { tag_name: '已取消', value: '4' },
    { tag_name: '已审核', value: '5' },
  ],
  status: '0',
  tradeList: [],
  trackDetailList:[],
  openTrackDetail:false,
  info:null
}
function ItemActivity(props) {
  const [state, setState] = useImmer(initialState)
  const { tradeStatus, status, tradeList,trackDetailList,openTrackDetail,info } = state
  const tradeRef = useRef()
  const router = useRouter()

  useEffect(() => {
    const { status = 0 } = router.params
    setState((draft) => {
      draft.status = status
    })

    Taro.eventCenter.on('onEventOrderStatusChange', () => {
      setState((draft) => {
        draft.tradeList = []
      })
      tradeRef.current.reset()
    })

    return () => {
      Taro.eventCenter.off('onEventOrderStatusChange')
    }
  }, [])

  useEffect(() => {
    setState((draft) => {
      draft.tradeList = []
    })
    tradeRef.current.reset()
  }, [status])

  const fetch = async ({ pageIndex, pageSize }) => {
    const { is_rate } = tradeStatus.find((item) => item.value == status)
    const params = {
      page: pageIndex,
      pageSize,
      order_type: 'normal',
      status,
      is_rate
    }
    const {
      list,
      pager: { count: total },
      rate_status
    } = await api.trade.list(params)
    const tempList = pickBy(list, doc.trade.TRADE_ITEM)
    // console.log('tempList:', tempList)
    setState((draft) => {
      draft.tradeList = [...tradeList, ...tempList]
    })
    return { total }
  }

  const onChangeTradeState = (e) => {
    setState((draft) => {
      draft.status = tradeStatus[e].value
    })
  }

  return (
    <SpPage scrollToTopBtn className='page-trade-list'>
      <SpTagBar list={tradeStatus} value={status} onChange={onChangeTradeState} />
      <ScrollView
        className='list-scroll-container'
        scrollY
      >
        <SpScrollView
          className='trade-list-scroll'
          auto={false}
          ref={tradeRef}
          fetch={fetch}
          emptyMsg='没有查询到订单'
        >
          {tradeList.map((item, index) => (
            <View className='trade-item-wrap' key={index}>
              <CompActivityItem info={item} onClick={()=>{}} />
            </View>
          ))}
        </SpScrollView>
      </ScrollView>

    </SpPage>
  )
}

ItemActivity.options = {
  addGlobalClass: true
}

export default ItemActivity
