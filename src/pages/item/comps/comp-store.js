import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpImage } from '@/components'
import { isArray } from '@/utils'
import './comp-store.scss'

function CompStore (props) {
  const { info } = props
  // tip: 平台自营info为空数组
  if (!info || isArray(info)) {
    return null
  }
  return (
    <View className='comp-store'>
      <View className='store-bd'>
        <View className='store-icon'>
          <SpImage src={info.logo} width={120} height={120} />
        </View>
        <View className='store-info'>
          <View className='store-name'>{info.store_name}</View>
          <View className='store-rate'></View>
        </View>
      </View>
      <View className='store-ft'>
        <View className='btn-wrap'>
          <AtButton circle>进店逛逛</AtButton>
        </View>
        <View className='btn-wrap'>
          <AtButton circle>全部商品</AtButton>
        </View>
      </View>
    </View>
  )
}

CompStore.options = {
  addGlobalClass: true
}

export default CompStore
