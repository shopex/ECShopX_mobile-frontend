import Taro, { useState, memo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames } from '@/utils'; 
import './button.scss';

const Button = (props) => {

    const {
        
    } = props;

    return (
        <View className={
            classNames(
                'filter-button'
            )
        }>
            <View className={'reset'}>重置</View>
            <View className={'confirm'}>确定并筛选</View>
        </View>
    )
}

export default memo(Button);