import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { useSelector } from 'react-redux'
import { View, Text, Image } from '@tarojs/components'
import { SpPrice, SpInputNumber, SpImage, SpCheckboxNew } from '@/components'
import { VERSION_IN_PURCHASE } from '@/utils'
import { AtButton } from 'taro-ui'

import './index.scss'

const initialState = {
  allChecked: true
}
function CompGoodsItem(props) {
  const [state, setState] = useImmer(initialState)
  const { allChecked } = state

  const {
    deletes = () => {},
    onSelectAll = () => {},
    onSingleChoice = () => {},
    onChangeInputNumber = () => {},
    balance = () => {}
  } = props

  return (
    <View>
      <View className='comp-goodsitems'>
        <View className='comp-goodsitems-checkbox'>
          <Text className='iconfont icon-shop' />
          方方的徐汇点
        </View>
        <View className='comp-goodsitems-item'>
          <View className='comp-goodsitems-item-del'>
            <SpCheckboxNew checked={allChecked} onChange={() => onSingleChoice()} />
            <SpImage
              className='comp-goodsitem-item-del-image'
              mode='aspectFill'
              circle={16}
              src='https://img2.baidu.com/it/u=3976722208,1729629707&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1716915600&t=9ca8874bd9a1a056913a5d41488bf99e'
              width={130}
              height={130}
            />
            <View className='comp-goodsitems-item-del-info'>
              <View className='name'>
                <Text>斗罗第100弹六一特别款</Text>
                <Text className='iconfont icon-shanchu-01' onClick={() => deletes('1111')} />
              </View>
              <View className='new'>新品</View>
              <View className='money'>
                <SpPrice className='mkt-price' value='1000' />
                <SpInputNumber
                  value='8'
                  max='8'
                  min={1}
                  onChange={(event) => onChangeInputNumber(event, { kk: 'ui' })}
                />
              </View>
            </View>
          </View>

          <View className='comp-goodsitems-item-del'>
            <SpCheckboxNew checked={allChecked} onChange={() => onSingleChoice()} />
            <SpImage
              className='comp-goodsitem-item-del-image'
              mode='aspectFill'
              circle={16}
              src='https://img2.baidu.com/it/u=3976722208,1729629707&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1716915600&t=9ca8874bd9a1a056913a5d41488bf99e'
              width={130}
              height={130}
            />
            <View className='comp-goodsitems-item-del-info'>
              <View className='name'>
                <Text>斗罗第100弹六一特别款</Text>
                <Text className='iconfont icon-shanchu-01' onClick={() => deletes('1111')} />
              </View>
              <View className='new'>新品</View>
              <View className='money'>
                <SpPrice className='mkt-price' value='1000' />
                <SpInputNumber value='1' max='8' min={1} onChange={() => onChangeInputNumber()} />
              </View>
            </View>
          </View>

          <View className='comp-goodsitems-item-del'>
            <SpCheckboxNew checked={allChecked} onChange={() => onSingleChoice()} />
            <SpImage
              className='comp-goodsitem-item-del-image'
              mode='aspectFill'
              circle={16}
              src='https://img2.baidu.com/it/u=3976722208,1729629707&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1716915600&t=9ca8874bd9a1a056913a5d41488bf99e'
              width={130}
              height={130}
            />
            <View className='comp-goodsitems-item-del-info'>
              <View className='name'>
                <Text>斗罗第100弹六一特别款</Text>
                <Text className='iconfont icon-shanchu-01' onClick={() => deletes('1111')} />
              </View>
              <View className='new'>新品</View>
              <View className='money'>
                <SpPrice className='mkt-price' value='1000' />
                <SpInputNumber value='7' max='8' min={1} onChange={() => onChangeInputNumber()} />
              </View>
            </View>
          </View>
          <View className='comp-goodsitems-item-ft'>
            <View className='lf'>
              <SpCheckboxNew checked={allChecked} label='全选' onChange={() => onSelectAll()} />
            </View>
            <View className='rg'>
              <View>
                <View className='total-price-wrap'>
                  合计：
                  <SpPrice className='total-pirce' value={12345 / 100} />
                </View>
                <View className='discount-price-wrap'>
                  共优惠：
                  <SpPrice className='total-pirce' value={12345 / 100} />
                </View>
              </View>
              <AtButton
                className='btn-calc'
                type='primary'
                circle
                disabled={false}
                onClick={() => balance()}
              >
                结算(12)
              </AtButton>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default CompGoodsItem
