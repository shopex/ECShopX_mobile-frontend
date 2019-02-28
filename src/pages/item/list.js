import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, FilterBar } from '@/components'
import api from '@/api'
import GoodsItem from './comps/item'

import './list.scss'

@withPager
@withBackToTop
export default class List extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curFilterIdx: 0,
      filterList: [
        { title: '综合' },
        { title: '销量' },
        { title: '价格', sort: -1 }
      ],
      query: null,
      list: []
    }
  }

  componentDidMount () {
    this.setState({
      query: {
        keywords: '',
        distributor_id: 16,
        item_type: 'normal',
        approve_status: 'onsale,only_show',
        category: this.$router.params.cateId
      }
    }, () => {
      this.nextPage()
    })
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const query = {
      ...this.state.query,
      page,
      pageSize
    }

    const { list, total_count: total } = await api.item.search(query)
    const nList = this.state.list.concat(list)

    this.setState({
      list: nList,
      query
    })

    return {
      total
    }
  }

  handleFilterChange = (data) => {
    const { current, sort } = data
    const query = {
      ...this.state.query,
      goodsSort: current === 0
          ? null
          : current === 1
            ? 1
            : (sort > 0 ? 2 : 3)
    }

    this.setState({
      current,
      query
    }, () => {
      this.nextPage()
    })
  }

  handleClickItem = (item) => {
    const url = `/pages/item/detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  render () {
    const { list, curFilterIdx, filterList, showBackToTop, scrollTop, page } = this.state

    return (
      <View className='page-goods-list'>
        <FilterBar
          className='goods-list__tabs'
          current={curFilterIdx}
          list={filterList}
          onChange={this.handleFilterChange}
        ></FilterBar>

        <ScrollView
          className='goods-list__scroll'
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
