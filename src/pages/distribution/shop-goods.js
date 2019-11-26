import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image, Navigator } from '@tarojs/components'
import { SpToast, BackToTop, Loading, FilterBar, SpNote, GoodsItem } from '@/components'
import S from '@/spx'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { classNames, pickBy } from '@/utils'
import entry from '@/utils/entry'

import './shop-goods.scss'

@withPager
@withBackToTop
export default class DistributionShopGoods extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      query: null,
      list: [],
      goodsIds: []
    }
  }

  componentDidMount () {
    this.setState({
      query: {
        item_type: 'normal',
        approve_status: 'onsale,only_show',
        rebate_type: ['total_money', 'total_num']
      }
    }, () => {
      this.nextPage()
    })
  }

  async fetch (params) {
    const { userId } = Taro.getStorageSync('userinfo')
    const { page_no: page, page_size: pageSize } = params
    const { selectParams } = this.state
    const query = {
      ...this.state.query,
      page,
      pageSize
    }

    const { list, total_count: total} = await api.item.search(query)

    const nList = pickBy(list, {
      img: 'pics[0]',
      item_id: 'item_id',
      goods_id: 'goods_id',
      title: 'itemName',
      desc: 'brief',
      price: ({ price }) => (price/100).toFixed(2),
      market_price: ({ market_price }) => (market_price/100).toFixed(2)
    })

    let ids = []
    list.map(item => {
      ids.push(item.goods_id)
    })

    const param = {
      goods_id: ids,
      user_id: userId
    }

    const { goods_id } = await api.distribution.items(param)

    this.setState({
      list: [...this.state.list, ...nList],
      goodsIds: [...this.state.goodsIds, ...goods_id],
      query
    })

    return {
      total
    }
  }

  handleViewDetail = async (id) => {
    const query = {
      is_default: false,
      goods_id: id,
      item_type: 'normal',
      pageSize: 50,
      page: 1
    }
    const res = api.item.search(query)
    console.log(res)
  }

  handleItemRelease = async (id) => {
    const { goodsIds } = this.state
    const goodsId = {goods_id: id}
    const idx = goodsIds.findIndex(item => id === item)
    const isRelease = idx !== -1
    if (!isRelease) {
      const { status } = await api.distribution.release(goodsId)
      if ( status ) {
        this.setState({
          goodsIds: [...this.state.goodsIds, id]
        }, () => {
          S.toast('上架成功')
        })
      }
    } else {
      const { status } = await api.distribution.unreleased(goodsId)
      if ( status ) {
        goodsIds.splice(idx, 1)
        this.setState({
          goodsIds
        }, () => {
          S.toast('下架成功')
        })
      }
    }
  }

  onShareAppMessage (res) {
    const { userId } = Taro.getStorageSync('userinfo')
    const { info } = res.target.dataset

    return {
      title: info.title,
      imageUrl: info.img,
      path: `/pages/item/espier-detail?id=${info.item_id}&uid=${userId}`
    }
  }

  render () {
    const { list, goodsIds, page, scrollTop } = this.state

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
            list.map((item, index) => {
              const isRelease = goodsIds.findIndex(n => item.goods_id == n) !== -1
              console.log(isRelease)
              return (
                <DistributionGoodsItem
                  key={index}
                  info={item}
                  isRelease={isRelease}
                  onClick={() => this.handleClickItem(item.goods_id)}
                />
              )
            })
          }
            {
              list.map((item, index) => {
                const isRelease = goodsIds.findIndex(n => item.goods_id == n) !== -1
                return (
                  <View
                    className='shop-goods-item'
                    >
                    <View className='shop-goods'>
                      <Image className='shop-goods__thumbnail' src={item.img} mode='aspectFill' />
                      <View className='shop-goods__caption'>
                        <View className='shop-goods__title'>{item.title}</View>
                        <View className='shop-goods__desc'>{item.desc}</View>
                      </View>
                      <View
                        className='shop-goods__detail'
                        onClick={this.handleViewDetail.bind(this, item.item_id)}
                        >
                        <Text className='icon-search'></Text> 查看指标明细
                      </View>
                    </View>
                    <View className='shop-goods__footer'>
                      <View
                        className={classNames('shop-goods__footer-item', !isRelease ? 'unreleased' : null)}
                        onClick={this.handleItemRelease.bind(this, item.item_id)}
                      >
                        {
                          isRelease
                            ? <Text className='icon-moveDown'> 从小店下架</Text>
                            : <Text className='icon-moveUp'> 上架到小店</Text>
                        }
                      </View>
                      <Button
                        className='shop-goods__footer-item'
                        dataInfo={item}
                        openType='share'
                        size="small"
                      >
                        <Text className='icon-share2'> 分享给好友</Text>
                      </Button>
                    </View>
                  </View>
                )
              })
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
