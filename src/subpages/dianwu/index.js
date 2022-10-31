/*
 * @Author: dreamworks.cnn@gmail.com
 * @Date: 2022-10-13 00:40:25
 * @LastEditors: dreamworks.cnn@gmail.com
 * @LastEditTime: 2022-10-31 18:06:46
 * @FilePath: /ecshopxx-vshop/src/subpages/dianwu/index.js
 * @Description: 
 * 
 * Copyright (c) 2022 by wangzhanyuan dreamworks.cnn@gmail.com, All Rights Reserved. 
 */
import React, { useEffect, Component } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import { WebView } from '@tarojs/components'
import qs from 'qs'
import { log } from '@/utils'
import S from '@/spx'

const initialState = {
  webviewSrc: ''
}
const Index = () => {
  const [state, setState] = useImmer(initialState)
  const { webviewSrc } = state
  useEffect(() => {
    createWebviewUrl()
    log.debug(`dianwu url:`, webviewSrc)
  }, [])

  // useDidShow(() => {
  //   debugger
  //   log.debug(`dianwu useDidShow ${webviewSrc}`)
  //   createWebviewUrl()
  // })

  const createWebviewUrl = () => {
    // const { openid, unionid, app_id, app_type, company_id } = S.get('DIANWU_CONFIG', true)
    const token =  S.getAuthToken()
    // const url = `${process.env.APP_DIANWU_URL}?${qs.stringify({
    //   in_shop_wechat: true,
    //   openid,
    //   unionid,
    //   app_id,
    //   company_id,
    //   app_type
    // })}`
    const url = `${'http://192.168.1.101:10086'}?${qs.stringify({
      token,
      type:'alipay'
    })}`
    setState(draft => {
      draft.webviewSrc = url      
    })
    console.log('webviewSrc', url)
  }

  const handleTest = () => {
    log.debug(`handleTest.... ${webviewSrc}`)
  }



  const onMessage = (e) => {
    debugger
  }

  return <WebView src={webviewSrc} onMessage={onMessage} />
}

export default Index
