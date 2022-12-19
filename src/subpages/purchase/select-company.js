import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image, Input, Picker } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-company.scss'
import userIcon from '@/assets/imgs/user-icon.png'
import CompBottomTip from './comps/comp-bottomTip'
import arrow from '@/assets/imgs/arrow.png'

const initialState = {
  selector: ['美国公司', '中国公司', '巴西公司', '日本公司'],
  selectorChecked: ''
}

function SelectComponent(props) {
  const [state, setState] = useImmer(initialState)

  useEffect(() => {
    //请求获取企业信息
  }, [])

  const onChange = (e) => {
    setState((draft) => {
      draft.selectorChecked = draft.selector[e.detail.value]
    })
  }

  return (
    <View className='select-component'>
      <View className='select-component-title'>选择企业</View>
      <Picker range={state.selector} onChange={onChange} className='pick-company'>
        <AtInput
          placeholder='选择企业后继续登陆'
          value={state.selectorChecked}
          className='select-option '
        />
        <Text className='iconfont icon-select select '></Text>
      </Picker>
      <AtButton circle className='btns-staff' disabled={!state.selectorChecked}>
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
