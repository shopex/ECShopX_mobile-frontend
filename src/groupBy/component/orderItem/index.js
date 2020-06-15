/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 订单item
 * @FilePath: /feat-Unite-group-by/src/groupBy/component/orderItem/index.js
 * @Date: 2020-05-09 15:10:18
 * @LastEditors: Arvin
 * @LastEditTime: 2020-05-09 16:03:09
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import './index.scss'

export default class OrderItem extends Component {

  constructor (props) {
    super(props)
  }

  // 前往订单详情
  handleItem = () => {
    Taro.navigateTo({
      url: '/groupBy/pages/orderDetail/index'
    })
  }

  // 核销
  handleWriteOff = (e) => {
    e.stopPropagation()
    console.log('核销')
  }

  // 去付款
  handlePay = (e) => {
    e.stopPropagation()
    console.log('去付款')
  }
  render () {
    return (
      <View className='orderItem' onClick={this.handleItem.bind(this)}>
        <View className='orderHeader'>
          <View className='orderNo'>XWXS12312321</View>
          <View className='orderStatus'>待支付</View>
        </View>
        <View className='orderContent'>
          <Image className='goodImg' src='https://www.xiantao.com/uploads/allimg/180604/4-1P6041H313-50.jpg' />
          <View className='goodInfo'>
            <View className='name'>拉上看洪都拉斯你的拉上你的啦看书呢撒打算离开</View>
            <View className='tag'>会员专享</View>
            <View className='price'>
              <View>
                ¥<Text className='now'>10.00</Text>
                <Text className='old'>¥14.00</Text>
              </View>
              <View className='orderNum'>...共3件商品</View>
            </View>
          </View>
        </View>
        <View className='orderAct'>
          <View className='actBtn' onClick={this.handlePay.bind(this)}>去付款</View>
          <View className='actBtn' onClick={this.handleWriteOff.bind(this)}>核销</View>
        </View>
      </View>
    )
  }
}
