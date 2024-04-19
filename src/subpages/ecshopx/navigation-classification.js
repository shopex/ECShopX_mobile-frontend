import React, { Component, useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { VERSION_PLATFORM, classNames, isWeixin, VERSION_STANDARD } from '@/utils'
import { useImmer } from 'use-immer'
import api from '@/api'
import recommendation from '@/assets/imgs/recommendation.png'

import './navigation-classification.scss'

const initialState = {
  navList: 0,
  navSecon: 0
}

function navigationClassification(props) {
  const [state, setState] = useImmer(initialState)
  const { navList, navSecon } = state
  const { seletedTags, classifyList } = props

  const setNav = (val, index) => {
    if (val) {
      setState((draft) => {
        draft.navList = index
        draft.navSecon = 0
      })
    } else {
      setState((draft) => {
        draft.navSecon = index
      })
    }
  }


  return (
    <View className='navigation-classification'>
      <ScrollView scrollX>
        <View className='first-level'>
          {classifyList.children.map((item, index) => {
            return (
              <View
                key={index}
                className='first-level-item'
                onClick={() => {
                  setNav(true, index)
                }}
              >
                <View
                  className={classNames(
                    'first-level-item-img',
                    navList == index ? 'first-level-item-img-index' : null
                  )}
                >
                  {item.image_url ? (
                    <Image
                      src={item.image_url == '推荐' ? recommendation : item.image_url}
                      className='first-level-item-image-url'
                    />
                  ) : (
                    <View className='first-level-item-img-text'> {item.category_name}</View>
                  )}
                </View>
                <View
                  className={classNames(
                    'first-level-item-recommendation',
                    navList == index ? 'first-level-item-recommendation-index' : null
                  )}
                >
                  {item.category_name}
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>

      {classifyList.children[navList]?.children && (
        <View className='secondary-classification'>
          {classifyList.children[navList].children.map((item, index) => {
            return (
              <View
                key={index}
                className={classNames(
                  'secondary-classification-name',
                  navSecon == index ? 'secondary-classification-name-index' : null
                )}
                onClick={() => {
                  setNav(false, index)
                }}
              >
                {item.category_name}
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

navigationClassification.options = {
  addGlobalClass: true
}

export default navigationClassification
