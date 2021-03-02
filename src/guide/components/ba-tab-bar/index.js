import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { AtTabBar } from 'taro-ui'
import api from '@/api'
import {  getCurrentRoute } from '@/utils'
import S from '@/spx'

@connect(({ cart,home,member}) => ({
  cartTotalCount: cart.count,
  tabSet:home.tabSet,
  refundCount:member.refundCount
}), (dispatch) => ({
  onUpdateCartCount: (count) => dispatch({ type: 'cart/count', payload: count })
}))
export default class BaTabBar extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    const { cartTotalCount, current,refundCount } = props
    const count = current !== 3 ? (cartTotalCount || '') : ''
  
   
    this.state = {
      count:count,
      localCurrent: 0,
      tabList: [
        { title: '首页', iconType: 'home', iconPrefixClass: 'in-icon', url: '/guide/index', urlRedirect: true },
        { title: '分类', iconType: 'menu', iconPrefixClass: 'in-icon', url: '/guide/category/index', urlRedirect: true },
        { title: '优惠券', iconType: 'coupon', iconPrefixClass: 'in-icon', url: '/guide/coupon-home/index', urlRedirect: true },
        { title: '种草', iconType: 'grass', iconPrefixClass: 'in-icon', url: '/guide/recommend/list', urlRedirect: true },
        { title: '购物车', iconType: 'cart', iconPrefixClass: 'in-icon', url: '/guide/cart/espier-index', text: count, max: '99', withLogin: true, urlRedirect: true },
      ]
    }
    this.cartTabIdx = 4
  }


  componentDidMount () {
    this.updateCurTab()
    
  }

  componentDidShow () {
    this.fetchCart()
  
  }
  

  componentWillReceiveProps (nextProps) {
   
    if (nextProps.current !== undefined) {
     
      const {tabList}=this.state
   
      this.setState({ 
        localCurrent: nextProps.current,
        tabList
      })
     
    }
  }

  updateCurTab () {
    this.fetchCart()
    const { tabList, localCurrent } = this.state
    const { fullPath } = getCurrentRoute(this.$router)
    const { url } = tabList[localCurrent]
    if (url && url !== fullPath) {
      const nCurrent = tabList.findIndex((t) => t.url === fullPath) || 0
      this.setState({
        localCurrent: nCurrent
      })
    }
  }

  updateCartCount (count) {
    if (!count) count = ''
    const cartTabIdx = this.cartTabIdx
    const { tabList } = this.state
    const { path } = getCurrentRoute(this.$router)
    if (path === tabList[cartTabIdx].url||count==0) {
      count = ''
    }
    tabList[cartTabIdx].text = count

    this.setState({
      tabList
    })
  }

  async fetchCart () {
    if (!S.getAuthToken()) return
     
    try {
      const { item_count } = await api.cart.count()
      this.updateCartCount(item_count)
      this.props.onUpdateCartCount(item_count)
    } catch (e) {
      console.error(e)
    }
  }

  handleClick = (current,e) => {
  
    e.stopPropagation()
    const cur = this.state.localCurrent
    
    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url, urlRedirect, withLogin } = curTab
      const { fullPath } = getCurrentRoute(this.$router)
     
      if (withLogin && !S.getAuthToken()) {
        let pathurl=BA_APP_AUTH_PAGE
       if(urlRedirect){
         pathurl=`${BA_APP_AUTH_PAGE}?redirect=${encodeURIComponent(url)}`
       }
        return Taro.redirectTo({
          url: pathurl
        })
      }

      if (url && fullPath !== url) {
        if (!urlRedirect) {
          Taro.navigateTo({ url })
        } else {
          Taro.redirectTo({ url })
        }
      }
    }
  }

  render () {
    const { tabList, localCurrent } = this.state
    const {tabSet}=this.props

    // const ipxClass = S.get('ipxClass')

    return (
      <AtTabBar
        fixed
        backgroundColor={tabSet?tabSet.config.tabBackgroundColor:''}
        color={tabSet?tabSet.config.tabColor:'#818181'}
        selectedColor={tabSet?tabSet.config.activetabColor:'#0b4137'}
        // className={ipxClass}
        tabList={tabList}
        onClick={this.handleClick}
        current={localCurrent}
      />

    )
  }
}
