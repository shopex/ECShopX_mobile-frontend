/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 支付订单
 * @FilePath: /feat-Unite-group-by/src/groupBy/pages/payOrder/index.js
 * @Date: 2020-05-08 15:07:31
 * @LastEditors: Arvin
 * @LastEditTime: 2020-05-08 18:39:24
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { NavBar } from '@/components'

import './index.scss'

export default class PayOrder extends Component {

  config = {
    navigationBarTitleText: '订单详情'
  }
  
  render () {
    return (
      <View className='payOrder'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='orderInfo'>
          {/* 配送地址 */}
          <View className='address'>
            <View className='time'>预计送达: 2020/05/09 18:00</View>
            <View className='community'>缤纷小区</View>
            <View className='unit'>提货：九幢2单元101</View>
          </View>
          {/* 商品详情 */}
          <View className='infoLine'>
            <View className='goodImg'>
              {
                [0, 1, 3].map(item => (
                  <Image key={item} src='https://www.xiantao.com/uploads/allimg/180604/4-1P6041H313-50.jpg' className='img' />
                ))
              }
            </View>
            <View className='sum'>
              共3件
              <View className='iconfont icon-arrowRight'></View>
            </View>
          </View>
          <View className='infoLine'>
            <Text>商品总价</Text>
            <Text>¥25.50</Text>
          </View>
          <View className='infoLine'>
            <View>会员优惠</View>
            <View>-¥7.50</View>
          </View>
          <View className='infoLine flexEnd'>
            <Text>需支付： <Text className='price'>¥15.50</Text></Text>
          </View>
        </View>
        {/* 支付 */}
        <View className='payBar'>
          <View className='sum'>合计: <Text className='price'>¥10.00</Text></View>
          <View className='goPay'>去支付</View>
        </View>
      </View>
    )
  }
}