/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 支付订单
 * @FilePath: /unite-vshop/src/groupBy/pages/payOrder/index.js
 * @Date: 2020-05-08 15:07:31
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-16 14:07:49
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import api from '@/api'
import { NavBar } from '@/components'

import './index.scss'

export default class PayOrder extends Component {

  constructor (props) {
    super(props)
    
    this.state = {
      list: [],
      totalItemNum: 0,
      totalFee: 0,
      itemFee: 0,
      currtent: {},
    }
  }
  
  componentDidMount () {
    this.getCalculateTotal()
  }
  
  config = {
    navigationBarTitleText: '结算'
  }

  getCalculateTotal = () => {
    Taro.showLoading({title: '请稍等...', mask: true})
    const currentCommunity = Taro.getStorageSync('community')
    const { activityId } = this.$router.params
    api.groupBy.getCalculateTotal({
      receipt_type: 'ziti',
      order_type: 'normal_community',
      items: [],
      remark: '',
      community_id: currentCommunity.community_id,
      community_activity_id: activityId,
      member_discount: false,
      coupon_discount: '',
    }).then(res => {
      this.setState({
        orderId: res.order_id,
        list: res.items,
        currtent: currentCommunity,
        totalItemNum: res.totalItemNum,
        totalFee: (res.total_fee / 100).toFixed(2),
        itemFee: (res.item_fee / 100).toFixed(2),
      })
      Taro.hideLoading()
    })
  }
  // 去支付
  handlePay = () => {
    const { orderId } = this.state
    Taro.redirectTo({
      url: `/groupBy/pages/orderDetail/index?orderId=${orderId}`
    })
  }
  
  render () {
    const { 
      currtent,
      list,
      totalFee,
      totalItemNum,
      itemFee
    } = this.state
        
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
            <View className='community'>{ currtent.community_name }</View>
            <View className='unit'>提货：{ currtent.address }</View>
          </View>
          {/* 商品详情 */}
          <View className='infoLine'>
            <View className='goodImg'>
              {
                list.map(item => (
                  <Image key={item.item_id} src={item.pic} className='img' />
                ))
              }
            </View>
            <View className='sum'>
              共{ totalItemNum }件
              <View className='iconfont icon-arrowRight'></View>
            </View>
          </View>
          <View className='infoLine'>
            <Text>商品总价</Text>
            <Text>¥{ itemFee }</Text>
          </View>
          <View className='infoLine'>
            <View>会员优惠</View>
            <View>-¥7.50</View>
          </View>
          <View className='infoLine flexEnd'>
            <Text>需支付： <Text className='price'>¥{ totalFee }</Text></Text>
          </View>
        </View>
        {/* 支付 */}
        <View className='payBar'>
          <View className='sum'>合计: <Text className='price'>¥{ totalFee }</Text></View>
          <View className='goPay' onClick={this.handlePay}>去支付</View>
        </View>
      </View>
    )
  }
}