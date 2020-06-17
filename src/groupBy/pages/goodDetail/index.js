/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 商品详情
 * @FilePath: /unite-vshop/src/groupBy/pages/goodDetail/index.js
 * @Date: 2020-05-07 09:58:08
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-17 18:28:48
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Text, Canvas } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import { NavBar, SpHtmlContent } from '@/components'
import api from '@/api'
import CanvasUtil from '../../utils/canvas'

import './index.scss'

export default class GoodDetail extends Component {

  constructor (props) {
    super(props)
    this.state = {
      goodInfo: {
        deliveryDate: '',
        goodName: '',
        goodDesc: '',
        pics: [],
        price: '0.00',
        activityPrice: '0.00',
        initialSales: 0,
        historyData: [],
        intro: '',
        leaderName: '',
        address: ''
      },
      timeId: '',
      imgCurrent: 0,
      posterImg: '',
      showPoster: false,
      countTime: 0
    }
  }

  componentDidMount () {
    this.getGoodInfo()
  }

  componentWillUnmount () {
    let { timeId } = this.state
    if (timeId) {
      clearTimeout(timeId)
    }
  }

  config = {
    navigationBarTitleText: '商品详情'
  }

  // 倒计时
  countdown = () => {
    let { countTime, timeId } = this.state
    if (countTime > 0) {
      timeId = setTimeout(() => {
        this.setState({
          countTime: countTime - 1
        }, () => {
          this.countdown()
        })
      }, 1000)
    } else {
      // 清除倒计时
      timeId = ''
      clearTimeout(timeId)
    }
    this.setState({
      timeId
    })
  }

  // 格式化时间
  formatCountTime = (time) => {
    const format = (val) => (val > 9) ? val : `0${val}`
    const d = Math.floor(time / (24*3600))
    const h = Math.floor(time % (24*3600) / 3600)
    const m = Math.floor(time % 3600 / 60)
    const s = Math.floor(time % 60)
    return `${d}天${format(h)}:${format(m)}:${format(s)}`
  }
  // 获取商品详情
  getGoodInfo = () => {
    const { itemId, activeId } = this.$router.params
    const currentCommunity = Taro.getStorageSync('community')

    api.groupBy.activityGoodDetail({
      item_id: itemId,
      activity_id: activeId,
      community_id: currentCommunity.community_id,
    }).then(res => {
      const { item, activity, history_data, community } = res
      this.setState({
        goodInfo: {
          pics: item.pics,
          goodDesc: item.brief,
          goodName: item.itemName,
          price: (item.price / 100).toFixed(2),
          initialSales: activity.item.initial_sales,
          deliveryDate: activity.delivery_date,
          historyData: history_data,
          activityPrice: (activity.item.activity_price / 100).toFixed(2),
          intro: item.intro,
          leaderName: community.leader_name,
          address: community.address
        },
        countTime: activity.last_second
      }, () => {
        this.countdown()
      })
    })
  }

  // 图片切换
  swiperImgChange = (e) => {
    const { current } = e.detail
    this.setState({
      imgCurrent: current
    })
  }

  // 前往购物车
  goCart = () => {
    Taro.reLaunch({
      url: '/groupBy/pages/cart/index'
    })
  }
  // 立即购买
  handleBuy = () => {
    this.drawCanvas()
  }

  // canvas 绘制
  drawCanvas = async () => {
    Taro.showLoading({
      mask: true,
      title: '请稍等'
    })
    const {goodInfo } = this.state
    const ctx = Taro.createCanvasContext('poster', this)
    const canvas = new CanvasUtil(ctx, Taro)
    canvas.drawCanvas(375, 640, goodInfo, () => {
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'poster',
      }).then(res => {
        this.setState({
          showPoster: true,
          posterImg: res.tempFilePath
        })
        Taro.hideLoading()
      }).catch(err => console.log(err))
    })
  }

  // 禁止触摸穿透
  stopTouch = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  render () {
    const { goodInfo, imgCurrent, posterImg, showPoster, countTime } = this.state

    return (
      <View className='goodDetail'>
        <NavBar
          title={this.config.navigationBarTitleText}
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='goodImg'>
          <Swiper
            className='swiperImg'
            onChange={this.swiperImgChange.bind(this)}
          >
            {
              goodInfo.pics.map(item => (
                <SwiperItem 
                  key={item}
                  className='swiperItem'
                >
                  <Image className='itemImg' src={item}></Image>
                </SwiperItem>
              ))
            }
          </Swiper>
          <View className='showCurrent'>{ (imgCurrent + 1) } / { goodInfo.pics.length }</View>
        </View>
        {/* 倒计时 */}
        <View className='timeDown'>
          <Text className='title'>仅剩{ this.formatCountTime(countTime) }</Text>
        </View>
        {/* 详情 */}
        <View className='info'>
          {/* 商品名称 */}
          <View className='goodName'>
          <View className='name'>{ goodInfo.goodName }</View>
            <View className='saled'>已售: 9210</View>
          </View>
          {/* 商品说明 */}
          <View className='desc'>
            { goodInfo.goodDesc }
          </View>
          {/* 预计送达 */}
          <View className='arrivals'>预计送达：{ goodInfo.deliveryDate }</View>
          {/* 标签 */}
          <View className='tag'>会员享受</View>
          {/* 价格 */}
          <View className='price'>
            ¥
            <Text className='now'>{ goodInfo.activityPrice }</Text>
            <Text className='old'>{ goodInfo.price }</Text>
          </View>
          {/* 最近下单 */}
          <View className={`recenter ${ goodInfo.historyData.length <= 0 && 'noHistoryData'}`}>
            <View className='title'>最近下单</View>
            <View className='recenterList'>
              <View className='avatarContent'>
                {
                  goodInfo.historyData.map(item => (
                    <Image key={item} className='buyAvatar' src='https://pic1.zhimg.com/v2-d8bbab30a2a4db2fe03213ef3f9b50e8_r.jpg' />
                  ))
                }
              </View>
              <View className='sumBuyer'>
                { goodInfo.initialSales }人...
                <View className='iconfont icon-arrowRight'></View>
              </View>
            </View>
          </View>
          {/* 其他规格信息 */}
          <View className='otherInfo'>
            <View className='title'>商品信息: </View>
            {goodInfo.intro && <SpHtmlContent content={goodInfo.intro} className='richText' />}
          </View>
        </View>
        {/* 底部购物bar */}
        <View className='cartBar'>
            <View className='cartBag' onClick={this.goCart.bind(this)}>
              <View className='iconfont icon-shop'></View>
              购物袋
            </View>
            <View className='immediately' onClick={this.handleBuy.bind(this)}>立即抢购</View>
        </View>
        {/* 海报 */}
        <Canvas canvasId='poster' style='width: 375px; height: 640px;' className='posterCanvas' />
        {
          showPoster && <View className='imgContent' onTouchMove={this.stopTouch}>
            <Image className='posterImg' mode='widthFix' src={posterImg} />
            <View className='closePoster' onClick={() => { this.setState({showPoster: false})}}>关闭</View>
          </View>
        }
      </View>
    )
  }
}
