import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { GoodsItem } from '@/components'

import './goods-faverite.scss'

export default class WgtGoodsFaverite extends Component {
  static options = {
    addGlobalClass: true
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  handleClickItem = (item) => {
    const url = `/pages/item/espier-detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { info } = this.props
    if (!info) {
      return null
    }


    return (
      <View className='wgt wgt-grid wgt__padded'>
        <View className='wgt-grid__header'>
          <Text className='wgt-grid__title'>
            猜你喜欢
          </Text>
        </View>
        <View className='wgt__body with-padding'>
          <View className='grid-goods out-padding grid-goods__type-grid'>
            {info.map(item => (
              <GoodsItem
                key={item.item_id}
                info={item}
                onClick={() => this.handleClickItem(item)}
              />
            ))}
          </View>
        </View>
      </View>
    )
  }
}
