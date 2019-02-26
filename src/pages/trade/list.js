import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import api from '@/api'
import { TradeItem } from './comps/item'

import './list.scss'

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
      initedTabs: {},
      lists: []
    }
  }

  componentDidMount () {
    this.fetch({ tab: 0 })
  }

  async fetch (params) {
    const { tab } = params
    const { list } = await api.trade.list({ status: tab })
    this.setState({ list })
  }

  onClickTab = (idx) => {
    this.setState({
      curTabIdx: idx
    })
    console.log(idx)
    if (this.state.lists[idx] === undefined) {
      this.fetch({ tab: idx })
    }
  }

  render () {
    const { curTabIdx, tabList, lists } = this.state
    const list = lists[curTabIdx]

    return (
      <View className='trade-list'>
        <AtTabs
          current={curTabIdx}
          tabList={tabList}
          onClick={this.onClickTab}
        >
          {
            tabList.map((panes, pIdx) =>
              (<AtTabsPane
                current={curTabIdx}
                key={pIdx}
                index={pIdx}
              >
                <View
                  className='trade-list__scroll'
                >
                  {list.map((item, idx) => {
                    return (
                      <TradeItem
                        key={idx}
                        info={item}
                      ></TradeItem>
                    )
                  })}
                </View>
              </AtTabsPane>)
            )
          }
        </AtTabs>
      </View>
    )
  }
}
