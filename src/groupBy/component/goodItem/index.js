/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 商品Item
 * @FilePath: /unite-vshop/src/groupBy/component/goodItem/index.js
 * @Date: 2020-04-24 09:46:24
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-15 17:09:10
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import BuyContorl from '../buyContorl'
import './index.scss'

export default class GoodItem extends Component {

  static defaultProps = {
    goodInfo: {},
    // 是否结束
    isEnd: false,
    // 是否显示最近购买
    ShowBuyer: false,
    // 是否显示选择框
    ShowCheckBox: false,
    // 是否显示过期
    isExpired: false,
    // 数量为1时是否可以继续减少
    isCanReduce: false
  }
  
  constructor(props) {
    super(props)
  }

  // 调整购买数量
  setGoodNum = (itemId, type) => {
    // 调取父组件事件
    this.props.onSetGoodNum && this.props.onSetGoodNum(itemId, type)
  }

  // 选中事件
  handleCheck = (itemId, e) => {
    e.stopPropagation()
    // 调用父组件事件
    this.props.onCheckItem && this.props.onCheckItem(itemId)
  }

  // 点击跳转
  handleItem = (itemId) => {
    Taro.navigateTo({
      url: `/groupBy/pages/goodDetail/index?itemId=${itemId}`
    })
  }

  render () {
    const { goodInfo, isEnd, ShowBuyer, ShowCheckBox, isExpired, isCanReduce } = this.props

    return (
      <View className='goodItem' onClick={this.handleItem.bind(this, goodInfo.itemId)}>
        {
          ShowCheckBox &&
          <View
            className={`checkBox ${goodInfo.isChecked && 'isChecked'}`}
            onClick={this.handleCheck.bind(this, goodInfo.itemId)}
          >
            {goodInfo.isChecked && <AtIcon value='check' size='12' color='#fff'></AtIcon>}
          </View>
        }
        <View className='left'>
          <Image src={goodInfo.pics} className='goodImg' />
        </View>
        <View className='right'>
          <View className='goodItem-info'>
            <View className='name'>{ goodInfo.itemName }</View>
            <View className='desc'>{ goodInfo.brief }</View>
          </View>
          <View className='otherInfo'>
            <View className='otherInfoLeft'>
              <View className='vipTag'>会员专享</View>
              <View className='price'>
                <Text className='symbol'>¥</Text>{ goodInfo.activity_price }
                <View className='oldPrice'>{ goodInfo.price }</View>
              </View>
            </View>
            {
              !isExpired ? <View className='otherInfoRight'>
                { true && <View className='limit'>限购{ goodInfo.limit_num }件</View>}
                <BuyContorl
                  isEnd={isEnd}
                  quantity={goodInfo.num}
                  isCanReduce={isCanReduce}
                  addQuantity={this.setGoodNum.bind(this, goodInfo.itemId, 'add')}
                  reduceQuantity={this.setGoodNum.bind(this, goodInfo.itemId, 'reduce')}
                />
              </View>
              : <View className='otherInfoExpired'>已过期</View>
            }
          </View>
          {
            ShowBuyer &&goodInfo.history_data.length > 0 && <View className='buyer'>
              最近购买
              <View className='recent'>
                {
                  goodInfo.history_data.map((item, index) => (
                    <Image style={`left: -${Taro.pxTransform(index * 20)}px`} key={item} className='buyAvatar' src='https://pic1.zhimg.com/v2-d8bbab30a2a4db2fe03213ef3f9b50e8_r.jpg' />
                  ))
                }
              </View>
              <View className='num'>
                { goodInfo.initial_sales }人...
              </View>
            </View>
          }
        </View>
      </View>
    )
  }
}