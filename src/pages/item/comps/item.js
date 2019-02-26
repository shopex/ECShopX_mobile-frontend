import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Price } from '@/components'

import './item.scss'

export default class Item extends Component {
  static options = {
    addGlobalClass: true
  }

  render () {
    const { info, onClick } = this.props

    return (
      <View className='goods-item' onClick={onClick}>
        <View className='goods-item__hd'>
          <Image
            className='goods-item__img'
            mode='aspectFit'
            src={info.image_default_id}
          />
        </View>
        <View className='goods-item__bd'>
          <Text className='goods-item__title'>{info.title}</Text>
          <View className='goods-item__extra'>
            <Text className='goods-item__sold'>{info.sold_quantity} 人已购买</Text>
          </View>
          <View className='goods-item__prices'>
            <Price
              value={info.price}
              primary
            />
            <Price
              classes='goods-item__price-market'
              value={info.price}
            />
          </View>
        </View>
      </View>
    )
  }
}
