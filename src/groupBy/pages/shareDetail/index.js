/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 分享进入详情
 * @FilePath: /feat-Unite-group-by/src/groupBy/pages/shareDetail/index.js
 * @Date: 2020-05-09 18:00:27
 * @LastEditors: Arvin
 * @LastEditTime: 2020-05-11 10:39:51
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import BuyerItem from '../../component/buyerItem'

import './index.scss'

export default class ShareDetail extends Component {
  
  config = {
    navigationBarTitleText: '分享详情'
  }

  render () {
    return (
      <View className='shareDetail'>
        <View className='shareHeader'>
          <View className='addressInfo'>
            <View className='community'>收货小区</View>
            <View className='address'>取货：缤纷小区11幢2单元101</View>
          </View>
          <View className='goodInfo'>
            <Image className='goodImg' src='https://img12.360buyimg.com/n7/jfs/t25312/134/1983666171/147642/a17b1b62/5bc19e2eNf9565de8.jpg' />
            {/* 倒计时 */}
            <View className='timeDown'>
              <Text className='title'>仅剩</Text>
              <AtCountdown 
                isShowDay
                day={2}
                hours={1}
                minutes={1}
                seconds={10}
              />
            </View>
            {/* 详情 */}
            <View className='info'>
              {/* 商品名称 */}
              <View className='goodName'>
                <View className='name'>阿巴斯都播哦吧都啊阿巴斯都播哦吧都啊阿巴斯都播哦吧都啊</View>
                <View className='saled'>已售: 9210</View>
              </View>
              {/* 商品说明 */}
              <View className='desc'>
                阿巴斯都播哦吧阿巴斯都播
              </View>
              {/* 预计送达 */}
              <View className='arrivals'>预计送达：2020-05-13 18:00</View>
              {/* 标签 */}
              <View className='tag'>会员享受</View>
              {/* 价格 */}
              <View className='price'>
                ¥
                <Text className='now'>10.00</Text>
                <Text className='old'>12.00</Text>
              </View>
            </View>
          </View>
        </View>
        {/* 推荐商品 */}
        <View className='recommend'>
          <View className='recommendTitle'>推荐商品</View>
          <ScrollView scrollX className='recommendGood'>
            {
              [0, 1, 2, 3, 4].map(item => (
              <View className='goodItem' key={item}>
                <Image className='goodImg' src='https://img12.360buyimg.com/n7/jfs/t25312/134/1983666171/147642/a17b1b62/5bc19e2eNf9565de8.jpg' />
                <View className='goodName'>
                  <View className='name'>推荐商品名称推荐商品名称推荐商品名称</View>
                  <View className='price'>
                    券后价
                    <Text className='text'>10.00元</Text>
                  </View>
                </View>
              </View>))
            }
          </ScrollView>
        </View>
        {/* 当前购买人数 */}
        <View className='buyNumNow'>
          <View className='buyNum'>当前购买人数</View>
          <View className='num'>986人</View>
        </View>
        {
          [0, 1, 3, 4, 5, 6, 7, 8].map(item => <BuyerItem key={item} />)
        }
      </View>
    )
  }
}