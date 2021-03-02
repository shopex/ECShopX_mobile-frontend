import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text, Button } from '@tarojs/components'
import { AtTabBar, AtSearchBar  } from 'taro-ui'
import { BackToTop, Loading, NavBar, SpImg } from '@/components'
import S from '@/spx'
import req from '@/api/req'
import api from '@/api'
import { withPager, withBackToTop } from '@/hocs'
import { getCurrentRoute} from '@/utils'
import entry from '@/utils/entry'

import './shop-home.scss'

@withPager
@withBackToTop
export default class DistributionShopHome extends Component {
  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      info: {},
      curFilterIdx: 0,
      // filterList: [
      //   { title: '综合1' },
      //   { title: '销量' },
      //   { title: '价格', sort: -1 }
      // ],
      query: null,
      showDrawer: false,
      paramsList: [],
      selectParams: [],
      list: [],
      goodsIds: [],
      tabList: [
        { title: '小店首页', iconType: 'home', iconPrefixClass: 'icon',url: '/pages/distribution/shop-home',urlRedirect: true },
        { title: '分类', iconType: 'category', iconPrefixClass: 'icon', url: '/marketing/pages/distribution/shop-category', urlRedirect: true },
      ],
      wgts: null,
      authStatus: false,
      positionStatus: false,
      def_pic: '',
      // 是否显示搜索
      showSearch: false,
      // 搜索关键词
      keywords: '',
      // 价格排序, true为升 false为降
      sort: true
    }
  }

  async componentDidMount () {
    const options = this.$router.params
    const { uid } = await entry.entryLaunch(options, true)
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const { userId } = Taro.getStorageSync('userinfo')
    const shopId = uid || distributionShopId || userId
    const param = distributionShopId ? {
      user_id: distributionShopId,
    } : {
      user_id: userId,
    }    
    if (options.featuredshop) {
      param.user_id = options.featuredshop
    }
    const { banner_img } = await api.distribution.shopBanner(param || null)
    if (shopId) {
      this.firstStatus = true
      this.setState({
        query: {
          item_type: 'normal',
          approve_status: 'onsale,only_show',
          promoter_onsale: true,
          promoter_shop_id: shopId
        },
        def_pic: banner_img,
        // tabList: [
        //   { title: '小店首页', iconType: 'home', iconPrefixClass: 'icon',url: `/pages/distribution/shop-home?featuredshop=${options.featuredshop}`,urlRedirect: true },
        //   { title: '分类', iconType: 'category', iconPrefixClass: 'icon', url: `/marketing/pages/distribution/shop-category?featuredshop=${options.featuredshop}`, urlRedirect: true },
        // ]
      }, async () => {
        await this.fetchInfo()
        await this.fetch()
        // await this.nextPage()
      })
    }
  }

  async fetchInfo () {
    const options = this.$router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const distributionShopId = Taro.getStorageSync('distribution_shop_id')
    const param = distributionShopId ? {
      user_id: distributionShopId,
    } : {
      user_id: userId,
    }
    if (options.featuredshop) {
      param.user_id = options.featuredshop
    }

    const res = await api.distribution.info(param || null)
    const {shop_name, brief, shop_pic, username, headimgurl, is_valid } = res

    if (!is_valid) {
      Taro.reLaunch({
        url: '/pages/index'
      })
    }

    this.setState({
      localCurrent: 0,
      info: {
        username,
        headimgurl,
        shop_name,
        brief,
        shop_pic
      }
    })
  }

  async fetch () {
    const { custompage_template_id } = await api.distribution.getCustompage()
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=custom_${custompage_template_id}&name=search`
    const fixSetting = await req.get(url)

    this.setState({
      positionStatus: (fixSetting.length && fixSetting[0].params.config.fixTop) || false
    }, () => {
      this.fetchTpl(custompage_template_id)
    })  
  }

  async fetchTpl (id) {
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=custom_${id}`
    const info = await req.get(url)

    if (!S.getAuthToken()) {
      this.setState({
        authStatus: true
      })
    }
    this.setState({
      wgts: info.config
    })
    
  }
  // 分享
  onShareAppMessage(res) {
    const { info } = res.target.dataset
    const options = this.$router.params
    return {
      title: info.title,
      imageUrl: info.img,
      path: `/pages/distribution/shop-home?featuredshop=${options.featuredshop}`
    }
  }
  

  // handleFilterChange = (data) => {
  //   this.setState({
  //     showDrawer: false
  //   })
  //   const { current, sort } = data

  //   const query = {
  //     ...this.state.query,
  //     goodsSort: current === 0
  //         ? null
  //         : current === 1
  //           ? 1
  //           : (sort > 0 ? 3 : 2)
  //   }

  //   if (current !== this.state.curFilterIdx || (current === this.state.curFilterIdx && query.goodsSort !== this.state.query.goodsSort)) {
  //     this.resetPage()
  //     this.setState({
  //       list: []
  //     })
  //   }

  //   this.setState({
  //     curFilterIdx: current,
  //     query
  //   }, () => {
  //     this.nextPage()
  //   })
  // }


  handleClickItem = (item) => {
    const url = `/pages/item/espier-detail?id=${item.goods_id}&dtid=${item.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClick = (current) => {
    const cur = this.state.localCurrent

    if (cur !== current) {
      const curTab = this.state.tabList[current]
      const { url, urlRedirect } = curTab
      
      const fullPath = ((getCurrentRoute(this.$router).fullPath).split('?'))[0]      
      if (url && fullPath !== url) {
        if (!urlRedirect || (url === '/pages/member/index' && !S.getAuthToken())) {
          Taro.navigateTo({ url })
        } else {
          Taro.redirectTo({ url })
        }
      }
    }
  }

  // 显示搜索
  handleShowSearch = () => {
    this.setState({
      showSearch: true
    })
  }

  // 搜索输入框
  searchInput = (data) => {
    this.setState({
      keywords: data
    })
  }

  // 确认搜索
  handleConfirm = () => {
    this.setState({
      showSearch: false
    })
  }

  // 防止点击穿透
  handleDisable = (e) => {
    e.stopPropagation()
  }

  // 清除搜索
  handleClear = () => {
    this.searchInput('')
    this.handleConfirm()
  }

  // 点击搜索蒙层
  handleCloseSearch = (e) => {
    e.stopPropagation()
    console.log('触发handleCloseSearch')
    this.handleConfirm()
  }

  // 筛选切换
  handleFilterChange = (filterInfo) => {
    const { type } = filterInfo
    const { curFilterIdx, sort } = this.state
    if (curFilterIdx === type && type === 2) {
      this.setState({
        sort: !sort
      })
    } else {
      this.setState({
        curFilterIdx: type,
        sort: true
      })
    }
  }

  render () {
    const {
      wgts,
      def_pic,
      showBackToTop,
      tabList,
      localCurrent,
      scrollTop,
      info,
      sort,
      showSearch,
      keywords,
      curFilterIdx
    } = this.state

    // 筛选选项
    const filterList = [{
        title: '综合',
        type: 0
      }, {
        title: '销量',
        type: 1
      }, {
        title: '价格',
        type: 2
      }]

    if (!wgts) {
      return <Loading />
    }

    return (
      <View className='page-distribution-shop'>
        <NavBar
          title='小店'
          leftIconType='chevron-left'
          fixed='true'
        />
        <View className='shop-banner'>
          <View className='shop-def'>
            <Image
              className='banner-img'
              src={def_pic}
              mode='aspectFill'
            />
          </View>
          <View className='shop-info'>
            <View className='left'>
              <Image
                className='shopkeeper-avatar'
                src={info.headimgurl}
                mode='aspectFill'
              />
              <View className='shop-name'>{info.shop_name || `${info.username}的小店`}</View>
            </View>
            <View className='right'>
              <View className='item'>
                <View className='num'>200</View>
                <View className='text'>全部商品</View>
              </View>
              <Button className='item share' open-type='share'>
                <View className='iconfont icon-share'></View>
                <View className='text'>分享店铺</View>
              </Button>
            </View>
          </View>   
          <View className='filter'>
            <View className='iconfont icon-search' onClick={this.handleShowSearch.bind(this)}>
              <Text className='txt'>{ keywords }</Text>
            </View>
            {
              filterList.map(item =>
                <View
                  className={`filterItem ${curFilterIdx === item.type && 'active'}`}
                  key={item.type}
                  onClick={this.handleFilterChange.bind(this, item)}
                >
                  { item.title }
                  {
                    (item.type === 2 && item.title === '价格') &&
                    <View className={`sort ${sort ? 'down' : 'up'}`}></View>
                  }
                </View>
              )
            }
          </View> 
        </View>
        <ScrollView
          className='goods-list'
          scrollY
          scrollTop={scrollTop}
        >
          <View className='main'>
            {
              [0, 1, 2, 3, 4, 5, 6, 7].map(item => 
                <View
                  key={item}
                  className='goodItem'
                >
                  <View className='content'>
                    <View className='imgContent'>
                      <SpImg
                        lazyLoad
                        width='400'
                        mode='aspectFill'
                        img-class='goodImg'
                        src='https://bbctest.aixue7.com/1/2019/08/07/17de0d280df6a0dc603b6056aace3c92nlqU3KNYregEcKluMNQj6PGtMfLWrBa7'
                      />
                      <View className={`outSale ${item % 2 === 0 && 'show'}`}></View>
                    </View>
                    <View className='info'>
                      <View className='goodName'>积分商城商品2这里最多显示两行文字这说是第二行省第二行省第二行省第二行省</View>
                      <View className='price'>¥99.00</View>
                    </View>
                  </View>
                </View>
              )
            }
          </View>
        </ScrollView>

        {/* 搜索 */}
        <View
          className={`searchMask ${showSearch && 'show'}`}
          onClick={this.handleCloseSearch.bind(this)}
        >
          <View className='seachMain' onClick={this.handleDisable.bind(this)}>
            <AtSearchBar
              value={keywords}
              focus={showSearch}
              onClear={this.handleClear.bind(this)}
              onChange={this.searchInput.bind(this)}
              onConfirm={this.handleConfirm.bind(this)}
            />
          </View>
        </View>
        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

        <AtTabBar
          fixed
          tabList={tabList}
          onClick={this.handleClick}  
          current={localCurrent}   
        />
      </View>
    )
  }
}
