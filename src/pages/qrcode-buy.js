import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, ScrollView, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { withPager, withBackToTop } from '@/hocs'
import { AtInput } from 'taro-ui'
import { SpToast, CouponItem } from '@/components'
import api from '@/api'
import { pickBy, classNames } from '@/utils'
import S from '@/spx'
import entry from '@/utils/entry'

import './member/qrcode-buy.scss'

@withPager
@withBackToTop
export default class QrcodeBuy extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isLogin: false,
            userInfo: '',
            couponData: '',
            banner_img: ''
        }
    }
    
    async componentDidMount () {
        const options = this.$router.params
        await entry.entryLaunch(options, true)
        const { banner } = await Taro.getStorageSync('curStore')
        this.setState({
            banner_img: banner
        })
        this.fetch()
    }

    async fetch () {
        if (!S.getAuthToken()){
            this.setState({
                isLogin: false
            })
        } else {
            const { memberInfo } = await api.member.memberInfo()
            console.log(memberInfo, 30)
            this.setState({
                isLogin: true,
                userInfo: memberInfo
            },()=>{
                this.couponData()
            })
        }
    }

    couponData = async () => {
        let params = {
            page_no: 1,
            page_size: 10,
            valid: false
        }
        const { list} = await api.member.couponList(params)
        const nList = pickBy(list, {
            id: 'id',
            status: 'status',
            reduce_cost: 'reduce_cost',
            least_cost: 'least_cost',
            begin_date: 'begin_date',
            end_date: 'end_date',
            card_type: 'card_type',
            tagClass: 'tagClass',
            title: 'title',
            discount: 'discount'
        })
        const firstData = nList[0]
        this.setState({
            couponData: firstData
        })
    }

    handleLoginClick = () => {
        S.login(this)
    }

    handleCamera = async () => {
        const uid = Taro.getStorageSync('distribution_shop_id')
        Taro.scanCode({
            async success (res) {
            console.log(res.result)
            let query = {
                barcode: res.result,
                distributor_id: uid ? uid : 0
            }
            try {
                const result = await api.user.scancodeAddcart(query)
                S.toast(result.msg)
            } catch(e) {
                Taro.showToast({
                    icon: 'none',
                    title: e.message
                })
            }
            
            }
        })
    }

    handleTrade = () => {
        Taro.navigateTo({
            url: '/pages/trade/list'
        })
    }

    handleCart = () => {
        Taro.navigateTo({
            url: '/pages/cart/espier-index'
        })
    }

    handleHome = () => {
        Taro.navigateTo({
            url: '/pages/index'
        })
    }
 
  render () {

    const { isLogin, userInfo, couponData, banner_img } = this.state

    console.log(isLogin, 86)
    let bg_img = ''
    if (userInfo.gradeInfo) {
        bg_img = userInfo.gradeInfo.background_pic_url
    }

    return (
      <View className='qrcode-buy'>
        <View className='qrcode-buy__top'>
            {
                isLogin 
                ? <View className='islogin_user'>
                    <View className='islogin_user__content'>
                        <Image src={bg_img} mode='widthFix' className='qrcode-buy__bgimg'></Image>
                        <View className='islogin_user_info'>
                            <View className='islogin_user_left'>
                                <View>{userInfo.username}</View>
                                <View>{userInfo.user_card_code}</View>
                            </View>
                            <View className='islogin_user_right'>积分</View>
                        </View>
                    </View>
                </View>
                : <Image src={banner_img} mode='widthFix' className='qrcode-buy__img'></Image>
            }
            <CouponItem
              info={couponData}
            />
            <View className='scancode-view' onClick={this.handleCamera.bind(this)}>
                <Image src='/assets/imgs/bt_scanning.png' mode='widthFix' className='qrcode-buy__scanning'></Image>
                <View>扫描商品条码</View>
            </View>
        </View> 

        {
            !isLogin 
            ? <View className='qrcode-buy__btn' onClick={this.handleLoginClick.bind(this)}>立即授权</View>
            : <View className='auth-btns'>
                <View className='auth-btns__item' onClick={this.handleHome.bind(this)}>
                    <View className='icon icon-home'></View>
                    <View>商城首页</View>
                </View>
                <View className='auth-btns__item' onClick={this.handleCart.bind(this)}>
                    <View className='icon icon-cart'></View>
                    <View>购物车</View>
                </View>
                <View className='auth-btns__item' onClick={this.handleTrade.bind(this)}>
                    <View className='icon icon-home'></View>
                    <View>我的订单</View>
                </View>
            </View>
        }
        <SpToast />
      </View>   
    )
  }
}
