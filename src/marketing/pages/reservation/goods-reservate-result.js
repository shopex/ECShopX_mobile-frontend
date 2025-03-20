import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Switch, Text, Button, ScrollView } from '@tarojs/components'
import { AtButton, AtTextarea } from 'taro-ui'
import { SpCell, SpPage, SpAddress , SpInput as AtInput } from '@/components'
import api from '@/api'
import { isWxWeb, showToast } from '@/utils'
import S from '@/spx'
import { useNavigation } from '@/hooks'

import './goods-reservate-result.scss'

const initialState = {
  info: {},
  listLength: 0,
  areaArray: [[], [], []],
  areaIndexArray: [0, 0, 0],
  areaData: [],
  chooseValue: ['', '', ''],
  isOpened: false
}

function GoodReservateResult(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const colors = useSelector((state) => state.colors.current)
  const dispatch = useDispatch()
  const { setNavigationBarTitle } = useNavigation()

  useEffect(() => {
    fetchAddressList()
    fetch()
    setNavigationBarTitle(initNavigationBarTitle())
  }, [])

  const initNavigationBarTitle = () => {
    return '啊我的好季节啊我喝点酒哈我的卡'
  }

  const fetchAddressList = async () => {
    const areaData = await api.member.areaList()
    setState((draft) => {
      draft.areaData = areaData
    })
  }

  const fetch = async () => {
    Taro.showLoading({ title: '' })
    const { list } = await api.member.addressList()
    setState((draft) => {
      draft.listLength = list?.length
    })

    list.map((a_item) => {
      if (a_item.address_id === $instance.router?.params?.address_id) {
        setState((draft) => {
          draft.info = a_item
          draft.chooseValue = [a_item.province, a_item.city, a_item.county]
        })
      }
    })

    if ($instance.router?.params?.isWechatAddress) {
      try {
        const resAddress = await Taro.chooseAddress()
        const query = {
          province: resAddress?.provinceName,
          city: resAddress?.cityName,
          county: resAddress?.countyName,
          adrdetail: resAddress?.detailInfo,
          is_def: 0,
          postalCode: resAddress?.postalCode,
          telephone: resAddress?.telNumber,
          username: resAddress?.userName
        }
        setState((draft) => {
          draft.info = query
          draft.chooseValue = [query.province, query.city, query.county]
        })
      } catch (err) {
        console.error(err)
      }
    }

    Taro.hideLoading()
  }

  const onPickerClick = () => {
    setState((draft) => {
      draft.isOpened = true
    })
  }

  const handleClickClose = () => {
    setState((draft) => {
      draft.isOpened = false
    })
  }

  const onPickerChange = (selectValue) => {
    const chooseValue = [selectValue[0]?.label, selectValue[1]?.label, selectValue[2]?.label]
    setState((draft) => {
      draft.chooseValue = chooseValue
    })
  }

  const handleChange = (name, val, e) => {
    console.log('---', name, val, e)
    const nInfo = JSON.parse(JSON.stringify(state.info || {}))
    if (name === 'adrdetail') {
      nInfo[name] = e.detail.value
    } else {
      nInfo[name] = val
    }
    setState((draft) => {
      draft.info = nInfo
    })
  }

  const handleDefChange = (e) => {
    const info = {
      ...state.info,
      is_def: e.detail.value ? 1 : 0
    }

    setState((draft) => {
      draft.info = info
    })
  }

  const handleSubmit = async (e) => {
    const { value } = e.detail || {}
    const { chooseValue } = state
    const data = {
      ...state.info,
      ...value
    }

    if (!data.is_def) {
      data.is_def = '0'
    } else {
      data.is_def = '1'
    }
    if (state.listLength === 0) {
      data.is_def = '1'
    }

    if (!data.username) {
      return showToast('请输入收件人')
    }

    if (!data.telephone) {
      return showToast('请输入手机号')
    }

    data.province = chooseValue[0]
    data.city = chooseValue[1]
    data.county = chooseValue[2]

    if (!data.adrdetail) {
      return showToast('请输入详细地址')
    }

    Taro.showLoading('正在提交')

    try {
      await api.member.addressCreateOrUpdate(data)
      if (data.address_id) {
        showToast('修改成功')
      } else {
        showToast('创建成功')
      }
      setTimeout(() => {
        Taro.navigateBack()
      }, 700)
    } catch (error) {
      Taro.hideLoading()
      return false
    }
    Taro.hideLoading()
  }

  const { info, chooseValue, isOpened } = state

  return (
    <SpPage className='good-reservate-result'>
      <View className='good-reservate-result__title-box'>
        <View className='good-reservate-result__title'>股东您，报名已填报完成</View>
        <View className='good-reservate-result__subtitle'>最终登记结果，按您提交信息与股权登记日股东和嗲我和i的海外皇帝活动外</View>
      </View>

      <View className='good-reservate-result__tips'>djakwjdk的狂欢节卡我还得看哈我看到好看好哇好的哈我好好的海外看哈回电话客户瓦哈卡</View>
      <View className='good-reservate-result__btn'>查看报名记录</View>
    </SpPage>
  )
}

GoodReservateResult.options = {
  addGlobalClass: true
}

export default GoodReservateResult
