/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/item/comps/share-panel.js
 * @Date: 2021-04-01 17:21:58
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-04-14 11:14:14
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtFloatLayout } from 'taro-ui'

import './share-panel.scss';

export default class SharePanel extends Component {
  static defaultProps = {
    info: null,
    onClose: () => {},
    onClick: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  onClickShareTimeline = () => {
    console.log('onClickShareTimeline')
  }

  render () {
    const { isOpen, onClose, onClick } = this.props

    return (
      <AtFloatLayout
        isOpened={isOpen}
        title=''
        onClose={onClose}
        scrollX={false}
        scrollY={false}
      >
        <View className='share-panel'>
          <View className='share-panel__item' >
            <Button
              onClick={this.onClickShareTimeline.bind(this)}
              className='icon-weChart'
            >
            </Button>
            <View>分享到朋友圈</View>
          </View>
          <View className='share-panel__item'>
            <Button
              openType='share'
              className='icon-weChart'
            >
            </Button>
            <View>分享给微信好友</View>
          </View>
          <View className='share-panel__item' onClick={onClick}>
            <View className='icon-picture1'></View>
            <View>海报分享</View>            
          </View>
        </View>
      </AtFloatLayout>
    )
  }
}
