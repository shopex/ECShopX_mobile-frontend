/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description:  订单列表
 * @FilePath: /feat-Unite-group-by/src/groupBy/pages/orderList/index.js
 * @Date: 2020-05-09 10:17:35
 * @LastEditors: Arvin
 * @LastEditTime: 2020-05-09 17:49:26
 */
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { NavBar } from '@/components'
import OrderItem from '../../component/orderItem'
import LoadingMore from '../../component/loadingMore'

import './index.scss'

export default class OrderList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      tabsCurrent: 0,
      isRefresh: false,
      isLoading: false,
      isEnd: false
    }
  }

  config = {
    navigationBarTitleText: '我的订单'
  }

  // 切换tabs
  handleTabs = (index) => {
    const { tabsCurrent } = this.state

    if (tabsCurrent === index) return
    
    this.setState({
      tabsCurrent: index
    })
  }

    // 下拉刷新
    handleRefresh = () => {
      this.setState({
        isRefresh: true
      })
  
      setTimeout(() => {
        this.setState({
          isRefresh: false,
          isEnd: false
        })
      }, 1000)
    }
  
    // 上拉加载
    handleLoadMore = () => {
      const { isLoading, isEnd } = this.state
      if (isEnd || isLoading) return
      this.setState({
        isLoading: true
      })
      setTimeout(() => {
        this.setState({
          isLoading: false,
          isEnd: true
        })
      }, 1500)
    }

  render () {
    const tabs = ['全部', '待支付', '待取货', '已完成']
    const { tabsCurrent, isRefresh, isLoading, isEnd } = this.state
    return (
      <View className='orderList'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='orderListTabs'>
          {
            tabs.map((item, index) => (
              <View 
                className={`tabsItem ${index === tabsCurrent && 'active'}`}
                key={item}
                onClick={this.handleTabs.bind(this, index)}
              >
                { item }
              </View>
            ))
          }
        </View>
        <ScrollView
          className='order-list'
          scrollY
          scroll-anchoring
          refresherEnabled
          scrollWithAnimation
          refresherTriggered={isRefresh}
          onRefresherRefresh={this.handleRefresh}
          onScrollToLower={this.handleLoadMore}
        >
          { [0].map(item => <OrderItem key={item} />) }
          {/* 加载更多 */}
          <LoadingMore isLoading={isLoading} isEnd={isEnd} />
          {/* 防止子内容无法支撑scroll-view下拉刷新 */}
          <View style='width:2rpx;height:2rpx;bottom:-2rpx;position:absolute;' />
        </ScrollView>
      </View>
    )
  }
}