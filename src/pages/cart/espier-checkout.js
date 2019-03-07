import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Switch } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtButton, AtInput, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import { Loading, Price, SpCell, AddressPicker } from '@/components'
import api from '@/api'
import { lockScreen } from '@/utils/dom'
import CheckoutItems from './checkout-items'

import './checkout.scss'

@connect(({ cart }) => ({
  fastbuy: cart.fastbuy
}), (dispatch) => ({
  onClearFastbuy: () => dispatch({ type: 'cart/clearFastbuy' })
}))
export default class CartCheckout extends Component {
  constructor (props) {
    super(props)

    this.state = {
      info: null,
      address: null,
      showShippingPicker: false,
      showAddressPicker: false,
      showCheckoutItems: false,
      curCheckoutItems: null,
      total: {
        items_count: '',
        total_fee: '0.00',
        item_fee: '',
        member_discount: '',
        coupon_discount: '',
        freight_fee: ''
      }
    }
  }

  componentDidMount () {
    this.fetch()
  }

  async fetch () {
    // const { point_total: { point_count: pointTotal } } = await api.member.pointDetail()
    // const { cartInfo: info, total, default_address: address } = await api.cart.checkout()
    const { cart_type } = this.$router.params
    let info = null

    if (cart_type === 'fastbuy') {
      const fastBuyItem = this.props.fastbuy
      info = {
        cart: [{
          list: [fastBuyItem],
          cart_total_num: fastBuyItem.num,
          cart_total_price: (fastBuyItem.price * fastBuyItem.num / 100).toFixed(2)
        }]
      }
      this.setState({
        info
      })
    } else {
      this.props.onClearFastbuy()
    }

    let total_fee = 0
    let items_count = 0
    const items = info.cart[0].list.map((item) => {
      const { item_id, num } = item
      total_fee += +(item.price)
      items_count += +(item.num)
      return {
        item_id,
        num
      }
    })

    this.params = {
      items,
      receipt_type: 'logistics',
      order_type: 'normal',
      promotion: 'normal',
      member_discount: false
    }
    this.setState({
      total: {
        items_count,
        total_fee: total_fee.toFixed(2)
      }
    })
  }

  getParams () {
    const { name: receiver_name, mobile: receiver_mobile, zip: receiver_zip, addrdetail: receiver_address } = this.state.address
    const params = {
      ...this.params,
      receiver_name,
      receiver_mobile,
      receiver_state: '浙江省',
      receiver_city: '杭州市',
      receiver_district: '上城区',
      receiver_address,
      receiver_zip: receiver_zip || '2100000'
    }

    return params
  }

  async calcOrder () {
    const params = this.getParams()
    const data = await api.cart.total(params)

    const { item_fee, member_discount = 0, coupon_discount = 0, freight_fee = 0, total_fee } = data
    const total = {
      ...this.state.total,
      item_fee,
      member_discount,
      coupon_discount,
      freight_fee,
      total_fee
    }

    this.setState({
      total
    })
  }

  handleAddressChange = (address) => {
    this.setState({
      address
    }, () => {
      this.calcOrder()
    })
    if (!address) {
      this.setState({
        showAddressPicker: true
      })
    }
  }

  handleShippingChange = (type) => {
    console.log(type)
  }

  handleClickItems (items) {
    this.setState({
      curCheckoutItems: items
    })
    this.toggleCheckoutItems()
  }

  toggleAddressPicker (isOpend) {
    if (isOpend === undefined) {
      isOpend = !this.state.showAddressPicker
    }

    lockScreen(isOpend)
    this.setState({ showAddressPicker: isOpend })
  }

  toggleCheckoutItems (isOpend) {
    if (isOpend === undefined) {
      isOpend = !this.state.showCheckoutItems
    }

    lockScreen(isOpend)
    this.setState({ showCheckoutItems: isOpend })
  }

