import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote, GoodsItem, NavBar } from '@/components'
import { AtCountdown } from 'taro-ui'
import { connect } from '@tarojs/redux'
import api from '@/api'
import { pickBy } from '@/utils'

import './plusprice.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))

@withPager
@withBackToTop
export default class DetailPluspriceList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      last_seconds: 1759242,
      timer: null,
      list: [],
    }
  }

  config = {
    navigationBarTitleText: '优惠换购'
  }

  componentDidMount () {
    // this.setState({
    //   query: {
    //     status: this.state.curTabIdx === 0 ? 'valid' : 'notice',
    //     item_type: 'normal'
    //   }
    // }, () => {
    //   this.nextPage()
    // })
    this.nextPage()
  }

  // onShareAppMessage () {
  //   const res = this.state.shareInfo
  //   const { userId } = Taro.getStorageSync('userinfo')
  //   const query = userId ? `?uid=${userId}` : ''    
  //   return {
  //     title: res.title,
  //     imageUrl: res.imageUrl,
  //     path: `/pages/item/seckill-goods-list${query}`
  //   }
  // }

 
    

  calcTimer (totalSec) {
    let remainingSec = totalSec
    const dd = Math.floor(totalSec / 24 / 3600)
    remainingSec -= dd * 3600 * 24
    const hh = Math.floor(remainingSec / 3600)
    remainingSec -= hh * 3600
    const mm = Math.floor(remainingSec / 60)
    remainingSec -= mm * 60
    const ss = Math.floor(remainingSec)

    return {
			dd,
			hh,
      mm,
      ss
    }
  }
  handleClickItem (item) {
		Taro.navigateTo({
			url: `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
		})
	}
  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      seckill_id: this.$router.params.seckill_id,
      type: this.$router.params.seckill_type,
      page,
      pageSize
    }

    const { list, total_count: total, item_params_list = [], select_tags_list = []} = await api.item.search(query)

    // let timer = null
    // timer = this.calcTimer(last_seconds)

		const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      title: 'itemName',
      desc: 'brief',
      distributor_id: 'distributor_id',
      price: ({ activity_price }) => (activity_price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2)
    })

    this.setState({
      list: [...this.state.list, ...nList],
    })
    return {
      total
    }
  }


  render () {
    const { colors } = this.props
    const { list, showBackToTop, scrollTop, page } = this.state

    return (
      <View className='page-plusprice'>
        <NavBar
          title='微商城'
        />
        <ScrollView
          className='plusprice-goods__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='plusprice-goods__info'>
            <View className='title'> 满 XX 元/个 享换购优惠</View>
            <View className='plusprice-goods__timer'>
                  
                      <View>
          							{/* <AtCountdown
                          isShowDay
                          day={timer.dd}
            							hours={timer.hh}
                          minutes={timer.mm}
                          seconds={timer.ss}
          							/> */}
                        <Text>据结束</Text>
                        <AtCountdown
                          isShowDay
                          day={2}
                          hours={1}
                          minutes={1}
                          seconds={10}
                        />
                        
          						</View>
                 
                </View>
          </View>
         
          <View className='plusprice-goods__list plusprice-goods__type-list'>
            {
              list.map((item) => {
                return (
                  <View key={item.item_id} className='goods-list__item' onClick={() => this.handleClickItem(item)}>
                    <GoodsItem
                      key={item.item_id}
                      info={item}
                      showFav={false}
                    >
  									</GoodsItem>
                  </View>
                )
              })
            }
          </View>
          { page.isLoading ? <Loading>正在加载...</Loading> : null }
          {
						!page.isLoading && !page.hasNext && !list.length
						&& (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>

        <BackToTop
         show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
      </View>
    )
  }
}
