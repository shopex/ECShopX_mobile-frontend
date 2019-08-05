import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { SpToast, Loading, SpNote, BackToTop } from '@/components'
import ListSearch from '../recommend/comps/list-search'
import api from '@/api'
import { pickBy } from '@/utils'
import { withPager, withBackToTop } from '@/hocs'
import entry from '@/utils/entry'

import './list.scss'

@withPager
@withBackToTop
export default class StoreList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      query: null,
      current: null,
      loading: false
    }
  }

  componentDidMount () {
    const lnglat = Taro.getStorageSync('lnglat')
    let query = {}
    if (lnglat) {
      const { latitude, longitude } = lnglat
      query = {
        lat: lnglat.latitude,
        lng: lnglat.longitude
      }
    }
    const store = Taro.getStorageSync('curStore')
    if (store) {
      this.setState({
        current: store,
        query
      }, () => {
        this.nextPage()
      })
    }

  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const { selectParams, areaList, tagsList, curTagId } = this.state
    const query = {
      ...this.state.query,
      page,
      pageSize
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

  handleConfirm = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        name: val,
      }
    }, () =>{
      this.resetPage()
      this.setState({
        list: []
      }, () => {
        this.nextPage()
      })
    })
  }

  handleGetLocation = async () => {
    this.setState({
      loading: true
    })
    const store = await entry.getLocal()
    if (store) {
      Taro.setStorageSync('curStore', store)
      this.resetPage()
      this.setState({
        current: store,
        loading: false
      }, () => {
        this.nextPage()
      })
    } else {
      this.setState({
        current: null,
        loading: false
      })
    }
  }

  handleMap = (lat, lng) => {
    Taro.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      scale: 18
    })
  }

  handleClick = (val) => {
    Taro.setStorageSync('curStore', val)
    Taro.navigateBack()
  }

  render () {
    const { list, scrollTop, showBackToTop } = this.state

    return (
      <View className='page-store-list'>
        <View class="search-bar">
          <ListSearch
            onConfirm={this.handleConfirm.bind(this)}
          />
        </View>
        <View class="current-store">
          <View className='label'>当前位置</View>
          <View className='content view-flex'>
            <View className='view-flex-item'>
              {
                loading
                  ? <Text className="loading">定位中...</Text>
                  : <Text>{current ? current.store_name : '定位失败...'}</Text>
              }
            </View>
            <View
              className='view-flex view-flex-middle'
              onClick={this.handleGetLocation}
            >重新定位 <Text className='icon-target' /></View>
          </View>
        </View>
        <ScrollView
          className='page-store-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='store-list'>
            {
              list.map(item => {
                return (
                  <View
                    className='store-item'
                    onClick={this.handleClick.bind(this, item)}
                  >
                    <View className='store-content'>
                      <View className="store-name">{item.store_name}</View>
                      <View className="store-address">{item.store_address}</View>
                    </View>
                    {
                      item.lat &&
                        <View
                          className='store-location icon-location'
                          onClick={this.handleMap.bind(this, item.lat, item.lng)}
                        ></View>
                    }
                  </View>
                )
              })
            }
          </View>
        </ScrollView>

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

        <SpToast />
      </View>
    )
  }
}
