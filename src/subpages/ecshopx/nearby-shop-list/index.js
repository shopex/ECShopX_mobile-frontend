import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { SpNewNavbar, SpNewInput, SpNewFilterbar,SpNewShopItem,SpNewFilterDrawer } from '@/components'
import { classNames,pxTransform,getNavbarHeight } from '@/utils';
import { FILTER_DATA,FILTER_DRAWER_DATA } from '../consts/index';
import './index.scss';

const { navbarHeight }=getNavbarHeight();

//顶部距离=导航栏距离+输入框距离+筛选tab距离
const top=`${pxTransform(navbarHeight)+ 92 + 92}rpx`;

const NearbyShopList = (props) => {

    const [filterData] = useState(FILTER_DATA);

    const [filterValue, setFilterValue] = useState(FILTER_DATA[0]);

    const [filterVisible,setFilterVisible]=useState(false);

    const handleClickFilterLabel = useCallback(
        (item) => { 
            setFilterValue(item);
        },
        [],
    );

    const handleClickFilter=useCallback(
        () => {
            setFilterVisible(true)
        },
        [],
    )

    useEffect(() => {

    }, []);

    return (
        <View className={classNames('sp-page-nearbyshoplist')}>

            <SpNewNavbar />

            <View className={'sp-page-nearbyshoplist-input'}>
                <SpNewInput />
            </View>

            <SpNewFilterbar
                filterData={filterData}
                value={filterValue.value}
                onClickLabel={handleClickFilterLabel}
                onClickFilter={handleClickFilter}
            />

            <ScrollView
                className={classNames('sp-page-nearbyshoplist-scrollview')}
                scrollY
                scrollWithAnimation
                style={{top}}
            >
                {
                    new Array(100).fill('1').map((item,index) => (
                        <SpNewShopItem 
                            className={classNames(
                                'in-shoplist',
                                {'in-shoplist-last':index===99}
                            )
                        } />
                    ))
                }
            </ScrollView>

            <SpNewFilterDrawer 
                visible={filterVisible}
                filterData={FILTER_DRAWER_DATA}
            />

        </View>
    )
}

export default NearbyShopList;

NearbyShopList.config = {
    navigationStyle: 'custom'
}
