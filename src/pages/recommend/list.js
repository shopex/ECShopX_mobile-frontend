import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { withPager, withBackToTop } from '@/hocs'
import { AtDrawer } from 'taro-ui'
import { BackToTop, Loading, RecommendItem, NavBar, TabBar, SpNote } from '@/components'
import ListSearch from './comps/list-search'
import api from '@/api'
import { pickBy } from '@/utils'
import S from '@/spx'

import './list.scss'

@withPager
@withBackToTop
export default class RecommendList extends Component {
  static config = {
    navigationBarTitleText: '种草'
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      showDrawer: false
    }
  }

  componentDidShow () {
    Taro.showLoading()
    this.resetPage()
    this.setState({
      list: [],
    })
    setTimeout(()=>{
      this.nextPage()
      Taro.hideLoading()
    }, 200)

    // this.praiseNum()
  }

  async fetch (params) {
    const { page_no: page, page_size: pageSize } = params
    const article_query = {
      article_type: 'bring',
      page,
      pageSize
    }
    const { list, total_count: total } = S.getAuthToken() ? await api.article.authList(article_query) : await api.article.list(article_query)

    const nList = pickBy(list, {
      img: 'image_url',
      item_id: 'article_id',
      title: 'title',
      author: 'author',
      summary: 'summary',
      head_portrait: 'head_portrait',
      isPraise: 'isPraise',
      articlePraiseNum: 'articlePraiseNum.count',
    })

    nList.map(item =>{
      if(!item.articlePraiseNum) {
        item.articlePraiseNum = 0
      }
    })

    this.setState({
      list: [...this.state.list, ...nList],
    })

    return {
      total
    }
  }

  handleClickItem = (item) => {
    const url = `/pages/recommend/detail?id=${item.item_id}`
    Taro.navigateTo({
      url
    })
  }

  handleClickFilter = () => {
    this.setState({
      showDrawer: true
    })
  }

  render () {
    const { list, showBackToTop, scrollTop, page, showDrawer } = this.state

    return (
      <View className='page-goods-list page-recommend-list'>
        <View className='list-header'>
          <View class="search-bar">
            <ListSearch
              onConfirm={this.handleConfirm.bind(this)}
            />
          </View>
          <View className="filter-icon" onClick={this.handleClickFilter.bind(this)}>
            <Text class="icon-list" />
            分类
          </View>
        </View>
        <AtDrawer
          show={showDrawer}
          right
          mask
          width={`${Taro.pxTransform(500)}`}
        >
          {
            /* paramsList.map((item, index) => {
              return (
                <View className='drawer-item' key={index}>
                  <View className='drawer-item__title'>
                    <Text>{item.attribute_name}</Text>
                    <View className='at-icon at-icon-chevron-down'> </View>
                  </View>
                  <View className='drawer-item__options'>
                    {
                      item.attribute_values.map((v_item, v_index) => {
                        return (
                          <View
                            className={classNames('drawer-item__options__item' ,v_item.isChooseParams ? 'drawer-item__options__checked' : '')}
                            // className='drawer-item__options__item'
                            key={v_index}
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
            }) */
          }
          {
            // <View className='drawer-item'>
            //   <View className='drawer-item__title'>
            //     <Text>系列</Text>
            //     <View className='at-icon at-icon-chevron-down'> </View>
            //   </View>
            //   <View className='drawer-item__options'>
            //     <View className='drawer-item__options__item'>全部</View>
            //     <View className='drawer-item__options__item'>茶籽精萃</View>
            //     <View className='drawer-item__options__item'>橄榄</View>
            //     <View className='drawer-item__options__item'>火山岩泥</View>
            //     <View className='drawer-item__options__item'>生机展颜</View>
            //     <View className='drawer-item__options__none'> </View>
            //     <View className='drawer-item__options__none'> </View>
            //     <View className='drawer-item__options__none'> </View>
            //   </View>
            // </View>
            // <View className='drawer-item'>
            //   <View className='drawer-item__title'>
            //     <Text>系列</Text>
            //     <View className='at-icon at-icon-chevron-down'> </View>
            //   </View>
            //   <View className='drawer-item__options'>
            //     <View className='drawer-item__options__item'>全部</View>
            //     <View className='drawer-item__options__item'>茶籽精萃</View>
            //     <View className='drawer-item__options__item'>橄榄</View>
            //     <View className='drawer-item__options__item'>火山岩泥</View>
            //     <View className='drawer-item__options__item'>生机展颜</View>
            //     <View className='drawer-item__options__none'> </View>
            //     <View className='drawer-item__options__none'> </View>
            //     <View className='drawer-item__options__none'> </View>
            //   </View>
            // </View>
          }
          <View className='drawer-footer'>
            <Text className='drawer-footer__btn' onClick={this.handleClickSearchParams.bind(this, 'reset')}>重置</Text>
            <Text className='drawer-footer__btn drawer-footer__btn_active' onClick={this.handleClickSearchParams.bind(this, 'submit')}>确定</Text>
          </View>
        </AtDrawer>
        <View className='goods-list__toolbar'>
          <NavBar
            leftIconType='chevron-left'
            fixed='true'
          />
        </View>

        <ScrollView
          className='goods-list__scroll'
          scrollY
          scrollTop={scrollTop}
          scrollWithAnimation
          onScroll={this.handleScroll}
          onScrollToLower={this.nextPage}
        >
          <View className='goods-list goods-list__type-grid'>
            {
              list.map(item => {
                return (
                  <RecommendItem
                    key={item.item_id}
                    info={item}
                    onClick={() => this.handleClickItem(item)}
                  />
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

        <BackToTop
          show={showBackToTop}
          onClick={this.scrollBackToTop}
        />

      <TabBar current={2} />
      </View>
    )
  }
}
