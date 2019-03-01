import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './goods-grid.scss'

export default class WgtGoodsGrid extends Component {
  static options = {
    addGlobalClass: true
  }

  navigateTo (url) {
    Taro.navigateTo({ url })
  }

  render () {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { base, data, config } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {base.title && (
          <View className='wgt__header'>
            <View className='wgt__title'>
              <Text>{base.title}</Text>
              <View className='wgt__subtitle'>{base.subtitle}</View>
            </View>
            <View
              className='wgt__more'
              onClick={this.navigateTo.bind(this, '/pages/item/list')}
            >
              <View className='three-dot'></View>
            </View>
          </View>
        )}
        <View className='wgt-body with-padding'>
          <View className='grid-goods out-padding'>
            {data.map((item, idx) => (
              <View
                key={idx}
                className='grid-item'
                onClick={this.navigateTo.bind(this, `/pages/item/detail?id=${item.goodsId}`)}
              >
                <View className='goods-wrap'>
                  <View className='thumbnail'>
                    <Image
                      className='goods-img'
                      src={item.imgUrl}
                      mode='aspectFill'
                    />
                  </View>
                  <View className='caption'>
                    {config.brand && item.brand && (
                      <Image
                        className='goods-brand'
                        src={item.brand}
                        mode='aspectFill'
                      />
                    )}
                    <View className={`goods-title ${!config.brand || !item.brand ? 'no-brand' : ''}`}>{item.title}</View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }
}
