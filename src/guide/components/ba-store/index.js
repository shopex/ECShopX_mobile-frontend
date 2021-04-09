/*
 * @Author: PrendsMoi
 * @GitHub: https://github.com/PrendsMoi
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/guide/components/ba-store/index.js
 * @Date: 2021-04-08 17:20:07
 * @LastEditors: PrendsMoi
 * @LastEditTime: 2021-04-09 15:37:59
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Image,Text } from '@tarojs/components'
import { navigateTo,classNames } from '@/utils'
import S from '@/spx'
import './index.scss'

export default class BaStore extends Component {
  static options = {
    addGlobalClass: true
  }


  static defaultProps = {
    defaultStore:null
  }
  constructor(props) {
    super(props)
    this.state = {
      baInfo:{},
     
    }
}
componentDidMount(){
  
  let QwUserInfo=S.get('QwUserInfo',true)
  this.setState({
    baInfo:QwUserInfo,
   
  })
 

}
handleClick=()=>{
  const {onClick}=this.props
  onClick(true)
}

  // router(){
  //   console.log('/guide/auth/wxauth')
  //   navigateTo('/guide/auth/wxauth',true)
  // }
 

  render () {
    const {baInfo} = this.state
    const {defaultStore}=this.props
    const token=S.getAuthToken()
    const n_ht = S.get('navbar_height', true)
    return (
      <View
        className='ba-store'
        // style={styleNames({'margin-top': `${n_ht}px`,'background':'#3333'})}   
        style='margin-top:60px;'           
      >
        <Image className='ba-avatar' mode='widthFix' src={baInfo.avatar||'/assets/imgs/home-unloginhead.png'} />
        <View className={classNames('ba-username')}>导购货架{baInfo.name}</View>
        {/* {token?
          <View className={classNames('ba-username')}>导购货架{baInfo.name}</View>:null
          // <View className={classNames('ba-username',!token?'undenline':'')} 
          //   onClick={this.router}>
          //   请点击授权登录
          // </View>
        } */}

        
        {defaultStore&&<View className='ba-store__info' onClick={this.handleClick}>
            <Text className='ba-store__name'>{defaultStore.store_name}</Text>
            
            <Text className='in-icon in-icon-sanjiaoxing02'></Text>
        </View>}

          
    
      </View>
    )
  }
}
