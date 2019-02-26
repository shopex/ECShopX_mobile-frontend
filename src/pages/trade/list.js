import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { Loading } from '@/components'
import api from '@/api'
import { withPager } from '@/hocs'
import { TradeItem } from './comps/item'

import './list.scss'

@withPager
export default class TradeList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '全部'},
        {title: '待付款'},
        {title: '待发货'},
        {title: '待收货'},
        {title: '待评价'}
      ],
      list: [],
      isLoading: false
    }
  }

  componentDidMount () {
    this.nextPage()
  }

  async fetch (params) {
    this.setState({ isLoading: true })
    const { curTabIdx } = this.state
    const { list, total_count: total } = await api.trade.list({ status: curTabIdx, ...params })

    const nList = this.state.list.concat(list)
    this.setState({
      list: nList,
      isLoading: false
    })

    return { total }
  }

  handleClickTab = (idx) => {
    if (this.state.isLoading || this.state.page.isLoading) return

    if (idx !== this.state.curTabIdx) {
      this.resetPage()
      this.setState({
        list: []
      })
    }

    this.setState({
      curTabIdx: idx
    }, () => {
      this.nextPage()
    })
  }

  handleClickItem (trade) {
    const { tid } = trade
    Taro.navigateTo({
      url: `/pages/trade/detail?id=${tid}`
    })
  }

  handleClickItemBtn = (type, trade) => {
    console.log(type, trade)
  }

  render () {
    const { curTabIdx, tabList, list, page } = this.state

    return (
      <View className='trade-list'>
        <AtTabs
          className='trade-list__tabs'
          current={curTabIdx}
          tabList={tabList}
          onClick={this.handleClickTab}
        >
          {
            tabList.map((panes, pIdx) =>
              (<AtTabsPane
                current={curTabIdx}
                key={pIdx}
                index={pIdx}
              >
              </AtTabsPane>)
            )
          }
        </AtTabs>

        <ScrollView
          scrollY
          className='trade-list__scroll'
          onScrollToLower={this.nextPage}
        >
          {
            list.map((item, idx) => {
              return (
                <TradeItem
                  key={idx}
                  info={item}
                  onClick={this.handleClickItem}
                  onClickBtn={this.handleClickItemBtn}
                />
              )
            })
          }
          {
            page.isLoading && <Loading>正在加载...</Loading>
          }
        </ScrollView>
      </View>
    )
  }
}
