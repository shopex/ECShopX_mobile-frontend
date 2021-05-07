/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/pages/store/list.js
 * @Date: 2021-05-06 17:14:15
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-05-07 18:10:38
 */
import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Picker, Input, Image } from '@tarojs/components'
import { NavBar, Loading } from '@/components'
import api from '@/api'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import entry from '@/utils/entry'
import StoreListItem from './comps/list-item'

import './list.scss'


@connect(({ colors }) => ({
  colors: colors.current || { data: [{}] }
}))
@withPager
@withBackToTop
export default class StoreList extends Component {

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      query: {
        name: '',
        area: [],
        lat: '',
        lng: ''
      },
      // 当前位置信息
      location: {},
      // 收货地址信息
      deliveryInfo: {},
      // 是否是推荐门店列表
      isRecommedList: false,
      // 门店列表
      list: []
    }
  }

  componentDidMount () {
    this.init()
  }

  config = {
    navigationBarTitleText: '店铺列表'
  }

  // 定位并初始化处理位置信息
  init = async () => {
    await entry.getLocal(true)
    const lnglat = Taro.getStorageSync('lnglat') || {}
    const address = lnglat.latitude ? `${lnglat.city}${lnglat.district}${lnglat.street}${lnglat.street_number}` : ''
    this.setState({
      location: {
        ...lnglat,
        address
      }
    }, () => {
      this.resetPage(() => {
        this.setState({
          list: []
        }, () => {
          this.nextPage()
        })
      })
    })
  } 

  // 省市区选择器
  regionChange = (region) => {
    const { value } = region.detail
    const { query } = this.state
    this.setState({
      query: {
        ...query,
        area: value
      }
    })
    console.log(region.detail)
  }

  // 搜索店铺名称
  inputStoreName = (e) => {
    const { detail } = e
    const { query } = this.state
    this.setState({
      query: {
        ...query,
        name: detail.value
      }
    })
  }

  clearName = () => {
    const { query } = this.state
    this.setState({
      query: {
        ...query,
        name: ''
      }
    })
  }

  // 确认搜索
  confirmSearch = () => {
    this.resetPage(() => {
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
    })
  }

  async fetch (params) {
    const { query: searchParam, location } = this.state
    const { latitude = '', longitude = '' } = location
    const { page_no: page, page_size: pageSize } = params
    const query = {
      ...searchParam,
      page,
      pageSize,
      lat: latitude,
      lng: longitude
    }
    const { list, total_count: total} = await api.shop.list(query)
    this.setState({
      list: [...this.state.list, ...list],
      query
    })
    return {
      total
    }
  }

  // 选择门店
  handleClickItem = (info) => {
    console.log(info)
  }

  // 获取定位信息
  getLocation = async () => {
    const { authSetting } = await Taro.getSetting()
    if (!authSetting['scope.userLocation']) {
      Taro.authorize({
        scope: 'scope.userLocation',
        success: () => {
          this.init()
        },
        fail: () => {
          Taro.showModal({
            title: '提示',
            content: '请打开定位权限',
            success: async resConfirm => {
              if (resConfirm.confirm) {
                await Taro.openSetting()
                const setting = await Taro.getSetting()
                if (setting.authSetting['scope.userLocation']) {
                  this.init()
                } else {
                  Taro.showToast({ title: "获取定位权限失败", icon: "none" })
                }
              }
            }
          })
        }
      })
    } else {
      this.init()
    }
  }

  render () {
    const { scrollTop, query, list, location, isRecommedList, deliveryInfo, page } = this.state
    const { colors } = this.props

    return (
      <View className='page-store-list'>
        <NavBar
          title='选择店铺'
          leftIconType='chevron-left'
        />
        <View className='search'>
          <View className='main'>
            <Picker mode='region' value={query.area} onChange={this.regionChange.bind(this)}>
              <View className='filterArea'>
                <View className='areaName'>{ query.area.join('') || '筛选地区' }</View>
                <View className='iconfont icon-arrowDown'></View>
              </View>
            </Picker>
            <Input
              className='searchInput'
              placeholder='请输入想搜索的店铺'
              confirmType='search'
              value={query.name}
              onInput={this.inputStoreName.bind(this)}
              onConfirm={this.confirmSearch.bind(this)}
            />
            { (query.name && query.name.length > 0) && <View className='iconfont icon-close' onClick={this.clearName.bind(this)}></View> }
          </View>
        </View>
        {
          !isRecommedList ? <View className='content'>
            <View className='location'>
              <View className='title'>当前位置</View>
              <View className='locationData'>
                <View className='lngName'>
                  { location.address || '无法获取您的位置信息'}
                </View>
                <View
                  className='resetLocal'
                  style={`color: ${colors.data[0].primary}`}
                  onClick={this.getLocation.bind(this)}
                >
                  <View className='iconfont icon-target'></View>
                  重新定位
                </View>
              </View>
            </View>
            {
              !deliveryInfo.name && <View className='delivery'>
                <View className='title'>按收货地址定位</View>
                <View className='locationData'>
                  <View className='lngName'>上海市浦东新区陆家嘴西路3888-1上海市浦东新区陆家嘴西路3888-1</View>
                </View>
              </View>
            }
          </View> : <View className='noContent'>
            <Image
              className='img'
              src='https://store-images.s-microsoft.com/image/apps.1081.13510798886607585.e5e9691e-c9bf-4ee0-ae21-cc7601c0cee5.03207cec-5f89-409c-aec9-3253099cfced?mode=scale&q=90&h=270&w=270&background=%230078D7'
              mode='aspectFill'
            />
            <View className='tip'>
              您想要地区的店铺暂时未入驻网上商城
            </View>
          </View>
        }
        <View className={`list ${ deliveryInfo.name && 'noDelivery'} ${isRecommedList && 'recommedList'}`}>
          {
            !isRecommedList
              ? <View className='title'>附近门店</View>
              : <View className='recommed'>
                <View className='title'>推荐门店</View>
              </View>
          }
          <ScrollView
            className='scroll'
            scrollY
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll.bind(this)}
            onScrollToLower={this.nextPage.bind(this)}
          >
            {
              list.map(item => <StoreListItem
                info={item}
                key={item.distributor_id}
                onClick={this.handleClickItem.bind(this, item)}
              />)
            }
            {page.isLoading ? <Loading>正在加载...</Loading> : null}
          </ScrollView>
        </View>
        <View
          className='bottom'
          style={`color: ${colors.data[0].primary}`}
        >
          我是旗舰店名称
          <View className='iconfont icon-arrowRight'></View>
        </View>
      </View>
    )
  }
}
