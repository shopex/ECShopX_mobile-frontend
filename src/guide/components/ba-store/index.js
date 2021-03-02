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
  
  let ba_params=S.get('ba_params',true)
  if(ba_params){
    this.setState({
      baInfo:ba_params.ba_info,
     
    })
  }
 

}
  handleClick=()=>{
      const {onClick}=this.props
      onClick(true)
  }


 

  render () {
    const {baInfo} = this.state
    const {defaultStore}=this.props
    const token=S.getAuthToken()
    console.log('defaultStore----888',baInfo)
    console.log('defaultStore=====1',defaultStore)
    return (
      <View
       className='ba-store'
      >
        <Image className='ba-avatar' mode='widthFix' src={baInfo.avatar||'/assets/imgs/home-unloginhead.png'} />
        {token?<View className={classNames('ba-username')}>悦诗风吟{baInfo.name}</View>:<View className={classNames('ba-username',!token?'undenline':'')} onClick={()=>navigateTo('/guide/auth/wxauth',true)}>请点击授权登录</View>}

        
        {defaultStore&&<View className='ba-store__info' onClick={this.handleClick}>
            <Text className='ba-store__name'>{defaultStore.wxshop_name}</Text>
            
            <Text className='in-icon in-icon-sanjiaoxing02'></Text>
        </View>}

          
    
      </View>
    )
  }
}
