import { View, Text } from '@tarojs/components'
import Taro, { memo, useState, useEffect } from '@tarojs/taro'

import './nearby-shop.scss'

const WgtNearbyShop = (props) => {

    const { info = null } = props
    if (!info) return
    const { base, seletedTags } = info

    const [activeIndex, setActiveIndex] = useState(0);

    // useEffect(async () => {
    //     const obj = {
    //         distributor_tag_id: seletedTags[activeIndex]
    //     }
    //     const result = await api.wgts.getNearbyShop(obj);
    //     console.log(result);
    // }, [])


    return (
        <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
            {base.title && (
                <View className='wgt__header' style={{ justifyContent: 'space-between' }}>
                    <View className='wgt__title'>{base.title}</View>
                    <View className='wgt__more' style={{ width: 'auto' }}>
                        <View className='see_more'>查看更多</View>
                    </View>
                </View>
            )}

            <View className='nearby_shop_wrap'>
                <View className='tagList'>
                    {
                        seletedTags.map((item, index) => (
                            <Text className={`tag ${activeIndex == index ? 'active' : null}`}
                                key={item.tag_id} onClick={e => setActiveIndex(index)}>{item.tag_name}</Text>
                        ))
                    }
                </View>

            </View>
        </View>
    )
}

WgtNearbyShop.options = {
    addGlobalClass: true
}
export default memo(WgtNearbyShop)
