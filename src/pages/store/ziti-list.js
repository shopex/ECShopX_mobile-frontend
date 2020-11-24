import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { SpToast, SearchBar, BackToTop, NavBar,SpCheckbox } from '@/components'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import entry from '@/utils/entry'
import StoreListItem from './comps/list-item'
import { pickBy } from '@/utils'

import './list.scss'

@withPager
@withBackToTop
export default class StoreZitiList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      query: null,
      current: null,
      loading: false,
      is_open_store_status:false
    }
  }
  config = {
    navigationBarTitleText: '选择自提门店'
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
    const isOpenStore = await entry.getStoreStatus()
    const { page_no: page, page_size: pageSize } = params
    const { selectParams, areaList, tagsList, curTagId } = this.state
    const query = {
      ...this.state.query,
      page,
      pageSize
    }

    const { list, total_count: total} = await api.shop.list(query)
    const nList = pickBy(list, {
      name: 'name',
      store_address: 'store_address',
      hour: 'hour',
      mobile: 'mobile',
      distributor_id: 'distributor_id',
      regions:'regions',
      regions_id:'regions_id',
      lat:'lat',
      lng:'lng',
      distributor_self:'distributor_self',
      distance:({ distance }) => (distance*1).toFixed(2),
      distance_show:({ distance_show }) => (distance_show*1).toFixed(2),
      distance_unit:'distance_unit',
      is_checked:'is_checked'
    })
    this.setState({
      list: [...this.state.list, ...nList],
      query,
      is_open_store_status:isOpenStore
    })

    return {
      total
    }
  }

  handleSearchOn = () => {
    this.setState({
      isShowSearch: true
    })
  }

  handleSearchOff = () => {
    this.setState({
      isShowSearch: false
    })
  }

  handleSearchChange = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        name: val
      }
    })
  }

  handleSearchClear = () => {
    this.setState({
      isShowSearch: false,
      query: {
        ...this.state.query,
        name: ''
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
    Taro.removeStorageSync('lnglat')
    const store = await entry.getLocal(true)
    console.log('store---->',store)
    if (store) {
      Taro.setStorageSync('curStore', store)
      this.resetPage()
      this.setState({
        list: [],
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
  handleSelectStore = (item) =>{
    const { list } = this.state
    console.log('list--->',list)
    list.map(v =>{
      v.is_checked = false,
      v.distributor_id == item.distributor_id && (v.is_checked = true)
      return {
        ...v,
        is_checked:v.is_checked
      }
    })
    this.setState({
      list
    })

  }

  handleClick = (val) => {
    Taro.setStorageSync('curStore', val)
    Taro.navigateBack()
  }

  render () {
    const { list, scrollTop, showBackToTop, loading, current, query,is_open_store_status } = this.state
    let {shop_id} = this.$router.params
    return (
      <View className='page-store-list'>
        <NavBar
          title='选择自提门店'
          leftIconType='chevron-left'
        />
        <View className='store-list__search'>
          <SearchBar
            showDailog={false}
            keyword={query ? query.name : ''}
            onFocus={this.handleSearchOn}
            onChange={this.handleSearchChange}
            onClear={this.handleSearchClear}
            onCancel={this.handleSearchOff}
            onConfirm={this.handleConfirm.bind(this)}
          />
        </View>
        <View className='current-store'>
          {/* <View className='label'>当前位置</View> */}
          <View className='content view-flex'>
            <View className='view-flex-item'>
              {
                loading
                  ? <Text className='loading'>定位中...</Text>
                  : <Text>{current ? current.name : '定位失败...'}</Text>
              }
            </View>
            {/* <View
              className='view-flex view-flex-middle'
              onClick={this.handleGetLocation}
            >重新定位 <Text className='icon-target' />
            </View> */}
            <View
              className='view-flex view-flex-middle'
              onClick={this.handleGetLocation}
            >上海市徐汇区 <Text className='icon-target' />
            </View> 
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
                  <View className="store-item" key={item.distributor_id}>
                    <View className="store-content">
                    <StoreListItem
                      info={item}
                      isStore={is_open_store_status}
                      key={item.distributor_id}
                      //onClick={this.handleClick.bind(this, item)}
                    />
                    </View>
                    <View>
                      <SpCheckbox
                        checked={item.is_checked}
                        onChange={this.handleSelectStore.bind(this,item)}
                      >
                      </SpCheckbox>
                    </View>
                    
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
