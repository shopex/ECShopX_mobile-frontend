import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro, { getCurrentInstance } from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { AtTabs, AtInput, AtTextarea } from 'taro-ui'
import { SpPage, SpButton, SpCell, SpCheckbox, SpImage, SpInputNumber, SpSelect, SpUpload, SpPrice } from '@/components'
import { View, Text, Picker } from "@tarojs/components"
import { pickBy, showToast, isNumber } from '@/utils'
import "./after-sale.scss";

const initialState = {
  info: null,
  curTabIdx: 0,
  tabList: [
    { title: '仅退款', status: 'ONLY_REFUND' },
    { title: '退货退款', status: 'REFUND_GOODS' }
  ],
  reason: '',
  reasons: [
    '客户现在不想购买',
    '客户商品价格较贵',
    '客户价格波动',
    '客户商品缺货',
    '客户重复下单',
    '客户订单商品选择有误',
    '客户支付方式选择有误',
    '客户收货信息填写有误',
    '客户发票信息填写有误',
    '客户无法支付订单',
    '客户长时间未付款',
    '客户其他原因'
  ],
  refundFee: 0,
  refundPoint: 0,
  goodsReturned: [1],
  goodsReturnedList: [
    { id: 1, name: '快递发货' },
    { id: 2, name: '到店退货(店员已验货)' }
  ],
  description: '',
  pic: ''
}

function TradeAfterSale(props) {
  const $instance = getCurrentInstance()
  const [state, setState] = useImmer(initialState)
  const { tradeId, info, curTabIdx, tabList, reason, reasons, refundFee, refundPoint, goodsReturned, goodsReturnedList, description, pic } = state

  useEffect(() => {
    fetch()
  }, [])

  const onCancel = () => {
    Taro.navigateBack()
  }

  const fetch = async () => {
    const { id } = $instance.router.params
    const { orderInfo } = await api.trade.detail(id)
    setState(draft => {
      draft.info = pickBy(orderInfo, doc.trade.TRADE_ITEM)
    })
  }

  const onChangeItemCheck = (item, index, e) => {
    setState(draft => {
      draft.info.items[index].checked = e
    })
  }

  const onChangeItemNum = (e, index) => {

    setState(draft => {
      draft.info.items[index].refundNum = e
    })
  }

  const getRealRefundFee = () => {
    let rFee = 0
    if (info) {
      const { items } = info
      rFee = items
        .filter((item) => item.checked)
        .reduce((sum, { totalFee, num, refundNum }) => sum + totalFee / num * refundNum, 0)
    }
    return rFee
  }

  return <SpPage className='page-trade-after-sale' renderFooter={
    <View className='btn-wrap'>
      {/* <SpButton confirmText='提交' onReset={onCancel} onConfirm={onConfirm} /> */}
    </View>
  }
  >

    <AtTabs
      current={curTabIdx}
      tabList={tabList}
      onClick={(e) => {
        setState(draft => {
          draft.curTabIdx = e
        })
      }}
    />

    <View className='picker-reason'>
      <Picker
        mode='selector'
        range={reasons}
        onChange={(e) => {
          setState(draft => {
            draft.reason = e.detail.value
          })
        }}
      >
        <SpCell title='退款原因' isLink value={<Text>{`${reasons?.[reason] || '请选择取消原因'}`}</Text>}></SpCell>
      </Picker>
    </View>

    <View className='refund-items'>
      <View className='title'>退款商品</View>
      <View className='items-container'>
        {
          info?.items.map((item, index) => (
            <View className='item-wrap' key={`item-wrap__${index}`}>
              <View className='item-hd'>
                <SpCheckbox disabled={!item.leftAftersalesNum} checked={item.checked} onChange={onChangeItemCheck.bind(this, item, index)} />
              </View>
              <View className='item-bd'>
                <SpImage src={item.pic} width={128} height={128} radius={8} />
                <View className='goods-info'>
                  <View className='goods-info-hd'>
                    <Text className='goods-title'>{item.itemName}</Text>
                    <Text className='goods-num'>{`数量：${item.num}`}</Text>
                  </View>
                  <View><SpPrice value={item.totalFee / item.num} /></View>
                  <View className='goods-info-bd'>
                    <View className='sku-info'>{item.itemSpecDesc && <Text>{`规格：${item.itemSpecDesc}`}</Text>}</View>
                    <SpInputNumber
                      disabled={!item.leftAftersalesNum}
                      value={item.refundNum}
                      max={item.leftAftersalesNum}
                      min={1}
                      onChange={(e) => onChangeItemNum(e, index)}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))
        }
      </View>
    </View>

    <View className='refund-amount'>
      <SpCell title='退款金额' value={<AtInput
        name='refund_fee'
        value={refundFee}
        onChange={(e) => {
          setState(draft => {
            draft.refundFee = parseFloat(e)
          })
        }}
      />}></SpCell>
      <View className='cell-tip'>{`实际可退金额：${getRealRefundFee()}`}</View>
    </View>

    <View className='refund-point'>
      <SpCell title='退积分' value={<AtInput
        name='refund_point'
        value={refundPoint}
        onChange={(e) => {
          setState(draft => {
            draft.refundPoint = parseFloat(e)
          })
        }}
      />}></SpCell>
      <View className='cell-tip'>{`实际可退积分：${info?.refundPoint}`}</View>
    </View>

    {curTabIdx == 1 && <View className='return-goods-type'>
      <SpCell title='回寄方式' value={<SpSelect
        info={goodsReturnedList}
        value={goodsReturned}
        onChange={(e) => {
          setState((draft) => {
            draft.goodsReturned = e
          })
        }}
      />}></SpCell>
    </View>}

    <View className='desc-container'>
      <View className='title'>补充描述和凭证（选填）</View>
      <View className='desc-content'>
        <AtTextarea type='textarea' name='description' value={description} placeholder='添加描述' maxLength={200} onChange={(e) => {
          setState(draft => {
            draft.description = e
          })
        }} />
        <SpUpload
          value={pic}
          multiple={false}
          onChange={(val) => {
            setState((draft) => {
              draft.pic = val
            })
          }}
        />
      </View>
    </View>
  </SpPage>
}

TradeAfterSale.options = {
  addGlobalClass: true
}

export default TradeAfterSale
