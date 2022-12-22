import Taro from '@tarojs/taro'
import React, { useCallback, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import api from '@/api'
import { classNames } from '@/utils'
import './select-role2.scss'
import userIcon from '@/assets/imgs/user-icon.png'
import CompBottomTip from './comps/comp-bottomTip'
import arrow from '@/assets/imgs/arrow.png'

const initialState = {}

function SelectRole(props) {
  const [options, setOptions] = useState([
    { title: '亲友', value: 'friend' },
    { title: '员工', value: 'staff' }
  ])
  const [activeIndex, setActiveIndex] = useState(null)

  const [userInfo,setUserInfo] = useState({
    url:''
  })

  useEffect(() => {

  }, [])

  const handleOptionClick = (index) => {
    console.log(index)
    setActiveIndex((val) => (val = index))
  }

  const handleConfirmClick = async()=>{
    //todo
    console.log('confirm',options[activeIndex].title)
    let title = options[activeIndex].title
    // if(title === '亲友'){
      const { confirm } = await Taro.showModal({
        title: '亲友验证说明',
        content: `如果您是亲友，请通过员工分享的活动链接认证；如果您是员工，请在上一页面中点击「我是员工」验证身份`,
        // confirmColor: colorPrimary,
        confirmColor:'#F4811F',
        showCancel: false,
        confirmText: '我知道了'
      })
    // }

  }

  return (
    <View className='select-role'>
      <View className='header'>
        <Image className='header-avatar' src={userInfo.url || `${process.env.APP_IMAGE_CDN}/user_icon.png`} mode='aspectFill' />
        <Text className='welcome'>欢迎登陆</Text>
        <Text className='title'>上海商派员工亲友购</Text>
      </View>
      <View className='select'>
        <View className='select-title'>我是</View>
        <View className='select-options'>
          {options.map((item, index) => {
            return (
              <View
                className={classNames('select-friend', {
                  'active': activeIndex === index
                })}
                key={item.title}
                onClick={() => handleOptionClick(index)}
              >
                <Image className='select-pic' src={arrow} />
                <View className='select-content'>{item.title}</View>
              </View>
            )
          })}
        </View>
        <View className='btn-confirm'>
          <button
            className={classNames('confirm', {
              'active': [0,1].includes(activeIndex)
            })}
            onClick={handleConfirmClick}
          >
            确定
          </button>
        </View>
      </View>
      <CompBottomTip />
    </View>
  )
}

SelectRole.options = {
  addGlobalClass: true
}

export default SelectRole
