import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './comp-packageitem.scss'

function CompPackageItem (props) {
  return <View className='comp-packageitem'></View>
}

CompPackageItem.options = {
  addGlobalClass: true
}

export default CompPackageItem
