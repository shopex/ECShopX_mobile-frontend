import Taro, { useState, memo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { classNames } from '@/utils';
import { SpPopup } from '@/components';
import './index.scss'; 

const SpNewDrawer = (props) => {

    const {
        className,
        visible,
        width = '84%',
        children
    } = props;

    return (
        <SpPopup
            visible={visible}
            right
            width={width}
            borderRadius
        >
            <View
                className={
                    classNames(
                        'sp-component-newdrawer',
                        className
                    )
                }
            >
                {children}
            </View>
        </SpPopup>
    )
}

export default memo(SpNewDrawer);