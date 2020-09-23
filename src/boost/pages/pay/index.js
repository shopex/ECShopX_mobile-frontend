/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 结算页面
 * @FilePath: /unite-vshop/src/boost/pages/pay/index.js
 * @Date: 2020-09-23 16:49:53
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-23 18:33:40
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

export default class Pay extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.getOrderInfo()
  }

  async getOrderInfo () {
    
  }

  render () {
    return (
      <View>
        Pay
      </View>
    )
  }  
}