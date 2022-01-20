import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpFloatLayout, SpButton, SpImage, SpPrice, SpInputNumber } from '@/components'
import { classNames } from '@/utils'
import './index.scss'

function SpSkuSelect (props) {
  const { info, open = false, onClose = () => {} } = props
  if (!info) {
    return null
  }
  const { skuItems, specItems } = info

  const selection = Array(skuItems.length).fill(null)
  console.log('specItems:', specItems)
  const skuDict = {}
  // 默认选择sku
  const res = specItems.filter((item) => item.store > 0)
  res.forEach((item) => {
    const key = item.itemSpec.map((spec) => spec.spec_value_id).join('_')
    skuDict[key] = item
  })

  console.log('skuDict:', skuDict)

  return (
    <SpFloatLayout
      className='sp-sku-select'
      open={open}
      onClose={onClose}
      renderFooter={<SpButton resetText='加入购物车' confirmText='立即购买'></SpButton>}
    >
      <View className='sku-info'>
        <SpImage className='sku-image' width={170} height={170} />
        <View className='info-bd'>
          <View className='goods-sku-price'>
            <SpPrice value={100}></SpPrice>
          </View>
          <View className='goods-sku-txt'>xxxxx</View>
        </View>
      </View>
      <View className='sku-list'>
        {skuItems.map((item) => (
          <View className='sku-group'>
            <View className='sku-name'>{item.spec_name}</View>
            <View className='sku-values'>
              {item.spec_values.map((spec) => (
                <View className='sku-btn'>
                  {spec.spec_custom_value_name || spec.spec_value_name}
                </View>
              ))}
            </View>
          </View>
        ))}
        <View className='buy-count'>
          <View className='label'>
            购买数量<Text className='limit-count'>（限购5件）</Text>
          </View>

          <SpInputNumber />
        </View>
      </View>
    </SpFloatLayout>
  )
}

SpSkuSelect.options = {
  addGlobalClass: true
}

export default SpSkuSelect
