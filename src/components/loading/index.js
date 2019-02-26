import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import loadingImg from './loading.gif'
import './index.scss'

export default class Loading extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    return (
      <View className='loading'>
        <Image src={loadingImg} className='loading-img' />
        <Text clasName='loading-text'>{this.props.children}</Text>
      </View>
    )
  }
}
