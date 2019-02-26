import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading } from '@/components'
import GoodsItem from './comps/item'

import './list.scss'

@withPager
@withBackToTop
export default class List extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: []
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    const { list, total_count: total } = await api.item.search(params)
    const nList = this.state.list.concat(list)
    this.setState({ list: nList })

    return {
      total
    }
  }

  handleClickItem = (item) => {
    const url = `/pages/item/detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { list, showBackToTop, scrollTop, page } = this.state

    return (
      <View className='page-goods-list'>
        <ScrollView
          className='goods-list'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          {
            list.map(item => {
              return (
                <GoodsItem
                  key={item.item_id}
                  info={item}
                  onClick={() => this.handleClickItem(item)}
                />
              )
            })
          }
          {
            page.isLoading
              ? <Loading>正在加载...</Loading>
              : null
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
