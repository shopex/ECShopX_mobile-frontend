import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './item.scss'

export default class TradeItem extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    customHeader: false
  }

  render () {
    const { customHeader, info } = this.props

    return (
      <View className='trade-item'>
        {
          customHeader
            ? <View className='trade-item__hd'>
                <Text className='trade-item__shop'>丰收蟹旗舰店</Text><Text className='more'>待付款</Text><Text calssName='more'>{info.status_desc}</Text>
              </View>
            : this.props.renderHeader
        }
        <View className='trade-item__bd'>
          {
            info.order.map((item, idx) => {
              return (
                <View
                  key={idx}
                  className='goods-item'
                >
                  <View className='goods-item__hd'>
                    <Image
                      mode='aspectFill'
                      className='goods-item__img'
                      src={item.pic_path}
                    />
                  </View>
                  <View className='goods-item__bd'>
                    <Text className='goods-item__title'>{item.title}</Text>
                    <Text className='goods-item__desc'>{item.goods_props}</Text>
                  </View>
                  <View className='goods-item__ft'>
                    <price className='goods-item__price' value={item.image_default_id}></price>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
