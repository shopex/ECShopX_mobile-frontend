import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { useMemo, useState, useCallback, useEffect } from "react";
import { classNames, JumpStoreIndex, JumpGoodDetail } from "@/utils";
import { SpImage, SpShopCoupon,SpShopFullReduction } from "@/components";
import api from "@/api";
import "./index.scss";

function SpShopItem(props) {
  const { className, info, jumpToBusiness } = props;
  if (!info) {
    return null;
  }
  const { logo, name, cardList, salesCount, fullReduction, distance, is_dada, scoreList, marketingActivityList  } = info;
  const rate = !!(scoreList || {}).avg_star ? <Text>评分：{(scoreList || {}).avg_star}</Text> : '';

  return (
    <View className={classNames("sp-shop-item", className)} onClick={jumpToBusiness}>
      <View className="shop-item-hd">
        <SpImage className="shop-logo" src={logo || `${process.env.APP_IMAGE_CDN}/shop_default_logo.png`} />
      </View>
      <View className="shop-item-bd">
        <View className="item-bd-hd">
          <View className="shop-name">{name}</View>
          <View className="shop-distance">{distance}</View>
        </View>
        <View className="item-bd-sb">
          <View className="score">
            {rate} 月销：{salesCount}
          </View>
          {is_dada && <View className="express">达达配送</View>}
        </View>
        <View className="item-bd-bd">
          {cardList.map((item, index) => (
            <SpShopCoupon info={item} key={`shop-coupon__${index}`} />
          ))}
        </View>
        {/* {
          marketingActivityList.map((m_item, m_index) => (
            <View>
              <View className={'left'} key={m_index}>
                <View className={'label'}>
                  <Text className={'name'}>{m_item.promotion_tag}</Text>
                  <Text className={'msg'}>{m_item.marketing_name}</Text>
                </View>
              </View>
              <View className={'right'}>
                {true && m_index===0 && cardList.length===0 && <View className={'right-arrow'} onClick={handleExpand}>
                  <Text className={classNames('iconfont icon-arrowDown', {
                      ['expand']: expand
                  })}></Text>
                </View>}
              </View>
            </View>
          ))
        } */}

        {/* <View className='item-bd-fr'>
          {fullReduction.map((item, index) => (
            <SpShopFullReduction info={item} key={`shop-full-reduction__${index}`} />
          ))}
        </View> */}
      </View>
    </View>
  );
}

SpShopItem.options = {
  addGlobalClass: true,
};

export default SpShopItem;
