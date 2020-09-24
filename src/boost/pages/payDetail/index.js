/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 结算详情页面
 * @FilePath: /unite-vshop/src/boost/pages/payDetail/index.js
 * @Date: 2020-09-23 16:49:53
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-24 14:00:15
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { pickBy, formatDataTime } from '@/utils'
import api from '@/api'
import { NavBar } from '@/components'

import './index.scss'

export default class PayDetail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: {}
    }
  }

  componentWillMount () {
    this.getOrderInfo()
  }


  config = {
    navigationBarTitleText: '结算页面'
  }
  
  // 获取订单信息
  getOrderInfo = async () => {
    const { bargain_id } = this.$router.params
    const {
      bargain_order = {}
    } = await api.boost.getUserBargain({
      bargain_id,
      has_order: true
    })
    
    this.setState({
      info: pickBy(bargain_order, {
        order_id: 'order_id',
        bargain_id: 'bargain_id',
        item_name: 'item_name',
        item_pics: 'item_pics',
        item_intro: 'item_intro',
        bargain_rules: 'bargain_rules',
        share_msg: 'share_msg',
        receiver_name: 'receiver_name',
        receiver_mobile: 'receiver_mobile',
        receiver_state: 'receiver_state',
        receiver_city: 'receiver_city',
        receiver_district: 'receiver_district',
        receiver_address: 'receiver_address',
        remark: 'remark',
        create_time: ({ create_time }) => formatDataTime(create_time),
        total_fee: ({ total_fee }) => (total_fee / 100).toFixed(2),
      })
    })
  }  
  
  render () {
    const { info } = this.state
    return (
      <View className='payDetail'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='address'>
          <View className='title'>收货信息</View>
          <View className='info'>
            <Text>
              { info.receiver_name }
            </Text>
            <Text>
              { info.receiver_mobile }
            </Text>
          </View>
          <View className='add'>
            { info.receiver_state}{ info.receiver_city }{ info.receiver_district }
            { info.receiver_address }
          </View>
        </View>
      </View>
    )
  }  
}