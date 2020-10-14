import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { BackToTop, Loading, SpNote, GoodsItem, NavBar,SpCheckbox } from '@/components'
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
  handleSelectGoods = (item,checked)=>{
    const { list } = this.state
    list.map(v => {
      v.is_checked = false
      v.item_id == item.item_id && (v.is_checked = true)
      return {
        ...v,
        is_checked:v.is_checked
      }
    })
    this.setState({
      list
    })
  }
  
   async handleClickConfirm (type){
      let { list } = this.state
      if(!list.length) return
      const selected = list.filter(v=>v.is_checked)
      if(!selected.length){
        Taro.showToast({
          title: '请选择商品～',
          icon: 'none'
        })
        return
      }
      // const {marketing_id} = selected[0]
      // const query = {
      //   item_id:type=='cancle'?0:selected[0].item_id,
      //   marketing_id
      // }
      //const {data} = await api.cart.redemptionBuy(query)
      Taro.showToast({
        title: '操作成功~',
        icon: 'none'
      })
      type=='cancle' && (list = list.map(v=>v.is_checked=false))
      this.setState({list})
      setTimeout(() => {
         Taro.navigateBack()
       }, 300)

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
      market_price: ({ market_price }) => (market_price/100).toFixed(2),
      is_checked:'is_checked'
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
          <View className='plusprice-goods__list plusprice-goods__type-list'>
            {
              list.map((item) => {
                return (
                  <View key={item.item_id} className='goods-list__item'>
                    <SpCheckbox
                      checked={item.is_checked}
                      onChange={this.handleSelectGoods.bind(this,item)}
                    >
                      <GoodsItem
                        key={item.item_id}
                        info={item}
                        showFav={false}
                      >
                      </GoodsItem>
                    </SpCheckbox>
                    
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
          <View className='plusprice-footer'>
                <View className='footer-item' onClick={this.handleClickConfirm.bind(this,'cancel')}>不使用换购</View>
                <View className='footer-item' style={`background:${colors.data[0].marketing}`} onClick={this.handleClickConfirm.bind(this,'confirm')}>确定</View>
          </View>
        </ScrollView>

        <BackToTop
         show={showBackToTop}
          onClick={this.scrollBackToTop}
        />
      </View>
    )
  }
}
