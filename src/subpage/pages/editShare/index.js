/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 编辑分享
 * @FilePath: /unite-vshop/src/subpage/pages/editShare/index.js
 * @Date: 2021-04-14 15:06:18
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-04-14 17:44:15
 */
import Taro, { Component } from '@tarojs/taro'
import { Textarea, View } from '@tarojs/components'

import './index.scss'

export default class EditShare extends Component {
  constructor(...props) {
    super(...props)
    
    this.state = {
      insertData: [1, 2, 3, 4, 5],
      info: ''
    }
  }

  config = {
    navigationBarTitleText: '编辑分享'
  }

  // 输入分享信息
  inputInfo = (res = {}) => {
    const { detail = {} } = res
    const val = detail.value
    this.setState({
      info: val
    })
  }

  render () {
    const { insertData, info } = this.state
    
    return <View className='editShare'>
      <View className='content'>
        <View>插入数据</View>
        <View className='insertData'>
          {
            insertData.map(item => <View
              className='item'
              key={item}
            >
              插入数据{ item }
            </View>)
          }
        </View>
        <Textarea
          className='textarea'
          onInput={this.inputInfo.bind(this)}
        >
          { info }
        </Textarea>
      </View>
    </View>
  }
}