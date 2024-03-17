import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { SpImage, SpLogin, SpShopCoupon, SpPrice, SpCheckboxNew } from '@/components'
import { pickBy, showToast, classNames } from '@/utils'
import S from '@/spx'
import './comp-layout.scss'
import CompTab from './comp-tab'

const initialState = {
}
function CompLayout(props) {
  const { shopCartCount } = useSelector((state) => state.cart)

  const { settlement = {} ,onChangeGoodsIsCheck={},onDelete={},handleClick={}} = props
  const [state, setState] = useImmer(initialState)
  const allChecked =  shopCartCount.storeDetails?.cart_total_count ==  shopCartCount.storeDetails?.list?.length
  return (
    
    <View className='comp-shop-brand-layout'>
      {/* 全选 */}
      <View className='selec-atll'>
        <View className='selec-atll-num'>
          <SpCheckboxNew
            checked={allChecked}
            label='全选'
            onChange={onChangeGoodsIsCheck.bind(this, shopCartCount.storeDetails, 'all')}
          />
          <Text className='selec-atll-num-commodity'>（共{shopCartCount.storeDetails?.list?.length}件商品）</Text>
        </View>
        <View onClick={() => onDelete()}>
          <Text className='iconfont icon-shanchu-01' />
          <Text className='empty-cart'>清空购物车</Text>
        </View>
      </View>
      {/* 列表 */}
      <ScrollView className='tabulation' scrollY>
        {
          shopCartCount.storeDetails?.list?.map(item=>{
            
            return(
              <View className='tabulation-list' key={item.cart_id}>
              <SpCheckboxNew
                checked={item.is_checked}
                onChange={onChangeGoodsIsCheck.bind(this, item, 'single')}
              />
              <View className='tabulation-list-details'>
                <Image
                  className='tabulation-list-details-img'
                  src={item.pics}
                ></Image>
                <View className='tabulation-list-details-text'>
                  <View className='name'>{item.item_name}</View>
                  <View className='addition-and-subtraction'>
                    <View className='details-name'>
                      <View className='details-name-ml'>{item.item_spec_desc}</View>
                      <SpPrice className='market-price' size={32} value={item.price/100}></SpPrice>
                    </View>
                    <View className='addition-and-subtraction-btn'>
                      <Text className='iconfont icon-minus' onClick={()=>handleClick(item,item.num-1)} />
                      <Text>{item.num}</Text>
                      <Text className='iconfont icon-plus' onClick={()=>handleClick(item,item.num+1)} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            )
          })
        }
       
      </ScrollView>
      {/* 底部 */}
      <CompTab settlement={settlement} />
    </View>
  )
}

CompLayout.options = {
  addGlobalClass: true
}

export default CompLayout
