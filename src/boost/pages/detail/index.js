/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 助力详情
 * @FilePath: /unite-vshop/src/boost/pages/detail/index.js
 * @Date: 2020-09-22 14:08:32
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-22 17:39:15
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { NavBar, SpHtmlContent } from '@/components'
import api from '@/api'

import './index.scss'

export default class Detail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      adPic: ''
    }
  }
  
  componentDidMount () {
    this.getBoostDetail()
  }
  
  config = {
    navigationBarTitleText: '助力详情'
  }

  // 获取助力详情wechat-taroturntable
  getBoostDetail = async () => {
    const { bargain_id } = this.$router.params
    const data = await api.boost.getDetail({
      template_name: 'yykcutdown',
      name: 'banner',
      page_name: 'pages/kanjia'
    })
    const userBargain = await api.boost.getUserBargain({
      bargain_id,
      has_order: true
    })
    this.setState({
      adPic: data[0].params.ad_pic
    })
    console.log(userBargain)
  }

  render () {
    const goodInfo = {}
    const { adPic } = this.state
    return (
      <View className='home'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='header'>
          <Image className='adPic' src={adPic} mode='aspectFill' />
          <Button>活动规则</Button>
          头部内容
        </View>
        <View className='main'>
          主内容
          {
            goodInfo.intro && !Array.isArray(goodInfo.intro) 
              ? <SpHtmlContent content={goodInfo.intro} className='richText' />
              : <View>暂无详情</View>
          }
        </View>
      </View>
    )
  }
}