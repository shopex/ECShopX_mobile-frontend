import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

function SpSku (props) {
  return (
    <View className='sp-sku'>
      <View className='sp-sku__overlay'></View>
      <View className='sp-sku__body'>
        <View className=''></View>
        <View className='sku-list'></View>
      </View>
    </View>
  )
}

SpSku.options = {
  addGlobalClass: true
}

export default SpSku
