import Taro, { useState, memo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames } from '@/utils';
import { SpNewDrawer } from '@/components';
import CustomButton from './comps/button';
import './index.scss'; 

const SpNewFilterDrawer = (props) => {

    const { 
        visible=false,
        filterData=[]
    } = props;

    return (
        <SpNewDrawer
            visible={visible}
        >
            <View className={
                classNames(
                    'sp-new-filter-drawer'
                )
            }>
                <ScrollView className={'sp-new-filter-drawer-container'}>
                    {
                        filterData.map(item=>{
                            return (
                                <View className={'sp-new-filter-drawer-container-block'}>
                                    <View className={'title'}>
                                        {item.label}
                                    </View>
                                    {
                                      item.children.map((citem,index)=>(
                                          <View className={classNames('label',{'checked':index===1})}>
                                              {citem.label}
                                          </View>
                                      ))  
                                    }
                                </View>
                            )
                        })
                    }
                </ScrollView>
                <View className={'sp-new-filter-drawer-action'}>
                    <CustomButton />
                </View>
            </View>
        </SpNewDrawer>
    )
}

export default memo(SpNewFilterDrawer);