  render () {
    const { info, address, total, showShippingPicker, showAddressPicker, showCheckoutItems, curCheckoutItems } = this.state

    if (!info) {
      return <Loading />
    }

    return (
      <View className='page-checkout'>
        <ScrollView
          scrollY
          className='checkout__wrap'
        >
          <View
            className='address-info'
            onClick={this.toggleAddressPicker.bind(this, true)}
          >
            <SpCell
              isLink
              icon='map-pin'
            >
              {
                address
                  ? <View className='address-info__bd'>
                      <Text className='address-info__receiver'>
                        收货人：{address.name} {address.mobile}
                      </Text>
                      <Text className='address-info__addr'>
                        收货地址：{address.addrdetail}
                      </Text>
                    </View>
                  : <View className='address-info__bd'>请选择收货地址</View>
              }
            </SpCell>
          </View>

          <View className='cart-list'>
            {
              info.cart.map(cart => {
                return (
                  <View
                    className='cart-group'
                    key={cart.shop_id}
                  >
                    <View className='cart-group__shop'>{cart.shop_name}</View>
                    <View className='sec cart-group__cont'>
                      <SpCell
                        className='trade-items'
                        value={`共${cart.cart_total_num}件商品`}
                        // onClick={this.handleClickItems.bind(this, cart.items)}
                      >
                        <View className='trade-items__bd'>
                          {
                            cart.list.map((item, idx) => {
                              return (
                                <Image
                                  key={idx}
                                  className='trade-item__img'
                                  mode='aspectFill'
                                  src={Array.isArray(item.pics) ? item.pics[0] : item.pics }
                                />
                              )
                            })
                          }
                          {cart.list.length === 1 && (
                            <Text className='trade-item__title'>{cart.list[0].item_name}</Text>
                          )}
                        </View>
                      </SpCell>
                      <SpCell
                        className='sec trade-remark'
                        border={false}
                      >
                        <AtInput
                          className='trade-remark__input'
                          placeholder='给商家留言：选填（50字以内）'
                        />
                      </SpCell>
                    </View>
                  </View>
                )
              })
            }
          </View>

          {/*<View className='sec trade-point'>
            <SpCell
              title='积分'
              border={false}
            >
              <View className='trade-point__wrap'>
                <Text className='trade-point__hint'>可用1000积分(每1积分抵扣1元)可抵扣 <Price value={pointPrice} /></Text>
                <Switch
                  checked
                  value={usePoint}
                  onChange={this.handlePointChange}
                />
              </View>
            </SpCell>
            <AtInput
              className='trade-point__input'
              type='text'
              value={point}
              placeholder='全部抵扣或在此输入积分数'
            />
          </View>

          <SpCell
            className='trade-invoice'
            title='申请发票'
          >
            <Switch
              checked
            />
          </SpCell>*/}

          <View className='sec trade-sub-total'>
            <SpCell
              className='trade-sub-total__item'
              title='商品金额'
            >
              <Price value={total.item_fee} />
            </SpCell>
            <SpCell
              className='trade-sub-total__item'
              title='运费'
            >
              <Price value={total.freight_fee}></Price>
            </SpCell>
            <SpCell
              className='trade-sub-total__item'
              title='优惠券'
            >
              <Price value={total.coupon_discount} />
            </SpCell>
          </View>
        </ScrollView>

        <AddressPicker
          isOpend={showAddressPicker}
          value={address}
          onChange={this.handleAddressChange}
          onClickBack={this.toggleAddressPicker.bind(this, false)}
        />

        <CheckoutItems
          isOpend={showCheckoutItems}
          list={curCheckoutItems}
          onClickBack={this.toggleCheckoutItems.bind(this, false)}
        />

        <AtActionSheet
          isOpend={showShippingPicker}
          onClose={() => this.setState({ showShippingPicker: false })}
        >
          <AtActionSheetItem onClick={this.handleShippingChange}>顺丰</AtActionSheetItem>
          <AtActionSheetItem onClick={this.handleShippingChange}>自提</AtActionSheetItem>
        </AtActionSheet>

        <View className='toolbar checkout-toolbar'>
          <View className='checkout__total'>
            共<Text className='total-items'>{total.items_count}</Text>件，合计: <Price primary value={total.total_fee} />
          </View>
          <AtButton
            circle
            type='primary'
            className='btn-confirm-order'
          >提交订单</AtButton>
        </View>
      </View>
    )
  }
}
