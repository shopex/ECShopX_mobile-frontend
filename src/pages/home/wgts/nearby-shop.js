import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { useAsyncCallback } from '@/hooks'
import api from '@/api'
import { SpNoShop, SpImage, SpShopCoupon, SpPrice } from '@/components'
import { classNames, styleNames, isEmpty } from '@/utils'
import './nearby-shop.scss'

const initialState = {
  activeIndex: 0,
  shopList: [],
  scrollLeft: 0
}

function WgtNearbyShop(props) {
  const { info } = props
  if (!info) {
    return null
  }

  console.log('info,我是附近商家组建拉', info)

  const [state, setState] = useAsyncCallback(initialState)
  const { activeIndex, shopList } = state
  const { location } = useSelector((state) => state.user)

  const { base, seletedTags, productLabel } = info

  // useEffect(() => {
  //   console.log(state.activeIndex, location)
  //   init()
  // }, [state.activeIndex])

  useEffect(() => {
    console.log('location:', location)
    init(activeIndex)
  }, [location])

  const init = async (idx) => {
    let lat, lng, province, city, district
    if (location) {
      lat = location?.lat
      lng = location?.lng
      province = location?.province || '北京市'
      city = location?.city || '北京市'
      district = location?.district || '昌平区'
    }
    let params = {
      distributor_tag_id: seletedTags[idx]?.tag_id,
      show_discount: 1,
      // 根据经纬度或地区查询
      type: location?.lat ? 0 : 1,
      sort_type: 1,
      show_items: 1
    }
    if (location) {
      params = {
        ...params,
        lat,
        lng,
        province: province,
        city: city,
        area: district
      }
    }
    const { list } = await api.shop.getNearbyShop(params)
    setState((v) => {
      v.shopList = list
      v.scrollLeft = 0 + Math.random() //  //在小程序端必须这么写才能回到初始值
    })
  }

  const showMore = () => {
    Taro.navigateTo({
      url: '/subpages/ecshopx/shop-list'
    })
  }

  const handleStoreClick = (id) => {
    const url = `/subpages/store/index?id=${id}`
    Taro.navigateTo({
      url
    })
  }

  const classification = (val) => {
    if (val == 'business') {
      //商家
      return seletedTags.map((item, index) => (
        <View
          className={classNames(`tag-item`, {
            'active': state.activeIndex == index
          })}
          key={item.tag_id}
          onClick={() =>
            setState(
              (draft) => {
                draft.activeIndex = index
              },
              ({ activeIndex }) => {
                init(activeIndex)
              }
            )
          }
        >
          {item.tag_name}
        </View>
      ))
    } else if (val == 'productLabels') {
      //商品标签
      return productLabel.map((item, index) => (
        <View
          className={classNames(`tag-item`, {
            'active': state.activeIndex == index
          })}
          key={item.tag_id}
          onClick={() =>
            setState(
              (draft) => {
                draft.activeIndex = index
              },
              ({ activeIndex }) => {
                init(activeIndex)
              }
            )
          }
        >
          {item.tag_name}
        </View>
      ))
    } else {
      // 全部
      const modifiedSelectedTags = seletedTags.map((obj) => ({ ...obj, types: 'business' }))
      const modifiedProductLabel = productLabel.map((obj) => ({ ...obj, types: 'productLabels' }))
      const arr = [...modifiedSelectedTags, ...modifiedProductLabel]
      return arr.map((item, index) => (
        <View
          className={classNames(`tag-item`, {
            'active': state.activeIndex == index
          })}
          key={item.tag_id}
          onClick={() =>
            setState(
              (draft) => {
                draft.activeIndex = index
              },
              ({ activeIndex }) => {
                init(activeIndex)
              }
            )
          }
        >
          {item.tag_name}
        </View>
      ))
    }
  }

  return (
    <View
      className={classNames('wgt wgt-nearby-shop', {
        wgt__padded: base.padded
      })}
    >
      {base.title && (
        <View className='wgt-head'>
          <View className='wgt-hd'>
            <Text className='wgt-title'>{base.title}</Text>
            <Text className='wgt-subtitle'>{base.subtitle}</Text>
          </View>
          <View className='wgt-more' onClick={showMore}>
            <View className='three-dot'></View>
          </View>
          {/* <Text className='more' onClick={showMore}>
              查看更多
            </Text> */}
        </View>
      )}

      <View className='nearby-shop-content'>
        <ScrollView className='scroll-tab' scrollX>
          {classification(base.navigation_display)}
        </ScrollView>

        <View className='shop-list'>
          {shopList.map((item, index) => {
            return (
              <View className='shop-list-del' key={index}>
                <SpImage
                  className='shop-logo'
                  src='item.logo || shop_default_logo.png'
                  circle={16}
                  width={100}
                  height={100}
                />
                <View className='shop-del'>
                  <View className='shop-names'>
                    <View className='name'>{item.name}</View>
                    {/* <View className='deliver'>商家自配</View> */}
                  </View>
                  <View className='score'>
                    <View className='sales'>
                      {/* <Text className='monthly'>评分: 4.9</Text> */}
                      <Text>月销8888</Text>
                    </View>
                    <View className='sales'>
                      {item.distance_show.toFixed(2)}
                      {item.distance_unit}
                    </View>
                  </View>

                  {base.show_coupon && (
                    <ScrollView scrollX className='coupon-list' scrollLeft={state.scrollLeft}>
                      {item.discountCardList.map((coupon, cindex) => {
                        <SpShopCoupon
                          fromStoreIndex
                          className='coupon-index'
                          info={coupon.title}
                          key={`shop-coupon__${cindex}`}
                          // onClick={() => {
                          //   Taro.navigateTo({
                          //     url: `/subpages/marketing/coupon-center?distributor_id=${0}`
                          //   })
                          // }}
                        />
                      })}
                    </ScrollView>
                  )}

                  <ScrollView scrollX>
                    <View className='coupon-commodity-all'>
                      <View className='coupon-commodity-list'>
                        <SpImage
                          className='shop-logo'
                          src='shop_default_logo.png'
                          circle={16}
                          width={150}
                          height={150}
                        />
                        <View className='coupon-commodity-title'>
                          日本原装日本原装比日本原装比日本原装比日本原装比日本原装比
                        </View>
                        <SpPrice className='market-price' size={32} value='12'></SpPrice>
                        <View className='coupon-commodity-price'>¥239.10</View>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            )
          })}

          <View className='ac_btn'>
            <View className='more'>
              <Text className='iconfont icon-spiritling-dingwei'></Text>
              更多附近商家
            </View>
            <Text className='iconfont icon-qianwang-01'></Text>
          </View>
        </View>

        {/* <ScrollView className='scroll-list' scrollX scrollLeft={state.scrollLeft}>
          {state.shopList.map((item) => (
            <View
              className='shop-item'
              key={item.distributor_id}
              onClick={() => handleStoreClick(item.distributor_id)}
            >
              <View
                className='shop-banner'
                style={styleNames({
                  'background-image': `url(${
                    item.banner || process.env.APP_IMAGE_CDN + 'shop_default_bg.png'
                  })`
                })}
              >
                <View
                  className='logo-wrap'
                  style={styleNames({
                    'width': '50px',
                    'height': '50px',
                    'bottom': '-25px',
                    'border-radius': '50px',
                    'padding': '2px'
                  })}
                >
                  <SpImage
                    className='shop-logo'
                    src={item.logo || 'shop_default_logo.png'}
                    circle={92}
                    width={92}
                    height={92}
                  />
                </View>
              </View>

              <View className='shop-info-block'>
                <View className='shop-name'>{item.name}</View>
                {base.show_coupon && (
                  <ScrollView className='shop-ft' scrollX>
                    {item.discountCardList.map((coupon, index) => (
                      <View className='coupon-item' key={`coupon-item__${index}`}>
                        {coupon.title}
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
          ))}
          {state.shopList.length == 0 && (
            <View className='empty-con'>
              <SpImage src='empty_data.png' width={292} height={224} />
              <View className='empty-tip'>更多商家接入中，敬请期待</View>
            </View>
          )}
        </ScrollView> */}
      </View>
    </View>
  )
}

WgtNearbyShop.options = {
  addGlobalClass: true
}

export default WgtNearbyShop
