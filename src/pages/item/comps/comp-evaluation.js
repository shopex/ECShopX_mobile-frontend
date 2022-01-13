import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { SpImage } from '@/components'
import { classNames } from '@/utils'
import './comp-evaluation.scss'

function CompEvaluation (props) {
  const { className, list = [] } = props
  return (
    <View className={classNames('comp-evaluation', className)}>
      <View className='evaluation-hd'>
        <View className='title'>评价（2）</View>
        <View className='extra-more'>
          查看全部
          <Text className='iconfont icon-qianwang-01'></Text>
        </View>
      </View>
      <View className='evaluation-bd'>
        {list.map((item) => (
          <View className='evaluation-item-wrap'>
            <View className='item-hd'>
              <SpImage src={item.avatar} className='evaluation-icon' width={50} height={50} />
              <Text className='evaluation-name'>{item.username}</Text>
            </View>
            <View className='evaluation-content'>{item.content}</View>
          </View>
        ))}
        {list.length == 0 && <View className='default-msg'>暂无商品评论</View>}
      </View>
    </View>
  )
}

CompEvaluation.options = {
  addGlobalClass: true
}

export default CompEvaluation
