import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
// import React from 'react'
import './index.scss'
import { classNames, JumpStoreIndex, JumpGoodDetail } from "@/utils";

function SpShopFullReduction(props){
    const { info,showMore = false,count = 0, handeChange,showMoreIcon } = props
    const {label, text} = info
    return (
        <View className={classNames(
            "sp-shop-fullReduction",
          )}>
            <View className='label-style'>{label}</View>
            <Text className='text-style'>{text}</Text>
            {
                showMoreIcon && <View className='pick-down' onClick={() => handeChange(!showMore)}>{count}种优惠
                    <Image
                    src="/assets/imgs/down_icon.png"
                    className={showMore ? 'down_icon' : 'down_icon translate'}
                    ></Image>
                </View>
            }                                           
        </View>
    )
}

export default SpShopFullReduction