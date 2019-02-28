
import Taro, { Component } from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import {AtBadge, AtIcon, AtAvatar, AtTabs, AtTabsPane} from 'taro-ui'
import { Loading, SpNote } from '@/components'
import { withPager } from '@/hocs'
import api from '@/api'
// import { TradeItem } from './comps/item'

import './integral.scss'

@withPager
export default class Integral extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      curTabIdx: 0,
      tabList: [
        {title: '全部', status: ''},
        {title: '收入', status: 'INCOME'},
        {title: '支出', status: 'EXPEND'}
      ],
      list: [],
      isLoading: false
    }
  }

  componentDidMount () {
    const { status } = this.$router.params
    const tabIdx = this.state.tabList.findIndex(tab => tab.status === status)

    if (tabIdx >= 0) {
      this.setState({
        curTabIdx: tabIdx
      }, () => {
        this.nextPage()
      })
    } else {
      this.nextPage()
    }
  }

  async fetch (params) {
    this.setState({ isLoading: true })
    const { tabList, curTabIdx } = this.state
    params = {
      ...params,
      status: tabList[curTabIdx].status
    }
    const { list, total_count: total } = await api.trade.list(params)
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

  render () {
    const { curTabIdx, tabList, list, page } = this.state

    return (
      <View className='page-member-integral'>
        <View className='member-integral__hd'>
          <View className='integral-info'>
            <View className='integral-number'>图标<Text className='integral-number__text'>1888</Text></View>
            <View className='integral-text'>当前可用积分</View>
          </View>
        </View>

        <View className='member-integral__bd'>
          <View className='integral-sec integral-info__status'>
            <Text className='integral-sec__horn'>喇叭</Text>
            <Text className='integral-sec__share'>分享推荐可获取积分呦，赶紧行动吧~</Text>
          </View>

          <View className='integral-sec member-integral'>
            <AtTabs
              className='member-integral__tabs'
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
              className='member-integral__scroll'
              onScrollToLower={this.nextPage}
            >
              {
                page.isLoading && <Loading>正在加载...</Loading>
              }
              {
                !page.isLoading && !page.hasNext && !list.length
                && (<SpNote img='trades_empty.png'>赶快赚积分吧~</SpNote>)
              }
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}
