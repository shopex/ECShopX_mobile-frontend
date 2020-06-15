/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 购物车goodItem
 * @FilePath: /unite-vshop/src/groupBy/component/cartList/index.js
 * @Date: 2020-04-30 18:43:03
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-15 17:12:04
 */
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Button } from '@tarojs/components'
import { AtSwipeAction, AtModal, AtModalAction } from 'taro-ui'
import api from '@/api'
import GoodItem from '../goodItem'

import './index.scss'


export default class cartList extends Component {

  static defaultProps = {
    list: [],
    // 失效商品
    failureList: [],
    isCanReduce: false
  }

  constructor (props) {
    super(props)
    const list = props.list.map(item => {
      item.isOpened = false
      return item
    })
    this.state = {
      goodList: list,
      isRefresh: false,
      modalStatus: false,
      // 要删除的商品id
      deleteId: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    const list = nextProps.list.map(item => {
      item.isOpened = false
      return item
    })
    this.setState({
      goodList: list
    })
  }

  // 只展示一个滑动
  handleSingle = (index, isClose = false) => {
    let { goodList} = this.state
    if (isClose) {
      goodList[index].isOpened = false
    } else {
      for (let i = 0; i < goodList.length; i++) {
        if (i === index) {
          goodList[i].isOpened = true
        } else {
          goodList[i].isOpened = false
        }
      }
    }
    this.setState({
      goodList
    })
  }

  // 修改商品数量
  setGoodNum = (itemId, type) => {
    const { goodList } = this.state
    const index = goodList.findIndex(item => item.itemId === itemId)
    const num = goodList[index].num
    if (type === 'add') {
      goodList[index].num = num ? (num + 1) : 1
    } else {
      if (num && num > 1) {
        goodList[index].num = num - 1
      }
    }
    api.groupBy.updateGoodNum({
      cart_id: goodList[index].itemId,
      num: goodList[index].num 
    }).then(() => {  
      this.setState({
        goodList
      })
    })
  }

  // 修改选中状态
  setCheck = (itemId) => {
    const { goodList } = this.state
    const index = goodList.findIndex(item => item.itemId === itemId)
    const { isChecked = false } = goodList[index]
    goodList[index].isChecked = !isChecked
    api.groupBy.updateCheckGood({
      cart_id: itemId,
      is_checked: !isChecked
    }).then(() => {
      // 是否全选
      const isCheckAll = goodList.some(item => !item.isChecked)
      this.props.onSetChekckAll && this.props.onSetChekckAll(isCheckAll, false)
      this.setState({
        goodList
      })
    })
  }

  // 全选
  setCheckAll = (isChecked) => {
    const { goodList } = this.state
    const checkId = goodList.map(item => {
      item.isChecked = isChecked
      return item.itemId
    })
    Taro.showLoading({
      title: '请稍等',
      mask: true
    })
    api.groupBy.updateCheckGood({
      cart_id: checkId,
      is_checked: isChecked
    }).then(() => {
      Taro.hideLoading()
      this.setState({
        goodList
      })
    })    
  }

  // 删除
  handleDelete = () => {
    const { goodList, deleteId } = this.state
    const index = goodList.findIndex(item => item.itemId === deleteId)
    goodList.splice(index, 1)
    this.setState({
      goodList,
      modalStatus: false
    })
  }

  // 切换弹出框
  toogleModal = (status, id) => {
    this.setState({
      modalStatus: status,
      deleteId: id
    })
  }

  // 下拉刷新
  handleRefresh = () => {
    this.setState({
      isRefresh: true
    })
    
    this.props.onRefresh && this.props.onRefresh(() => {
      this.setState({
        isRefresh: false
      })
    })
  }  

  render () {
    const options = [
      {
        text: '删除',
        style: {
          backgroundColor: '#FF4949'
        }
      }
    ]
    const { goodList, isRefresh, modalStatus } = this.state

    const { failureList, isCanReduce } = this.props

    return (
      <View className='cartList'>
        <ScrollView
          className='list'
          scrollY
          scroll-anchoring
          refresherEnabled
          scrollWithAnimation
          refresherTriggered={isRefresh}
          onRefresherRefresh={this.handleRefresh}
        >
          {
            goodList.map((item, index)=> (
              <AtSwipeAction
                options={options}
                autoClose
                key={item.itemId}
                isOpened={item.isOpened}
                onOpened={this.handleSingle.bind(this, index, false)}
                onClosed={this.handleSingle.bind(this, index, true)}
                onClick={this.toogleModal.bind(this, true, item.itemId)}
              >
                <GoodItem 
                  ShowCheckBox 
                  isCanReduce={isCanReduce}
                  goodInfo={item} 
                  onSetGoodNum={this.setGoodNum.bind(this)} 
                  onCheckItem={this.setCheck.bind(this)}
                />
              </AtSwipeAction>
            ))
          }
          {
            failureList.length > 0
            && <View className='failure'>
              <View className='failureTitle'>
                <View>失效商品</View>
                <View>清空</View>
              </View>
              <View className='failureList'>
                {
                  failureList.map(item => (
                    <GoodItem 
                      key={item.itemId}
                      isExpired
                      goodInfo={item} 
                    />
                  ))
                }
              </View>
            </View>
          }
          {
            goodList.length <= 0 && failureList.length <= 0 && <View className='empty'>
              暂无数据
            </View>
          }
        </ScrollView>
        <AtModal
          isOpened={modalStatus}
        >
          <View className='myModal'>确认要删除该商品吗?</View>
          <AtModalAction>
            <Button onClick={this.toogleModal.bind(this, false)}>取消</Button>
            <Button onClick={this.handleDelete.bind(this)}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
