import React, { Component } from 'react';
 import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View } from '@tarojs/components'
import { AtNavBar } from 'taro-ui'
import { classNames, isWeb, isNavbar } from '@/utils'

import './index.scss'

function SpNavBar(props) {
  const { leftIconType = 'chevron-left' } = props
  const { page } = getCurrentInstance()
  const title = page.config?.navigationBarTitleText

  const handleClickLeftIcon = function () {
    Taro.navigateBack()
  }

  if ( !isNavbar() ) {
    return null
  }
  
  return (
    <AtNavBar
      fixed
      color="#000"
      title={title}
      leftIconType={leftIconType}
      onClickLeftIcon={handleClickLeftIcon}
    />
  );
}

SpNavBar.options = {
  addGlobalClass: true
}

export default SpNavBar

