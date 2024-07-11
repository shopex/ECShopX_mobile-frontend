// 1、经纬度 =》 解析
// 2. location == 解析  => location
// 3. location ！= 解析 =》 解析
// 4、是否登录，如果登录 =》收货地址比较
// 5、收货地址空 =》 解析
// 6、收货地址比较距离最短 与 定位的比较

import Taro from '@tarojs/taro'
import { useState, useRef, useEffect } from 'react'
import { useImmer } from 'use-immer'
import api from '@/api'
import entryLaunch from '@/utils/entryLaunch'
import { useSelector, useDispatch } from 'react-redux'
import { updateLocation } from '@/store/slices/user'
import { useLogin } from '@/hooks'

const initialState = {
  list: []
}

export default (props) => {
  const [state, setState] = useImmer(initialState)
  const { list } = state
  const callbackRef = useRef()
  const dispatch = useDispatch()
  const { isLogin } = useLogin({
    autoLogin: false
  })

  useEffect(() => {
    getCode()
  }, [])

  const getCode = async () => {
    console.log('Taro.getStorageSynctoken', Taro.getStorageSync('token'))
    if (Taro.getStorageSync('token')) {
        console.log('已登录')
      await addressLogic()
    } else {
        console.log('未登录')
      /**
       * 未登录状态且授权定位：直接拿到当前定位存入redux
       * 未登录状态且不授权定位：控制台报错，redux中存在默认数据
       */
      const res = await fetchLocation()
      dispatch(updateLocation(res))
    }
  }

  // 获取当前定位
  const fetchLocation = () => {
    entryLaunch.isOpenPosition((res) => {
      try {
        if (res.lat) {
          // 处理成功情况
          console.log(res);
        } else {
          // 处理 res.lat 不存在的情况
          console.error('Latitude not found in response');
        }
      } catch (e) {
        // 捕获处理回调函数中的错误
        console.error('Error in callback:', e);
      }
    });
  }

  //登录状态下，地址选择
  const addressLogic = async () => {
       //获取收货地址
       const { list } = await api.member.addressList()

       //获取当前定位
       const res = await fetchLocation()

       console.log('收货地址', res)

  }

  return { getCode }
}
