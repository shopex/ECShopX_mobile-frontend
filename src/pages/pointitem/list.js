import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer,AtInput } from 'taro-ui'
import { BackToTop, Loading, TagsBar, FilterBar, SearchBar, SpNote, NavBar, TabBar } from '@/components'
import api from '@/api'
import { Tracker } from "@/service";
import { pickBy, classNames } from '@/utils'
import entry from "../../utils/entry";
import Header from './comps/header'
import Tabs from './comps/tabs'
import GoodsItem from './comps/goods_item'
import FilterBlock from './comps/filter-block'
import S from '@/spx'
import './list.scss'

@connect(({
  member
}) => ({
  favs: member.favs
}))
@withPager
@withBackToTop
export default class List extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      curFilterIdx: 0,
      curTagId: '',
      filterList: [
        { title: '综合' },
        { title: '销量' },
        { title: '价格', sort: -1 },
        { title: '筛选' },
      ],
      userInfo:{},
      query: null,
      list: [],
      oddList: [],
      evenList: [],
      tagsList: [],
      paramsList: [],
      listType: 'grid',
      isShowSearch: false,
      showDrawer: false,
      selectParams: [],
      info: {},
      shareInfo: {},
      isOpenStore: null,
      filterConfig:{
        brandList:[],
        categoryList:[],
        scoreInternel:[],
        brandVisible:true,
        categoryVisible:true,
        scoreVisible:false
      },
      filterParams:{
        brand:[],
        category:[]
      }
    }
  }

  config = {
    // navigationBarBackgroundColor: '#2600b7',
    navigationStyle: 'custom',
    backgroundColor: '#F5F5F5'
  }
 
  async getPointitemConfig(){
    
  }

  async componentDidMount() {
    const { cat_id = null, main_cat_id = null } = this.$router.params
    this.firstStatus = true
    const isOpenStore = await entry.getStoreStatus()
    const { store_id } = Taro.getStorageSync('curStore')
    this.setState({
      isOpenStore
    })
    this.fetchUserInfo();

    this.getPointitemConfig();

    this.fetchConfig();

    this.setState({
      query: {
        keywords: this.$router.params.keywords,
        item_type: 'normal', 
        distributor_id: isOpenStore ? store_id : this.$router.params.dis_id, 
        category: cat_id ? cat_id : '',
        main_category: main_cat_id ? main_cat_id : ''
      },
      curTagId: this.$router.params.tag_id
    }, () => {
      this.nextPage()
      api.wx.shareSetting({ shareindex: 'itemlist' }).then(res => {
        this.setState({
          shareInfo: res
        })
      })
    })
  }

  componentWillReceiveProps(next) {
    if (Object.keys(this.props.favs).length !== Object.keys(next.favs).length) {
      setTimeout(() => {
        const list = this.state.list.map(item => {
          item.is_fav = Boolean(next.favs[item.item_id])
          return item
        })
        this.setState({
          list
        })
      })
    }
  }

  onShareAppMessage() {
    const res = this.state.shareInfo
    const { cat_id = '', main_cat_id = '' } = this.$router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `?uid=${userId}&cat_id=${cat_id}&main_cat_id=${main_cat_id}` : `?cat_id=${cat_id}&main_cat_id=${main_cat_id}`
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      path: `/pages/item/list${query}`
    }
  }

  onShareTimeline() {
    const res = this.state.shareInfo
    const { cat_id = null, main_cat_id = null } = this.$router.params
    const { userId } = Taro.getStorageSync('userinfo')
    const query = userId ? `uid=${userId}&cat_id=${cat_id}&main_cat_id=${main_cat_id}` : `cat_id=${cat_id}&main_cat_id=${main_cat_id}`
    return {
      title: res.title,
      imageUrl: res.imageUrl,
      query: query
    }
  }



  async fetchUserInfo(){
    if (!S.getAuthToken()) return 
    let resUser = null
    if(Taro.getStorageSync('userinfo')){
      resUser = Taro.getStorageSync('userinfo')
      this.setState({
        useInfo: {
          username: resUser.username,
          avatar: resUser.avatar, 
        }
      })
    }
    const [res,{point}] = await Promise.all([api.member.memberInfo(),api.pointitem.getMypoint()]) 
    const userObj = {
      username: res.memberInfo.nickname || res.memberInfo.username || res.memberInfo.mobile,
      avatar: res.memberInfo.avatar, 
    }
    if(!resUser || resUser.username !== userObj.username || resUser.avatar !== userObj.avatar) {
      Taro.setStorageSync('userinfo', userObj)
      this.setState({
        useInfo: {
          ...this.state.useInfo,
          username: res.memberInfo.nickname || res.memberInfo.username || res.memberInfo.mobile,
          avatar: res.memberInfo.avatar, 

        }
      })
    }
    this.setState({
      useInfo: {
        ...this.state.useInfo,
        point
      }
    })
  }

  async fetchConfig(params){ 
    const query={ 
      page:1,
      item_type:'normal',
      pageSize:20
    }
    const [
      {
        list, 
        brand_list:{list:brand_list}
      } ,
      { screen:{brand_openstatus,cat_openstatus,point_openstatus,point_section} },
      categoryList
    ]=await  Promise.all([
      api.pointitem.search(query),
      api.pointitem.getPointitemSetting(),
      api.pointitem.getPointitemCategory({have_items:true})],
    );
 

    list.map((item) => {
      item.imgUrl = "";
      if (item.pics.length > 0) {
        item.imgUrl = item.pics[0];
      }
    });

    this.setState({ 
      list:[ 
        ...list
      ],
      filterConfig:{
        ...this.state.filterConfig,
        scoreInternel:point_section,
        categoryList:categoryList,
        brandList:brand_list
      }
    }) 
  }

  async fetch(params){
 
    const { page_no: page, page_size: pageSize } = params

    const query={
      ...this.state.query,
      page,
      item_type:'normal',
      pageSize
    }
    let total;
    const { list:prevState }=this.state;
    try {
      const [
        {
          list,
          total_count,  
        } 
      ]=await  Promise.all([
        api.pointitem.search(query)
      ]);
  
      total=total_count;

      list.map((item) => {
        item.imgUrl = "";
        if (item.pics.length > 0) {
          item.imgUrl = item.pics[0];
        }
      });

      this.setState({ 
        list:[
          ...prevState,
          ...list
        ], 
      })  
   
    } catch (e) { 
      total=0;
      console.log(e); 
    } 

    return {
      total
    }
    
  }

  // async fetch(params) {
  //   const { page_no: page, page_size: pageSize } = params
  //   const { selectParams, tagsList, curTagId, isOpenStore } = this.state
  //   const { distributor_id, store_id } = Taro.getStorageSync('curStore')
  //   const { cardId } = this.$router.params
  //   const query = {
  //     ...this.state.query,
  //     item_params: selectParams,
  //     tag_id: curTagId,
  //     page,
  //     pageSize
  //   }

  //   if (APP_PLATFORM === 'standard') {
  //     query.distributor_id = isOpenStore ? store_id : distributor_id
  //   }

  //   if (cardId) {
  //     query.card_id = cardId
  //   }

  //   const { list, total_count: total, item_params_list = [], select_tags_list = [] } = await api.item.search(query)
  //   const { favs } = this.props

  //   item_params_list.map(item => {
  //     if (selectParams.length < 4) {
  //       selectParams.push({
  //         attribute_id: item.attribute_id,
  //         attribute_value_id: 'all'
  //       })
  //     }
  //     item.attribute_values.unshift({ attribute_value_id: 'all', attribute_value_name: '全部', isChooseParams: true })
  //   })

  //   const nList = pickBy(list, {
  //     img: ({ pics }) => pics ? typeof pics !== 'string' ? pics[0] : JSON.parse(pics)[0] : '',
  //     item_id: 'item_id',
  //     title: ({ itemName, item_name }) => itemName ? itemName : item_name,
  //     desc: 'brief',
  //     distributor_id: 'distributor_id',
  //     distributor_info: 'distributor_info',
  //     promotion_activity_tag: 'promotion_activity',
  //     origincountry_name: 'origincountry_name',
  //     origincountry_img_url: 'origincountry_img_url',
  //     type: 'type',
  //     price: ({ price }) => (price / 100).toFixed(2),
  //     member_price: ({ member_price }) => (member_price / 100).toFixed(2),
  //     market_price: ({ market_price }) => (market_price / 100).toFixed(2),
  //     is_fav: ({ item_id }) => Boolean(favs[item_id])
  //   })

  //   let odd = [], even = []
  //   nList.map((item, idx) => {
  //     if (idx % 2 == 0) {
  //       odd.push(item)
  //     } else {
  //       even.push(item)
  //     }
  //   })

  //   this.setState({
  //     list: [...this.state.list, ...nList],
  //     oddList: [...this.state.oddList, ...odd],
  //     evenList: [...this.state.evenList, ...even],
  //     showDrawer: false,
  //     query
  //   }, () => {
  //     this.startTrack();
  //   })

  //   if (this.firstStatus) {
  //     this.setState({
  //       paramsList: item_params_list,
  //       selectParams
  //     })
  //     this.firstStatus = false
  //   }

  //   if (tagsList.length === 0) {
  //     let tags = select_tags_list
  //     tags.unshift({
  //       tag_id: 0,
  //       tag_name: '全部'
  //     })
  //     this.setState({
  //       //curTagId: 0,
  //       tagsList: tags
  //     })
  //   }

  //   return {
  //     total
  //   }
  // }

  startTrack() {
    this.endTrack();
    const observer = Taro.createIntersectionObserver(this.$scope, {
      observeAll: true
    });
    observer
      .relativeToViewport({ bottom: 0 })
      .observe(".goods-list__item", res => {
        console.log("res.intersectionRatio:", res.intersectionRatio);
        if (res.intersectionRatio > 0) {
          const { id } = res.dataset;
          const { list } = this.state
          const curGoods = list.find(item => item.item_id == id);
          const { item_id, title, market_price, price, img } = curGoods;
          Tracker.dispatch("EXPOSE_SKU_COMPONENT", {
            goodsId: item_id,
            title: title,
            market_price: market_price * 100,
            price: price * 100,
            imgUrl: img
          });
        }
      });

    this.observe = observer;
  }

  endTrack() {
    if (this.observer) {
      this.observer.disconnect();
      this.observe = null;
    }
  }

  handleTagChange = (data) => {
    const { current } = data
    this.resetPage()
    this.setState({
      list: [],
      oddList: [],
      evenList: []
    })

    this.setState({
      curTagId: current
    }, () => {
      this.nextPage()
    })
  }

  filterOpen=(flag)=>{
    this.setState({
      showDrawer:flag
    })
  }

  handleFilterChange = (data) => {
    // this.setState({
    //   showDrawer: true
    // })
    const { current, sort } = data
    //goodsSort null-综合 1-销量倒序（暂时无正序） 2-积分价格倒序 3-积分价格正序

    if(current===3){//如果点击筛选
      this.filterOpen(true);
      return ;
    }
    
    const query = {
      ...this.state.query,
      goodsSort: current === 0
        ? null
        : current === 1
          ? 1
          : (sort > 0 ? 3 : 2)
    } 

    if(this.state.curFilterIdx===current){
      //点击相同菜单项不用操作
      return ;
    }

    this.setState({
      curFilterIdx: current,
      query
    }, () => {
      this.nextPage()
    })
  }

  handleListTypeChange = () => {
    const listType = this.state.listType === 'grid' ? 'default' : 'grid'

    this.setState({
      listType
    })
  }

  handleClickItem = (item) => {
    const { item_id, title, market_price, price, img } = item;
    Tracker.dispatch("TRIGGER_SKU_COMPONENT", {
      goodsId: item_id,
      title: title,
      market_price: market_price * 100,
      price: price * 100,
      imgUrl: img
    });
    const url = `/pages/item/espier-detail?id=${item.item_id}&dtid=${item.distributor_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClickStore = (item) => {
    const url = `/pages/store/index?id=${item.distributor_info.distributor_id}`
    Taro.navigateTo({
      url
    })
  } 

  handleClickParmas = (id, child_id) => {
    const { paramsList, selectParams } = this.state
    paramsList.map(item => {
      if (item.attribute_id === id) {
        item.attribute_values.map(v_item => {
          if (v_item.attribute_value_id === child_id) {
            v_item.isChooseParams = true
          } else {
            v_item.isChooseParams = false
          }
        })
      }
    })
    selectParams.map(item => {
      if (item.attribute_id === id) {
        item.attribute_value_id = child_id
      }
    })
    this.setState({
      paramsList,
      selectParams
    })
  }

  handleClickSearchParams = (type) => {
  
    if (type === 'reset') {
      const { paramsList, selectParams } = this.state
      this.state.paramsList.map(item => {
        item.attribute_values.map(v_item => {
          if (v_item.attribute_value_id === 'all') {
            v_item.isChooseParams = true
          } else {
            v_item.isChooseParams = false
          }
        })
      })
      selectParams.map(item => {
        item.attribute_value_id = 'all'
      })
      this.setState({
        paramsList,
        selectParams
      })
    }

    this.resetPage()
    this.setState({
      list: [],
      oddList: [],
      evenList: []
    }, () => {
      this.nextPage()
    })
  }

  handleViewChange = () => {
    const { listType } = this.state
    if (listType === 'grid') {
      this.setState({
        listType: 'list'
      })
    } else {
      this.setState({
        listType: 'grid'
      })
    }
  }

  handleSearchOn = () => {
    console.log("handleSearchOn")
    this.setState({
      isShowSearch: true
    })
  }

  handleSearchOff = () => {
    this.setState({
      isShowSearch: false
    })
  }

  handleSearchChange = (val) => {
    this.setState({
      query: {
        ...this.state.query,
        keywords: val
      }
    })
  }

  handleSearchClear = () => {
    this.setState({
      isShowSearch: false,
      query: {
        ...this.state.query,
        keywords: ''
      }
    }, () => {
      this.resetPage()
      this.setState({
        list: [],
        oddList: [],
        evenList: []
      }, () => {
        this.nextPage()
      })
    })
  }

  handleClickFilterBlock= ({id,type}) =>{
    const { filterParams }=this.state;
    let newFilterParams;
    if(type==='brand'){
      newFilterParams={
        ...filterParams,
        
      }
    }
  }

  handleConfirm = (val) => {

    Tracker.dispatch("SEARCH_RESULT", {
      keywords: val
    });
    this.setState({
      isShowSearch: false,
      query: {
        ...this.state.query,
        keywords: val,
      }
    }, () => {
      this.resetPage()
      this.setState({
        list: [],
        oddList: [],
        evenList: []
      }, () => {
        this.nextPage()
      })
    })
  }

  render() {
    const {
      list,
      oddList,
      evenList,
      listType,
      curFilterIdx,
      filterList,
      showBackToTop,
      scrollTop,
      page,
      showDrawer,
      paramsList,
      selectParams,
      tagsList,
      curTagId,
      info,
      isShowSearch,
      query,
      useInfo,
      filterConfig:{
        brandList,
        categoryList,
        scoreInternel
      }
    } = this.state
    const { isTabBar = '' } = this.$router.params
    const noData=!page.isLoading && !page.hasNext && !list.length;
    console.log('-----isTabBar----', !isTabBar)
    console.log('-----page----', page)
    console.log('-----useInfo----', useInfo)
    console.log('-----filterConfig----', this.state.filterConfig)
    return (
      <View className='page-goods-list'>
        {
          !isTabBar && <NavBar
            title='商品列表'
            leftIconType='chevron-left'
            fixed='true'
          />
        }
        <Header useInfo={useInfo} />

        <View class="navigation">
          <Image src={require('../../assets/imgs/black.png')} class="navigation_image" />

        </View>

        <View class="content">
          <Tabs
            className='goods-list__tabs'
            custom
            current={curFilterIdx}
            list={filterList}
            onChange={this.handleFilterChange}
          >

          </Tabs>
          <ScrollView
            className={classNames(isTabBar ? 'goods-list__scroll_isTabBar' : 'goods-list__scroll', tagsList.length > 0 && 'with-tag-bar', isTabBar && 'isTabBar')}
            scrollY
            scrollTop={scrollTop}
            scrollWithAnimation
            onScroll={this.handleScroll}
            onScrollToLower={this.nextPage}
          >
            {
              listType === 'grid' &&
              <View className='goods-list goods-list__type-grid'> 
                  {
                    list.map(item => {
                      return (
                        <View
                          className="goods-list__item"
                          key={item.item_id}
                          data-id={item.item_id}
                        >
                          <GoodsItem
                            key={item.item_id}
                            info={item}
                            onClick={() => this.handleClickItem(item)}
                            onStoreClick={() => this.handleClickStore(item)}
                          />
                        </View>
                      );
                    })
                  } 
               
              </View>
            }

            {
              page.isLoading
                ? <Loading>正在加载...</Loading>
                : null
            }
            {
              noData && (<SpNote img='trades_empty.png'>暂无数据~</SpNote>)
            }
          </ScrollView>
        </View>
        {/* <View className='goods-list__toolbar'>
          <View className={`goods-list__search ${(query && query.keywords && !isShowSearch) ? 'on-search' : null}`}>
            <SearchBar
              keyword={query ? query.keywords : ''}
              onFocus={this.handleSearchOn}
              onChange={this.handleSearchChange}
              onClear={this.handleSearchClear}
              onCancel={this.handleSearchOff}
              onConfirm={this.handleConfirm.bind(this)}
            />
            {
              !isShowSearch &&
              <View
                className={classNames('goods-list__type', listType === 'grid' ? 'icon-list' : 'icon-grid')}
                onClick={this.handleViewChange}
              >
              </View>
            }
          </View>
          {
            tagsList.length &&
            <TagsBar
              current={curTagId}
              list={tagsList}
              onChange={this.handleTagChange.bind(this)}
            />
          }
          
        </View> */}

        <AtDrawer
          show={showDrawer}
          right
          mask
          width={`${Taro.pxTransform(630)}`}
          onClose={this.filterOpen.bind(false)}
          class='custom_drawer'
        >
          {
            <View class="wrapper-filter">
              <View class="brand">
                <View class="title">品牌</View>
                <View class="content-filter">
                  {
                    brandList.map((item,index)=>{
                      return (
                        <FilterBlock info={item} type="brand" onClickItem={this.handleClickFilterBlock} />
                      )
                    })
                  }
                </View>
              </View>
              <View class="category">
                <View class="title">分类</View>
                <View class="content-filter">
                  {
                    categoryList.map((item,index)=>{
                      return (
                        <FilterBlock info={item} type="category" onClickItem={this.handleClickFilterBlock} />
                      )
                    })
                  }
                </View>
              </View>
              <View class="score">
                <View class="title">积分区间</View>
                <View class="input-wrap"><AtInput placeholder="最低积分值"/><View class='text'>~</View><AtInput placeholder="最高积分值"/></View>
                {
                    scoreInternel.map((item,index)=>{
                      return (
                        <FilterBlock info={item} type="score" />
                      )
                    })
                  }
              </View>
            </View>
          }
          {/* {
            paramsList.map((item, index) => {
              return (
                <View className='drawer-item' key={`${index}1`}>
                  <View className='drawer-item__title'>
                    <Text>{item.attribute_name}</Text>
                    <View className='at-icon at-icon-chevron-down'> </View>
                  </View>
                  <View className='drawer-item__options'>
                    {
                      item.attribute_values.map((v_item, v_index) => {
                        return (
                          <View
                            className={classNames('drawer-item__options__item', v_item.isChooseParams ? 'drawer-item__options__checked' : '')}
                            // className='drawer-item__options__item'
                            key={`${v_index}1`}
                            onClick={this.handleClickParmas.bind(this, item.attribute_id, v_item.attribute_value_id)}
                          >
                            {v_item.attribute_value_name}
                          </View>
                        )
                      })
                    }
                    <View className='drawer-item__options__none'> </View>
                    <View className='drawer-item__options__none'> </View>
                    <View className='drawer-item__options__none'> </View>
                  </View>
                </View>
              )
            })
          } */}
          <View className='drawer-footer'>
            <Text className='drawer-footer__btn' onClick={this.handleClickSearchParams.bind(this, 'reset')}>重置</Text>
            <Text className='drawer-footer__btn drawer-footer__btn_active' onClick={this.handleClickSearchParams.bind(this, 'submit')}>确定并筛选</Text>
          </View>
        </AtDrawer>



        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
          bottom={30}
        />
        { isTabBar && <TabBar />}
      </View>
    )
  }
}
