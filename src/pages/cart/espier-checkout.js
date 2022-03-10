import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { AtButton, AtInput } from 'taro-ui'
import { useImmer } from 'use-immer'
import { SpPage, SpPrice, SpCell, SpOrderItem } from '@/components'
import { View, Text } from '@tarojs/components'
import { changeCoupon } from '@/store/slices/cart'
import { updateChooseAddress } from '@/store/slices/user'
import {
  isObjectsValue,
  isWeixin,
  pickBy,
  authSetting,
  merchantIsvaild,
  showToast,
  isWeb,
  redirectUrl
} from '@/utils'
import { useAsyncCallback } from '@/hooks'
import { PAYTYPE } from '@/consts'
import _cloneDeep from 'lodash/cloneDeep'
import api from '@/api'
import doc from '@/doc'

import { initialState } from './const'

import CompDeliver from './comps/comp-deliver'
import CompSelectPackage from './comps/comp-selectpackage'
import CompPaymentPicker from './comps/comp-paymentpicker'

import './espier-checkout.scss'

function CartCheckout(props) {
  const $instance = getCurrentInstance()
  const {
    type,
    order_type = 'normal',
    shop_id: distributor_id,
    cart_type,
    seckill_id = null,
    ticket: seckill_ticket,
    pay_type,
    source, // 不知道什么情况下会存在值
    bargain_id, // 砍价活动id
    team_id,
    group_id // 团购id
  } = $instance.router?.params || {}

  const [state, setState] = useAsyncCallback(initialState)

  const dispatch = useDispatch()
  const { address } = useSelector((state) => state.user)
  const { pointName } = useSelector((state) => state.sys)
  const { coupon } = useSelector((state) => state.cart)

  const {
    detailInfo,
    payType,
    payChannel,
    submitLoading,
    isPointitemGood,
    totalInfo,
    shoppingGuideData,
    receiptType,
    // distributorInfo,
    invoiceTitle,
    packInfo,
    isNeedPackage,
    disabledPayment,
    paramsInfo,
    couponInfo,
    remark
  } = state

  useEffect(() => {
    setState((draft) => {
      draft.isPointitemGood = type === 'pointitem'
    })
  }, [isPointitemGood])

  useEffect(() => {
    getTradeSetting()
    // tode 此处应有埋点
    return () => {
      dispatch(changeCoupon()) // 清空优惠券信息
      dispatch(updateChooseAddress(null)) // 清空地址信息
    }
  }, [])

  useEffect(() => {
    calcOrder()
  }, [address, coupon, payType])

  const getTradeSetting = async () => {
    let data = await api.trade.tradeSetting()
    setState((draft) => {
      draft.packInfo = data
    })
  }

  // 选择是否需要包装
  const changeNeedPackage = (isChecked) => {
    setState((draft) => {
      draft.isNeedPackage = isChecked
    })
  }

  const onSubmitPayChange = async () => {
    if (submitLoading) return
    let isValid = await merchantIsvaild({ distributor_id }) // 判断当前店铺关联商户是否被禁用 isVaild：true有效
    if (!isValid) {
      showToast('该商品已下架')
      return
    }
    setState(
      (draft) => {
        draft.submitLoading = true
      },
      ({ submitLoading }) => {
        console.log('提交按钮', getParamsInfo(submitLoading))
        if (isWeixin) {
          let templeparams = {
            temp_name: 'yykweishop',
            source_type: receiptType === 'logistics' ? 'logistics_order' : 'ziti_order'
          }
          api.user.newWxaMsgTmpl(templeparams).then((tmlres) => {
            if (tmlres.template_id && tmlres.template_id.length > 0) {
              wx.requestSubscribeMessage({
                tmplIds: tmlres.template_id,
                success() {
                  handlePay()
                },
                fail() {
                  handlePay()
                }
              })
            } else {
              handlePay()
            }
          })
        } else {
          handlePay()
        }
      }
    )
  }

  const handlePay = async () => {
    Taro.showLoading({
      title: '正在提交',
      mask: true
    })
    let urlLink = ''
    let redirectPath = ''
    let order_id = ''
    let res_info = {}
    let payErr = ''
    try {
      let params = getParamsInfo()
      if (isWeb) {
        res_info = await api.trade.h5create({
          ...params,
          pay_type: payType === PAYTYPE.ALIH5 ? PAYTYPE.ALIH5 : 'wxpay'
        })
        redirectPath = `/subpage/pages/cashier/index?order_id=${res_info.order_id}`
        if (payType === PAYTYPE.WXH5 || payType === PAYTYPE.ALIH5) {
          redirectPath += `&pay_type=${payType}`
        }
        redirectUrl(api, redirectPath)
        return
      } else {
        res_info = await api.trade.create(params)
        order_id = res_info.trade_info.order_id
      }
      // tode 应该有埋点
    } catch (e) {
      Taro.showToast({
        title: e.message,
        icon: 'none',
        mask: true
      })
      payErr = e
      resolvePayError(e)
    }

    Taro.hideLoading()
    if (!order_id) return

    setState((draft) => {
      draft.submitLoading = false
    })

    payErr = null
    let payRes
    try {
      if (res_info.package) {
        // tode 埋点
        console.log('我需要支付')
        payRes = await Taro.requestPayment(res_info)
      }
      if (!payRes.result) {
        urlLink = `/subpage/pages/trade/detail?id=${order_id}`
      }
    } catch (e) {
      console.log('我发生错误', e)
    }

    if (!payErr) {
      // 此处调取有数的api
      await Taro.showToast({
        title: '支付成功',
        icon: 'success'
      })
      if (type === 'group') {
        urlLink = `/marketing/pages/item/group-detail?team_id=${res_info.team_id}`
      }
    }

    if (payErr?.errMsg.indexOf('fail cancel') >= 0) {
      // tode 取消埋点
      urlLink = `/subpage/pages/trade/detail?id=${order_id}`
    }

    if (urlLink) {
      Taro.redirectTo({
        url: urlLink
      })
    }
    console.log(res_info, order_id, '支付订单啊啊啊啊')
  }

  const resolvePayError = (e) => {
    if (e.res.data.data.status_code === 422) {
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    }
    setState((draft) => {
      draft.submitLoading = false
    })
  }

  const handleSwitchExpress = ({ receipt_type, distributorInfo }) => {
    // 切换配送模式
    setState((draft) => {
      draft.receiptType = receipt_type
      // draft.distributorInfo = distributorInfo
    })
  }

  const handleInvoiceClick = () => {
    // 开发票
    authSetting('invoiceTitle', async () => {
      const res = await Taro.chooseInvoiceTitle()
      if (res.errMsg === 'chooseInvoiceTitle:ok') {
        const {
          type,
          content,
          company_address,
          bankname,
          bankaccount,
          company_phone,
          registration_number
        } = pickBy(res, doc.checkout.INVOICE_TITLE)

        let params_info = {
          invoice_type: 'normal',
          invoice_content: {
            title: type == 0 ? 'unit' : 'individual',
            content,
            company_address,
            registration_number,
            bankname,
            bankaccount,
            company_phone
          }
        }
        setState((draft) => {
          draft.invoiceTitle = content
          draft.paramsInfo = { ...paramsInfo, ...params_info }
        })
      }
    })
  }

  const resetInvoice = (e) => {
    e.stopPropagation()
    setState((draft) => {
      draft.invoiceTitle = ''
      draft.paramsInfo = { ...paramsInfo, invoice_type: '', invoice_content: {} }
    })
  }

  const handleCouponsClick = async () => {
    const { cart_type, distributor_id: id } = paramsInfo
    let items_filter = detailInfo.filter((item) => item.order_item_type !== 'gift')
    items_filter = items_filter.map((item) => {
      const { item_id, num, total_fee: price } = item
      return {
        item_id,
        num,
        price
      }
    })
    let cus_item = JSON.stringify(items_filter)
    Taro.navigateTo({
      url: `/others/pages/cart/coupon-picker?items=${cus_item}&is_checkout=true&cart_type=${cart_type}&distributor_id=${
        distributor_id || id
      }` // &source=${source}不确定要不要传
    })
    dispatch(changeCoupon(couponInfo))
  }

  const handlePaymentChange = async (payType, payChannel) => {
    console.log(payType, payChannel)
    setState((draft) => {
      draft.payType = payType
      draft.payChannel = payChannel
    })
  }

  const handleRemarkChange = (val) => {
    // 商家留言
    setState((draft) => {
      draft.remark = val
    })
  }

  const calcOrder = async () => {
    Taro.showLoading({
      title: '加载中',
      mask: true
    })
    const cus_parmas = getParamsInfo()
    let data
    try {
      data = await api.cart.total(cus_parmas)
    } catch (e) {
      resolvePayError(e)
    }
    Taro.hideLoading()

    if (!data) return

    const {
      items,
      item_fee,
      totalItemNum: items_count,
      member_discount = 0,
      coupon_discount = 0,
      discount_fee,
      freight_fee = 0,
      coupon_info = {},
      total_fee,
      invoice_status,
      extraTips = ''
    } = data

    if (isObjectsValue(coupon_info)) {
      setState((draft) => {
        draft.couponInfo = {
          type: 'coupon',
          value: {
            title: coupon_info.info,
            card_id: coupon_info.id,
            code: coupon_info.coupon_code,
            discount: coupon_info.discount_fee
          }
        }
      })
    } else {
      setState((draft) => {
        draft.couponInfo = {}
      })
    }

    const total = {
      ...totalInfo,
      item_fee,
      discount_fee,
      member_discount,
      coupon_discount,
      freight_fee,
      total_fee,
      items_count,
      invoice_status // 是否开启开发票
    }
    Taro.hideLoading()

    setState((draft) => {
      draft.totalInfo = total
      draft.detailInfo = pickBy(items, doc.checkout.CHECKOUT_GOODS_ITEM)
      draft.paramsInfo = { ...paramsInfo, ...cus_parmas }
    })
    if (extraTips) {
      Taro.showModal({
        content: extraTips,
        confirmText: '知道了',
        showCancel: false
      })
    }
  }

  const getParamsInfo = (submitLoading = false) => {
    const { value, activity } = getActivityValue() || {}
    let receiver = pickBy(address, doc.checkout.RECEIVER_ADDRESS)
    if (receiptType === 'ziti') {
      receiver = pickBy({}, doc.checkout.RECEIVER_ADDRESS)
    }

    let cus_parmas = {
      ...paramsInfo,
      ...activity,
      ...receiver,
      receipt_type: receiptType,
      distributor_id,
      cart_type,
      order_type: bargain_id ? 'bargain' : value,
      promotion: 'normal',
      member_discount: 0,
      coupon_discount: 0,
      not_use_coupon: 0
    }

    if (coupon) {
      const { type, value } = coupon
      cus_parmas.not_use_coupon = value?.code ? 0 : 1
      cus_parmas.coupon_discount = type === 'coupon' && value.code ? value.code : undefined
      cus_parmas.member_discount = type === 'member' && value ? 1 : 0
    }

    const { packName, packDes } = packInfo
    cus_parmas.pack = isNeedPackage ? { packName, packDes } : undefined
    cus_parmas.bargain_id = bargain_id || undefined

    if (submitLoading) {
      // 提交时候获取参数 把留言信息传进去
      cus_parmas.remark = remark
      cus_parmas.pay_type = payType
      cus_parmas.pay_channel = payChannel
    }

    return cus_parmas
  }

  const getActivityValue = () => {
    let value = ''
    let activity = {}
    switch (type) {
      case 'groups':
        value = 'normal_groups'
        activity = Object.assign(activity, { bargain_id: group_id })
        if (team_id) {
          activity = Object.assign(activity, { team_id })
        }
        break
      case 'seckill':
        value = 'normal_seckill'
        activity = Object.assign(activity, { seckill_id, seckill_ticket })
        break
      default:
        value = 'normal'
        activity = {}
    }
    return {
      value,
      activity
    }
  }

  const renderFooter = () => {
    return (
      <View className='checkout-toolbar'>
        <View className='checkout-toolbar__total'>
          共<Text>{totalInfo.items_count}</Text>
          件商品　总计:
          <SpPrice unit='cent' className='primary-price' value={totalInfo.total_fee} />
        </View>
        <AtButton
          type='primary'
          className='checkout-toolbar__btn'
          customStyle='background: var(--color-primary); border-color: var(--color-primary)'
          loading={submitLoading}
          disabled={receiptType !== 'ziti' && !isObjectsValue(address)}
          onClick={onSubmitPayChange}
        >
          提交订单
        </AtButton>
      </View>
    )
  }

  const goodsComp = () => {
    return (
      <View className='cart-list'>
        <View className='cart-checkout__group'>
          <View className='cart-group__cont'>
            <View className='sp-order-item__idx'>
              商品清单 <Text style={{ color: '#222' }}>（{totalInfo.items_count}）</Text>
            </View>
            {detailInfo.map((item, idx) => (
              <View className='sp-order-item__wrap' key={idx}>
                <SpOrderItem
                  info={item}
                  showExtra={false}
                  showDesc
                  isPointitemGood={isPointitemGood}
                  renderDesc={
                    <View className='sp-order-item__desc'>
                      {item.discount_info &&
                        item.order_item_type !== 'gift' &&
                        item.discount_info.map((discount) => (
                          <Text className='sp-order-item__discount' key={discount.type}>
                            {discount.info}
                          </Text>
                        ))}
                    </View>
                  }
                  customFooter
                  renderFooter={
                    <View className='sp-order-item__ft'>
                      <SpPrice
                        unit='cent'
                        className='sp-order-item__price'
                        value={item.price || 100}
                      />
                      <Text className='sp-order-item__num'>x {item.num || 1}</Text>
                    </View>
                  }
                />
              </View>
            ))}
          </View>
          <View className='cart-group__cont cus-input'>
            <SpCell className='trade-remark' border={false}>
              <AtInput
                className='trade-remark__input'
                placeholder='给商家留言：选填（50字以内）'
                onChange={handleRemarkChange}
                value={remark}
                maxLength={50}
              />
            </SpCell>
          </View>
        </View>
      </View>
    )
  }

  console.log(couponInfo, 'couponInfo', coupon)
  const couponText =
    couponInfo.type === 'member'
      ? '会员折扣'
      : couponInfo?.value?.code
      ? couponInfo?.value?.title
      : ''

  return (
    <SpPage className='page-cart-checkout' renderFooter={renderFooter()}>
      {isObjectsValue(shoppingGuideData) && (
        <View className='shopping-guide__header'>
          此订单商品来自“{shoppingGuideData.store_name}”导购“ {shoppingGuideData.name}”的推荐
        </View>
      )}
      <View className='cart-checkout__address'>
        <CompDeliver
          distributor_id={distributor_id}
          address={address}
          onChangReceiptType={handleSwitchExpress}
        />
      </View>
      {goodsComp()}
      {isWeixin && !isPointitemGood && !bargain_id && totalInfo.invoice_status && (
        <SpCell
          isLink
          title='开发票'
          className='cart-checkout__invoice'
          onClick={handleInvoiceClick}
        >
          <View className='invoice-title'>
            {invoiceTitle && (
              <View onClick={(e) => resetInvoice(e)} className='icon-close invoice-close' />
            )}
            {invoiceTitle || '否'}
          </View>
        </SpCell>
      )}
      {type !== 'group' && type !== 'seckill' && !bargain_id && !isPointitemGood && (
        <SpCell
          isLink
          className='cart-checkout__coupons'
          title='优惠券'
          onClick={handleCouponsClick}
          value={couponText || '请选择'}
        />
      )}
      {packInfo.is_open && (
        <View className='cart-checkout__pack'>
          <CompSelectPackage
            isPointitemGood={isPointitemGood}
            isChecked={isNeedPackage}
            onHandleChange={changeNeedPackage}
            packInfo={packInfo}
          />
        </View>
      )}

      <View className='cart-checkout__pay'>
        <CompPaymentPicker
          type={payType}
          isPointitemGood={isPointitemGood}
          distributor_id={distributor_id}
          disabledPayment={disabledPayment}
          onChange={handlePaymentChange}
        />
      </View>

      {!isPointitemGood && (
        <View className='cart-checkout__total'>
          <SpCell className='trade-sub__item' title='商品金额：'>
            <SpPrice unit='cent' value={totalInfo.item_fee} />
          </SpCell>
          <SpCell className='trade-sub__item' title='优惠金额：'>
            <SpPrice unit='cent' primary value={-1 * totalInfo.discount_fee} />
          </SpCell>
          <SpCell className='trade-sub__item' title='运费：'>
            <SpPrice unit='cent' value={totalInfo.freight_fee} />
          </SpCell>
        </View>
      )}
    </SpPage>
  )
}

CartCheckout.options = {
  addGlobalClass: true
}
export default CartCheckout
