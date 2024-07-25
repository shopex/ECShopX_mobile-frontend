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
  const { list } = state
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

    

  return { popUpStatus }
}
