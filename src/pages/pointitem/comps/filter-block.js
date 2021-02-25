/*
 * @Author: your name
 * @Date: 2021-02-25 13:14:46
 * @LastEditTime: 2021-02-25 20:41:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ecshopx-newpc/Users/wujiabao/Desktop/work/ecshopx-vshop/src/pages/pointitem/comps/header.js
 */
import Taro ,{ Component } from '@tarojs/taro';
import { View,Image } from '@tarojs/components';

import './filter-block.scss';


export default class FilterBlock extends Component{

    constructor(props){
        super(props);

        this.state={

        }
    }
    
    getName=()=>{
        const { info,type }=this.props;
        if(type==='brand'){
            return info.attribute_name
        }else if(type==='category'){
            return info.label
        }else{
            return `${info[0]} ~ ${info[1]}`
        }
    }

    render(){ 

        const name=this.getName();
        
        return (
            <View className={`filter-block${this.props.active ? ' active' : ''}`}>
                {name}
            </View>
        )
    }
 
    
}