import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import api from '@/api'
import doc from '@/doc'
import { AtButton } from 'taro-ui'
import { pickBy, showToast, classNames } from '@/utils'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { SpPage, SpScrollView } from '@/components'
import CompShippingInformation from './comps/comp-shipping-information'
import CompTradeItem from './comps/comp-tradeitem'

import './send-out-goods.scss'

const initialConfigState = {
  information: {},
  list: [
    {
      title: '快递公司',
      selector: [{ label: '商家自配送', status: true }],
      extraText: '商家自配送',
      status: 'select',
      value: 'all'
    },
    {
      title: '配送员',
      selector: [{ label: '', status: true }],
      extraText: '',
      status: 'select',
      value: 'self_delivery_operator_name'
    },
    {
      title: '配送员手机号',
      selector: [{ label: '', status: true }],
      extraText: '',
      status: 'select',
      value: 'self_delivery_operator_mobile'
    },
    {
      title: '配送状态',
      selector: [{ label: '', status: true }],
      extraText: '',
      status: 'select',
      value: 'self_delivery_status'
    },
    {
      title: '配送备注',
      selector: '',
      extraText: '',
      status: 'textarea',
      value: 'delivery_remark'
    },
    {
      title: '照片上传',
      selector: [],
      extraText: '',
      status: 'image',
      value: 'delivery_pics'
    }
  ]
}

const SendOutGoods = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { information, list } = state
  const goodsRef = useRef()
  const router = useRouter()

  const { deliveryPersonnel } = useSelector((state) => state.cart)

  useEffect(() => {
    // 获取个人信息
    goodsRef?.current.reset()
  }, [])

  useDidShow(() => {
    goodsRef?.current.reset()
  })

  const fetch = async () => {
    const { order_id } = router.params
    const {
      orderInfo,
      total = 1,
      tradeInfo
    } = await api.trade.detail(order_id, { ...deliveryPersonnel })
    orderInfo.pay_date = tradeInfo.payDate
    orderInfo.trade_id = tradeInfo.tradeId
    const tempList = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    setState((draft) => {
      draft.information = tempList
    })
    return { total }
  }

  const handleClickToEdit = async () => {
    const { order_id } = router.params
    let params = {
      order_id,
      self_delivery_operator_id: information.selfDeliveryOperatorId,
      self_delivery_status: 'DELIVERING',
      delivery_type: 'batch',
      delivery_corp: 'SELF_DELIVERY',
      type : 'new'
    }
    list.forEach((item) => {
      if (item.status !== 'select') {
        params[item.value] = item.selector
      }
    })
    console.log(params, 'params')
    await api.delivery.orderDelivery(params)
    showToast('发货成功')
    setTimeout(() => {
      Taro.navigateBack({
        delta: 1 // 默认值是1，表示返回的页面层数
      })
    }, 2000)
  }

  const deliveryItem = (item) => {
    setState((draft) => {
      draft.list = item
    })
    console.log(item, 'hhhhhhhh')
  }

  return (
    <SpPage
      className={classNames('page-send-out-goods')}
      renderFooter={
        information.orderId && (
          <View className='btn-wrap'>
            <AtButton circle type='primary' onClick={handleClickToEdit}>
              确认发货
            </AtButton>
          </View>
        )
      }
    >
      <SpScrollView className='scroll-view-goods' ref={goodsRef} fetch={fetch} auto={false} renderMore={()=>{}}>
        {information.orderId && (
          <View>
            <View className='trade-item-wrap'>
              <CompTradeItem info={information} butn />
            </View>
            <View className='trade-item-wrap'>
              <CompShippingInformation
                selector={list}
                delivery={information}
                deliveryItem={deliveryItem}
              />
            </View>
          </View>
        )}
      </SpScrollView>
    </SpPage>
  )
}

SendOutGoods.options = {
  addGlobalClass: true
}

export default SendOutGoods
