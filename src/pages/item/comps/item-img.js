import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './item-img.scss'

export default class ItemImg extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  render () {
    const { info } = this.props

    return (
      <View className='item-img'>
        <Image
          className='item-img__img'
          src={info.img}
        />
        <Image
          src={info.img}
          className='item-img__blured'
        />
      </View>
    )
  }
}
