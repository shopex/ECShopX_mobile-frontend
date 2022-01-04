 
import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View,Text } from '@tarojs/components'
import { useState,useEffect } from 'react';  
import api from '@/api'  
import { MNavBar } from './comps' 
import './agreement.scss'
import { classNames,styleNames,getThemeStyle } from '@/utils';

const Agreement = () => { 

    const [content,setContent]=useState(0)

    const getContent=async ()=>{
        const { content } = await api.merchant.getSetting();
        setContent(content)
    }  

    useEffect(() => {
        getContent()
    }, []);

    let nodes=[
        {
            name: 'div',
            attrs: {
              class: 'div_class',
              style: 'line-height: 60px; color: red;'
            },
            children: [{
              type: 'text',
              text: 'Hello World!'
            }]
          }
    ]

    return (
        <View className={classNames('page-merchant-agreement')}  style={styleNames(getThemeStyle())}>
           
           <MNavBar canLogout={false}   /> 

           <ScrollView className='page-merchant-agreement-content'>

                <View className='title'>商家入驻协议</View>

                <RichText nodes={nodes} />

           </ScrollView>

        </View>
    )
}


export default Agreement;
