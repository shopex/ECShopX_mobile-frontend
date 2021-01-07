/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 首页
 * @FilePath: /unite-vshop/src/pages/newindex.js
 * @Date: 2021-01-06 15:46:54
 * @LastEditors: Arvin
 * @LastEditTime: 2021-01-07 15:56:15
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { TabBar, Loading, SpNote, BackToTop, FloatMenus, FloatMenuItem,AccountOfficial, ScreenAd } from '@/components'
import req from '@/api/req'
import api from '@/api'
import { pickBy, classNames, isArray, normalizeQuerys } from '@/utils'
import entry from '@/utils/entry'
import { withPager, withBackToTop } from '@/hocs'
import S from "@/spx";
import { Tracker } from "@/service"
import { WgtGoodsFaverite, HeaderHome } from './home/wgts'
import HomeWgts from './home/comps/home-wgts'
import Automatic from './home/comps/automatic'

import './home/index.scss'

@connect(({ cart, member, store }) => ({
  store,
  list: cart.list,
  cartIds: cart.cartIds,
  cartCount: cart.cartCount,
  showLikeList: cart.showLikeList,
  showAdv: member.showAdv
}), (dispatch) => ({
  onUpdateLikeList: (show_likelist) => dispatch({ type: 'cart/updateLikeList', payload: show_likelist }),
  onUpdateCartCount: (count) => dispatch({ type: 'cart/updateCount', payload: count })
}))
@withPager
@withBackToTop

