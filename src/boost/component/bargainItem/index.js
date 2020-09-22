/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 列表item
 * @FilePath: /unite-vshop/src/boost/component/bargainItem/index.js
 * @Date: 2020-09-22 18:21:25
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-22 18:36:08
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default class BargainItem extends Component {
  defaultProps = {
    info: {}
  }
  
  constructor (props) {
    super(props)
  }

  render () {
    const { info } = this.props
    return (
      <View className='bargainItem'>
        { info.item_name }
        <Image src={info.item_pics} mode='aspectFill' />
      </View>
    )
  }
}