import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

function SpGoodsCell (props) {
  return (
    <View className='sp-goods-cell'>
      <View className='goods-item-hd' onClick={onClickImgAndTitle}>
        <Image className='goods-image' mode='aspectFill' src={info.pics} />
      </View>
      <View className='goods-item-bd'>
        <View className='item-hd'>
          <View className='goods-title'>{info.item_name}</View>
        </View>
        {/* {info.item_spec_desc && (
          <View className='item-bd'>
            <Text className='spec-desc'>{info.item_spec_desc}</Text>
          </View>
        )} */}

        {/* <View className='item-ft'>
          <SpPrice value={info.price / 100} />
          {isShowAddInput ? (
            <SpInputNumber value={info.num} onChange={onChangeGoodsItem} />
          ) : (
            <Text className='item-num'>x {info.num}</Text>
          )}
        </View> */}
      </View>
    </View>
  )
}

SpGoodsCell.options = {
  addGlobalClass: true
}

export default SpGoodsCell