export default class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      wgts: [],
      likeList: [],
      isShowAddTip: false,
      curStore: {
        distributor_id: 0
      },
      positionStatus: false,
      automatic: null,
      showAuto: true,
      top: 0,
      isShop: null,
      salesperson_id: '',
      // 店铺精选id
      featuredshop: '',
      // 分享配置
      shareInfo: {},
      is_open_recommend: null,
      is_open_scan_qrcode: null,
      is_open_official_account:null,
      is_open_store_status:null,
      show_official:true,
      showCloseBtn:false,
      // 是否有跳转至店铺页
      isGoStore: false,
      show_tabBar:true
    }
  }

  componentDidMount () {
    this.getHomeSetting()
    this.getShareSetting()
  }

  componentDidShow () {
  }

  // 分享
  onShareAppMessage () {
    const shareInfo = this.shareInfo()
    return {
      ...shareInfo
    }
  }
  
  // 分享朋友圈
  onShareTimeline () {
    const shareInfo = this.shareInfo('time')
    return {
      ...shareInfo
    }
  }

  // 分享
  shareInfo = (type = '') => {
    const res = this.state.shareInfo
    const { userId } = Taro.getStorageSync('userinfo')
    let query = userId ? `/pages/index?uid=${userId}` : '/pages/index'
    if (type) {
      query = userId ? `uid=${userId}` : ''
    }
    const path = type ? 'query' : 'path'
    const params = {
      title: res.title,
      imageUrl: res.imageUrl,
      [path]: query
    }
    return params
  }

  // 获取分享配置
  getShareSetting = async () => {
    const res = await api.wx.shareSetting({shareindex: 'index'})
    this.setState({
      shareInfo: res
    })
  }

  // 获取首页配置
  getHomeSetting = async () => {
    const  { is_open_store_status } = await entry.getStoreStatus()
    const {
      is_open_recommend,
      is_open_scan_qrcode,
      is_open_wechatapp_location,
      is_open_official_account
    } = Taro.getStorageSync('settingInfo')
    const isNeedLoacate = is_open_wechatapp_location == 1
    const options = this.$router.params
    options.isStore = is_open_store_status
    const res = await entry.entryLaunch(options, isNeedLoacate)
    const { store } = res
    if (!isArray(store)) {
      this.setState({
        curStore: store,
        is_open_recommend,
        is_open_scan_qrcode,
        is_open_store_status,
        is_open_wechatapp_location,
        is_open_official_account
      }, () => {
        this.getWgts()
      })
    }
  }

  // 获取挂件配置
  getWgts = async (cb) => {
    const { curStore, is_open_store_status, is_open_recommend } = this.state
    const curdis_id = curStore && is_open_store_status ? curStore.store_id : curStore.distributor_id
    if (!curStore.distributor_id && curStore.distributor_id !== 0) {
      return
    }
    const url = `/pagestemplate/detail?template_name=yykweishop&weapp_pages=index&distributor_id=${curdis_id}` 
    const info = await req.get(url)
    const wgts = isArray(info) ? [] : info.config
    this.setState({
      wgts: wgts.length > 5 ? wgts.slice(0, 5) : wgts
    }, () => {
      // 1s后补足缺失挂件
      setTimeout(() => {
        this.setState({
          wgts
        })
      }, 1000)
      if (cb) {
        cb(info)
      }
      Taro.stopPullDownRefresh()
      if (!isArray(info) && info.config) {
        const searchWgt = info.config.find(item => item.name == 'search')
        this.setState({
          positionStatus: searchWgt && searchWgt.config && searchWgt.config.fixTop
        })
        if (is_open_recommend === 1) {
          this.props.onUpdateLikeList(true)
          this.resetPage()
          this.setState({
            likeList: []
          }, () => {
            this.nextPage()
          })
        } else {
          this.props.onUpdateLikeList(false)
        }
      }
    })
  }

  // 获取猜你喜欢
  async fetch(params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      page,
      pageSize
    }
    const { list, total_count: total } = await api.cart.likeList(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      distributor_id: 'distributor_id',
      origincountry_name: 'origincountry_name',
      origincountry_img_url: 'origincountry_img_url',
      promotion_activity_tag: 'promotion_activity',
      type: 'type',
      price: ({ price }) => (price/100).toFixed(2),
      member_price: ({ member_price }) => (member_price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2),
      desc: 'brief',
    })

    this.setState({
      likeList: [...this.state.likeList, ...nList],
    })

    return {
      total
    }
  } 

  // 跳转选择店铺
  goStore = () => {
    this.setState({
      isGoStore: true
    })
  }

  // 订阅错误事件
  handleOfficialError = () => {}

  // 关闭订阅公众号
  handleOfficialClose = () =>{
    this.setState({
      show_official:false
    })
    Taro.setStorageSync('close_official',true)
  }

  // 注册享大礼品
  handleGift = async () => {
    if (!S.getAuthToken()) {
      setTimeout(() => {
        S.login(this)
      }, 1000)
    }
  }

  // 关闭tips
  handleClickCloseAddTip = () => {
    Taro.setStorage({ key: 'addTipIsShow', data: { isShowAddTip: false } })
    this.setState({
      isShowAddTip: false
    })
  }

  // 跳转店铺页面
  handleClickShop = () => {
    const { featuredshop } = this.state
    Taro.navigateTo({
      url: `/pages/distribution/shop-home?featuredshop=${featuredshop}`
    })
  }

  // 显示浮窗广告
  handleAutoClick = () => {
    const { showAuto } = this.state
    this.setState({
      showAuto: !showAuto
    })
  }

  render () {

    const {
      showAdv,
      show_tabBar,
      isShowAddTip,
      showBackToTop,
      automatic,
      showAuto,
      featuredshop,
      wgts,
      positionStatus,
      curStore,
      is_open_recommend,
      likeList,
      page,
      is_open_official_account,
      is_open_scan_qrcode,
      is_open_store_status,
      show_official
    } = this.state

    // 是否是标准版
    const isStandard = APP_PLATFORM === 'standard'
    // 否是fixed
    const isFixed = positionStatus && (!isStandard || curStore.distributor_id == 0)

    return (
      <View className='page-index'>
        {
          is_open_official_account === 1 && show_official &&
          <AccountOfficial
            isClose
            onHandleError={this.handleOfficialError.bind(this)}
            onClick={this.handleOfficialClose.bind(this)}
          >
          </AccountOfficial>
        }
        {
          isStandard && curStore && 
          <HeaderHome
            store={curStore}
            onClickItem={this.goStore.bind(this)}
            isOpenScanQrcode={is_open_scan_qrcode}
            isOpenStoreStatus={is_open_store_status}
          />
        } 
        <View
          className={
            classNames(
              'wgts-wrap',
              !isStandard && 'wgts-wrap_platform', 
              isFixed ? 'wgts-wrap__fixed' : 'wgts-wrap__fixed_standard',
              !curStore && 'wgts-wrap-nolocation'
            )
          }
        >
          <View className='wgts-wrap__cont'>
            <HomeWgts
              wgts={wgts}
            />
            {
            (likeList.length > 0 && is_open_recommend==1) && (
              <View className='faverite-list'>
                <WgtGoodsFaverite info={likeList} />
                {
                  page.isLoading
                    ? <Loading>正在加载...</Loading>
                    : null
                }
                {
                  !page.isLoading && !page.hasNext && !likeList.length
                  && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
                }
              </View>
            )}
          </View>
        </View>
        {/* 浮动按钮 */}
        <FloatMenus>
          {
            show_tabBar && featuredshop &&
            <Image
              className='distribution-shop'
              src='/assets/imgs/gift_mini.png'
              mode='widthFix'
              onClick={this.handleClickShop.bind(this)}
            />
          }
          {
            automatic && automatic.isOpen && !S.getAuthToken() &&
            <FloatMenuItem
              iconPrefixClass='icon'
              icon='present'
              onClick={this.handleAutoClick.bind(this)}
            />
          }
        </FloatMenus>
        {/* 浮窗广告 */}
        {
          automatic && automatic.isOpen && !S.getAuthToken() &&
          <Automatic
            info={automatic}
            isShow={showAuto}
            onClick={this.handleGift.bind(this)}
            onClose={this.handleAutoClick.bind(this)}
          />
        }
        {/* 返回顶部 */}
        <BackToTop show={showBackToTop} onClick={this.scrollBackToTop.bind(this)} />
        {/* addTip */}
        {
          isShowAddTip && <View className='add_tip'>
            <View class='tip-text'>点击“•●•”添加到我的小程序，微信首页下拉即可快速访问店铺</View>
            <View className='icon-close icon-view' onClick={this.handleClickCloseAddTip.bind(this)}> </View>
          </View>
        }
        {/* tabBar */}
        <TabBar showbar={show_tabBar} />
        {/* 开屏广告 */}
        { showAdv && <ScreenAd /> }
      </View>
    )
  }
}