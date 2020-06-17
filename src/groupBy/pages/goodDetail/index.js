/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 商品详情
 * @FilePath: /unite-vshop/src/groupBy/pages/goodDetail/index.js
 * @Date: 2020-05-07 09:58:08
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-17 15:29:52
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Text, Canvas } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'
import { NavBar } from '@/components'
import api from '@/api'
import CanvasUtil from '../../utils/canvas'

import './index.scss'

export default class GoodDetail extends Component {

  constructor (props) {
    super(props)
    this.state = {
      goodInfo: {
        img: [
          'https://miniso-tw.com.tw/wp-content/uploads/2018/12/37295a0c6b697777c564ea2d188c99a8-300x300.jpg',
          'https://miniso-tw.com.tw/wp-content/uploads/2018/12/4514003134212-300x300.jpg',
          'https://miniso-tw.com.tw/wp-content/uploads/2018/12/c3f2c7034a01d52759d551a0a709114d-300x300.jpg'
        ]
      },
      imgCurrent: 0,
      posterImg: '',
      showPoster: false
    }
  }

  componentDidMount () {
    this.getGoodInfo()
  }

  config = {
    navigationBarTitleText: '商品详情'
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
      console.log(res)
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
    const ctx = Taro.createCanvasContext('poster')
    const canvas = new CanvasUtil(ctx)
    console.log(canvas)
  }

  // canvas 绘制
  drawCanvas = async () => {
    Taro.showLoading({
      mask: true,
      title: '请稍等'
    })
    const ctx = Taro.createCanvasContext('poster', this)
    const canvas = new CanvasUtil(ctx, Taro)
    canvas.drawCanvas(375, 640, () => {
      Taro.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId: 'poster',
      }).then(res => {
        this.setState({
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
    const { goodInfo, imgCurrent, posterImg, showPoster } = this.state

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
              goodInfo.img.map(item => (
                <SwiperItem 
                  key={item}
                  className='swiperItem'
                >
                  <Image className='itemImg' src={item}></Image>
                </SwiperItem>
              ))
            }
          </Swiper>
          <View className='showCurrent'>{ (imgCurrent + 1) } / { goodInfo.img.length }</View>
        </View>
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
          {/* 最近下单 */}
          <View className='recenter'>
            <View className='title'>最近下单</View>
            <View className='recenterList'>
              <View className='avatarContent'>
                {
                  [1, 3, 4, 5, 6, 9, 9].map(item => (
                    <Image key={item} className='buyAvatar' src='https://pic1.zhimg.com/v2-d8bbab30a2a4db2fe03213ef3f9b50e8_r.jpg' />
                  ))
                }
              </View>
              <View className='sumBuyer'>
                230人...
                <View className='iconfont icon-arrowRight'></View>
              </View>
            </View>
          </View>
          {/* 其他规格信息 */}
          <View className='otherInfo'>
            <View className='title'>商品信息</View>
            {
              [0, 1, 3, 4, 5].map(item => (
                <View className='infoItem' key={item}>
                  <View className='name'>产地</View>
                  <View className='content'>马来西亚</View>
                </View>
              ))
            }
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
          </View>
        }
      </View>
    )
  }
}
