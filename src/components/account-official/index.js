import Taro, { Component } from '@tarojs/taro'
import { View, OfficialAccount, Image } from '@tarojs/components'
import {connect} from "@tarojs/redux";
import { classNames } from '@/utils'

import './index.scss'

@connect(({ colors }) => ({
  colors: colors.current
}))
export default class AccountOfficial extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    isLink: false,
    value: null,
    border: true,
    title: '',
    arrow: 'right',
    onClick: () => {},
    onHandleError: () => {}
  }
  constructor (props) {
    super(props)

    this.state = {
      isShowAccount:true
    }
  }
  componentDidMount(){
  }

  componentDidShow() {
    this.handleClickError()
    this.handleClickLoad()
  }

  handleClickClose =() => {
    this.props.onClick()
  }

  handleClickLoad = (res) => {
    console.log('res',res)
    if(res && res.detail) {
      let status_cur = res.detail.status
      this.props.onHandleError(status_cur)
    }
  }

  handleClickError = (error) => {
    console.log('error',error)
    if(error && error.detail) {
      this.setState({
        isShowAccount:false
      })
      let status_cur = error.detail.status
      this.props.onHandleError(status_cur)
    }
  }

  render () {
    const { isShowAccount } = this.state
    const { colors,isClose } = this.props
    return (
     <View>
       {isShowAccount && (
               <View className='account-view'>
               <OfficialAccount
                 className='account-view__official'
                 onLoad={(res) => this.handleClickLoad(res)}
                 onError={(error) => this.handleClickError(error)}
               />
               
               {
                 isClose && (
                   <View className='zoom-btn icon-close' onClick={this.handleClickClose.bind(this)}></View>
       
                 )
               }
             </View>
       )}
     </View>

    )
  }
}
