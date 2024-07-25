import Taro, { useRouter } from '@tarojs/taro'
import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { SpPage, SpImage, SpScrollView, SpCell } from '@/components'
import CompShippingInformation from './comps/comp-shipping-information'
import { pickBy, showToast, classNames, isArray } from '@/utils'
import { ORDER_STATUS_INFO, PAYMENT_TYPE, ORDER_DADA_STATUS } from '@/consts'
import { AtButton } from 'taro-ui'
import CompTradeItem from './comps/comp-tradeitem'
import tradeHooks from './hooks'
import btnHooks from './btn-hooks'

import './detail.scss'

const initialConfigState = {
  information: {},
  list: [
    {
      title: '快递公司',
      selector: [{ label: '商家自配送', value: 'all', status: true }],
      extraText: '商家自配送',
      status: 'select'
    },
    {
      title: '配送员',
      selector: [{ label: '', value: 'all', status: true }],
      extraText: '',
      status: 'select'
    },
    {
      title: '配送员手机号',
      selector: [{ label: '', value: 'all', status: true }],
      extraText: '',
      status: 'select'
    },
    {
      title: '配送状态',
      selector: [{ label: '', value: 'all', status: true }],
      extraText: '',
      status: 'select'
    }
    // {
    //   title: '配送备注',
    //   selector: '',
    //   extraText: '',
    //   status: 'textarea'
    // },
    // {
    //   title: '照片上传',
    //   selector: [],
    //   extraText: '',
    //   status: 'image'
    // }
  ]
}

const Detail = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { information, selector, list } = state
  const goodsRef = useRef()
  const router = useRouter()

  const { deliveryPersonnel } = useSelector((state) => state.cart)
  const { tradeActionBtns, getTradeAction } = tradeHooks()
  const { popUpStatus } = btnHooks()

  useEffect(() => {
    // 获取个人信息
    goodsRef?.current.reset()
  }, [])

  const fetch = async () => {
    const { order_id } = router.params
    const {
      distributor,
      orderInfo,
      total = 1,
      tradeInfo
    } = await api.trade.detail(order_id, { ...deliveryPersonnel })
    orderInfo.pay_date = tradeInfo.payDate
    orderInfo.trade_id = tradeInfo.tradeId
    const tempList = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    const newlist = JSON.parse(JSON.stringify(list))
    newlist[1].selector[0].label = tempList.selfDeliveryOperatorName
    newlist[1].extraText = tempList.selfDeliveryOperatorName
    newlist[2].selector[0].label = tempList.selfDeliveryOperatorMobile
    newlist[2].extraText = tempList.selfDeliveryOperatorMobile
    newlist[3].selector[0].label = tempList.orderStatusMsg
    newlist[3].extraText = tempList.orderStatusMsg
    setState((draft) => {
      ;(draft.information = tempList), (draft.list = newlist)
    })
    return { total }
  }

  const getTradeStatusIcon = (info) => {
    return `${ORDER_STATUS_INFO[info.orderStatus]?.icon}.png`
  }

  const deliveryItem = (item) => {
    console.log(item, 'hhhhhhhh')
  }

  const butFooter = () => {
    const btns = getTradeAction(information)
    return (
      <View className='trade-item-ft'>
        {btns.map((item, index) => (
          <AtButton
            key={index}
            circle
            className={`btn-${item.btnStatus}`}
            onClick={handleClickItem.bind(this, item)}
          >
            {item.title}
          </AtButton>
        ))}
      </View>
    )
  }

  const handleClickItem = ({ key, action }) => {
    if (key == 'update_delivery') {
      updateDelivery(information)
    } else if (key == 'cancel_delivery') {
      butStatus(information, 'cancel_delivery')
    } else if (key == 'pack') {
      butStatus(information, 'pack')
    } else {
      action(information)
    }
  }

  //更新配送状态
  const updateDelivery = (item) => {
    console.log(item, 'lllupdateDelivery')
    setState((draft) => {
      draft.statusDelivery = true
    })
  }

  //打包
  const butStatus = (item, val) => {
    if (popUpStatus(item, val)) {
      goodsRef.current.reset()
    }
  }

  return (
    <SpPage className={classNames('page-detail')} renderFooter={information.orderId && butFooter()}>
      <SpScrollView
        scrollY
        style='height: 100%;'
        className='scroll-view-goods'
        ref={goodsRef}
        fetch={fetch}
        auto={false}
      >
        {information.orderId && (
          <View>
            <View className='trade-status-desc-box'>
              <SpImage src={getTradeStatusIcon(information)} width={50} height={50} />
              <Text className='status-desc'>{information.orderStatusMsg}</Text>
            </View>
            <View className='trade-item-wrap'>
              <CompTradeItem
                info={information}
                updateDelivery={updateDelivery}
                cancelDelivery={(e) => butStatus(e, 'cancelDelivery')}
                pack={(e) => butStatus(e, 'pack')}
                butn
              />
            </View>
            <View className='trade-item-wrap'>
              <SpCell title='下单时间' value={information.createTime} />
              <SpCell title='付款时间' value={information.payDate} />
              {information.deliveryTime && (
                <SpCell title='发货时间' value={information.deliveryTime} />
              )}
              <SpCell title='订单编号' value={information.orderId} />
              <SpCell title='交易单号' value={information.tradeId} />
              {/* <SpCell title='交易流水号' value={information.createTime} /> */}
            </View>
            <View className='trade-item-wrap'>
              <CompShippingInformation selector={list} deliveryItem={deliveryItem} />
            </View>
          </View>
        )}
      </SpScrollView>
    </SpPage>
  )
}

Detail.options = {
  addGlobalClass: true
}

export default Detail
