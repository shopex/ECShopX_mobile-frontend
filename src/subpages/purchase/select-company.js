import Taro from '@tarojs/taro'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, Picker } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import arrow from '@/assets/imgs/arrow.png'
import './select-company.scss'
import CompBottomTip from './comps/comp-bottomTip'

const initialState = {
  enterpriseList: [
    { login_type: 'account', enterprise_name: '上海商派-账号', enterprise_sn: '001' },
    { login_type: 'email', enterprise_name: '北京商派-邮箱', enterprise_sn: '002' },
    { login_type: 'phone', enterprise_name: '商派-手机号', enterprise_sn: '003' },
  ],
  enterpriseName: '',
  enterpriseInfo: {}
}

function SelectComponent(props) {
  const [state, setState] = useImmer(initialState)
  const { enterpriseInfo, enterpriseName, enterpriseList } = state

  useEffect(() => {
    //请求获取企业信息
    // getEnterpriseList()
  }, [])

  const getEnterpriseList = async () => {
    const data = await api.purchase.getEnterpriseList()
    setState((draft) => {
      draft.enterpriseList = data.list
    })
  }

  const onPickerChange = (e) => {
    const { enterprise_name, enterprise_sn, login_type } = enterpriseList[e.detail.value] || {}
    console.log(e, enterprise_name, enterprise_sn, login_type)
    setState((draft) => {
      draft.enterpriseName = enterprise_name
      draft.enterpriseInfo = {
        enterprise_name,
        enterprise_sn,
        login_type,
      }
    })
  }

  const onValidateChange = () => {
    if (!enterpriseName) return
    const { login_type, enterprise_name, enterprise_sn } = enterpriseInfo
    let redirectUrl = ''
    if (login_type == 'account') {
      redirectUrl = `/subpages/purchase/select-company-account`
    } else if (login_type == 'email') {
      redirectUrl = `/subpages/purchase/select-company-email`
    } else if (login_type == 'phone') {
      redirectUrl = `/subpages/purchase/select-company-phone`
    }
    Taro.navigateTo({
      url: `${redirectUrl}?enterprise_sn=${enterprise_sn}&enterprise_name=${enterprise_name}`
    })
  }

  return (
    <View className='select-component'>
      <View className='select-component-title'>选择企业</View>
      <Picker range={enterpriseList} rangeKey='enterprise_name' onChange={onPickerChange} className='pick-company'>
        <View className='select-component-enterprise_sn'>{enterpriseName || '选择企业后继续登录'}</View>
        <Text className='iconfont icon-zhankai select'></Text>
      </Picker>
      <AtButton circle className='btns-staff' onClick={onValidateChange} disabled={!enterpriseName}>
        继续验证
      </AtButton>
      <CompBottomTip />
    </View>
  )
}

SelectComponent.options = {
  addGlobalClass: true
}

export default SelectComponent
