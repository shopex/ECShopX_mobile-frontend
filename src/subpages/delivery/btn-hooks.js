import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { pickBy, showToast } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'

const initialConfigState = {
  list: []
}

export default (props) => {
  const [state, setState] = useImmer(initialConfigState)
  // const { list } = state
  const popUpStatus = (item, val) => {
    Taro.showModal({
      title: '提示',
      content: `你确认要${val == 'pack' ? '打包' : '取消配送'}订单编号为${item.orderId}的订单吗？`,
      async success(res) {
        if (res.confirm) {
          if (val == 'pack') {
            await api.delivery.deliverypackagConfirm({ order_id: item.orderId })
            showToast('打包成功')
            return true
          } else {
            api.delivery.cancelDeliverystaff({ order_id: item.orderId })
            showToast('取消配送成功')
            return true
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
          return false
        }
      }
    })
  }

  const orderState = (delivery) => {
    if (delivery.orderStatus == 'PAYED' && delivery.selfDeliveryStatus == 'RECEIVEORDER') {
      return '已接单待打包'
    } else if (delivery.orderStatus == 'PAYED' && delivery.selfDeliveryStatus == 'PACKAGED') {
      return '已接单待发货'
    } else if (
      delivery.orderStatus == 'WAIT_BUYER_CONFIRM' &&
      delivery.selfDeliveryStatus == 'DELIVERING'
    ) {
      return '已发货配送中'
    } else if (
      delivery.orderStatus == 'WAIT_BUYER_CONFIRM' &&
      delivery.selfDeliveryStatus == 'DONE'
    ) {
      return '已送达'
    }
  }

  const deliverySure = async (information, list) => {
    try {
      let params = {
        order_id: information.orderId,
        self_delivery_operator_id: information.selfDeliveryOperatorId,
        self_delivery_status: 'DONE',
        delivery_type: 'batch',
        delivery_corp: 'SELF_DELIVERY',
        delivery_code: information.deliveryCode
      }
      list.forEach((item) => {
        if (item.status !== 'select') {
          params[item.value] = item.selector
        }
        if (item.value == 'self_delivery_status' && item.selector[0].status) {
          params.self_delivery_status = 'DELIVERING'
        }
      })
      await api.delivery.orderUpdateDelivery(information.ordersDeliveryId, params)
      showToast('更新配送状态成功')
      return true
    } catch (error) {
      return false
    }
  }

  return { popUpStatus, orderState, deliverySure }
}
