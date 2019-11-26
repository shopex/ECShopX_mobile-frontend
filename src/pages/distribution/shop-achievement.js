import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import { SpToast, BackToTop, Loading, SpNote } from '@/components'
import S from '@/spx'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { classNames, pickBy } from '@/utils'
import entry from '@/utils/entry'

import './shop-achievement.scss'

@withPager
@withBackToTop
export default class DistributionShopAchievement extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      info: {},
      query: null,
      list: []
    }
  }

  async componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      ...this.state.query,
      page,
      pageSize
    }

    const { list, total_count: total} = await api.distribution.shopAchievement(query)
    console.log(list)
    const nList = []
    // const nList = pickBy(list, {
    //   img: 'pics[0]',
    //   item_id: 'item_id',
    //   goods_id: 'goods_id',
    //   title: 'itemName',
    //   desc: 'brief',
    //   price: ({ price }) => (price/100).toFixed(2),
    //   market_price: ({ market_price }) => (market_price/100).toFixed(2)
    // })

    this.setState({
      list: [...this.state.list, ...nList],
      showDrawer: false,
      query
    })

    return {
      total
    }
  }

  render () {
    const { list, page, scrollTop } = this.state

    return (
      <View className="page-distribution-shop">
        <ScrollView
          className='goods-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='goods-list'>
            {
              list.map((item, index) =>
                <GoodsItem
                  key={index}
                  info={item}
                  onClick={this.handleClickItem.bind(this, item.goods_id)}
                />
              )
            }
          </View>
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
          }
          {
            !page.isLoading && !page.hasNext && !list.length
              && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
          }
        </ScrollView>
        <SpToast />
      </View>
    )
  }
}
