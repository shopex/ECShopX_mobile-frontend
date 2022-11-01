/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2022-11-01 11:36:16
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2022-11-01 11:42:07
 * @FilePath: /ecshopxx-vshop/src/components/sp-chat/index.js
 * @Description: 
 * 
 * Copyright (c) 2022 by wangzhanyuan dreamworks.cnn@gmail.com, All Rights Reserved. 
 */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { useImmer } from 'use-immer'
import { SpFloatMenuItem } from '@/components'
import { showToast, isAlipay } from '@/utils'
import api from '@/api'

import './index.scss'

const initialState = {
  isWeAppKefu: true
}

function SpChat(props) {
  const { children, sessionFrom = '' } = props
  const [state, setState] = useImmer(initialState)
  const { isWeAppKefu } = state
  const { echat, meiqia } = useSelector((state) => state.sys)
  const $instance = getCurrentInstance()

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    if (echat?.is_open == 'true' || meiqia?.is_open == 'true') {
      setState((draft) => {
        draft.isWeAppKefu = false
      })
    }
  }

  const handleKeFu = async () => {
    if (echat?.is_open == 'true') {
      if (!echat.echat_url) {
        showToast('请配置一洽客服链接')
      } else {
        Taro.navigateTo({ url: `/pages/chat/index?url=${encodeURIComponent(echat.echat_url)}` })
      }
    } else if (meiqia?.is_open == 'true') {
      // 获取店铺美洽配置
      const { dtid } = $instance.router.params
      const { meiqia_id, meiqia_token } = await api.im.getImConfigByDistributor(dtid)
      if(!meiqia_id || !meiqia_token) {
        return showToast('请检查美洽客服配置')
      }
      const chat_link = `https://chatlink.mstatik.com/widget/standalone.html?eid=${meiqia_id}&groupid=${meiqia_token}`
      console.log('chat_link:', chat_link)
      Taro.navigateTo({ url: `/pages/chat/index?url=${encodeURIComponent(chat_link)}` })
    }
  }

  return (
    <View className='sp-chat'>
      {(isWeAppKefu && !isAlipay) && (
        <Button className='btn-cantact' openType='contact' sessionFrom={sessionFrom}>
          {children}
          {isAlipay && <contact-button
            tnt-inst-id="JRC_1NRG"
            scene="SCE01214288"
          >
          </contact-button>}
        </Button>
      )}
      {!isWeAppKefu && (
        <View className='' onClick={handleKeFu}>
          {children}
        </View>
      )}
    </View>
  )
}

SpChat.options = {
  addGlobalClass: true
}

export default SpChat
