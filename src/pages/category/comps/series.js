import React, { Component } from 'react'
import { useState, useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { connect } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { Loading } from '@/components'
import { classNames } from '@/utils'

import './series.scss'

const Series = (props) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const { info } = props
  const colors = useSelector((state) => state.colors.current)
  

  console.log(info)
  return (
    <View className='category-list'>
      {/* left */}
      <ScrollView className='category-list__nav' scrollY>
        <View className='category-nav-cpn'>
          {info.map((item, index) => (
            <View
              className={classNames(
                'category-nav-cpn__content',
                activeIndex === index ? 'category-nav-cpn__content-active' : null
              )}
              style={
                activeIndex == index ? `border-left: 7rpx solid ${colors.data[0].primary};` : null
              }
              key={`${item.name}-${index}`}
              onClick={()=>setActiveIndex(index)}
            >
              {item.hot && <Text className='hot-tag'></Text>}
              {item.name}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default Series
