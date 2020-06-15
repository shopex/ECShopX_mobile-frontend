/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 分类组件
 * @FilePath: /feat-Unite-group-by/src/groupBy/component/classification/index.js
 * @Date: 2020-06-12 13:27:40
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-12 14:32:38
 */ 
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'

export default class Classification extends Component {
  render () {
    return (
      <View className='classification'>
        {
          [0, 1, 3, 4, 5, 5, 6, 5].map(item => (
            <View className='menuItem' key={item}>
              <Image className='img' src='https://picsum.photos/id/1036/200/200' />
              <View className='name'>
                菜单{ item }
              </View>
            </View>
          ))
        }
      </View>
    )
  }
}