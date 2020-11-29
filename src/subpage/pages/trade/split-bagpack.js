import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCountdown } from 'taro-ui'
import { Loading, SpToast, NavBar, FloatMenuMeiQia, SpImg } from '@/components'
import { pickBy, formatTime, resolveOrderStatus, } from '@/utils'
import api from '@/api'





import './split-bagpack.scss'

@connect(({ colors }) => ({
    colors: colors.current
}))

// function resolveTradeOrders (info) {
//   return info.orders.map(order => {
//     const { item_id, title, pic_path: img, total_fee: price, num } = order
//     return {
//       item_id,
//       title,
//       img,
//       price,
//       num
//     }
//   })
// }

export default class TradeDetail extends Component {
    constructor(props) {
        super(props)

        this.state = {
            delivery_num: '',
            list: []
        }
    }

    componentDidShow() {
        this.fetch()
    }





    async fetch() {
        const { order_id, order_type } = this.$router.params
        const data = await api.trade.deliveryLists({order_id})
        // let data = {
        //     "delivery_num": "2",
        //     "list": [
        //         {
        //             "delivery_corp": "SF",
        //             "delivery_corp_name": "顺丰快递",
        //             "delivery_code": "SF2020112900001",
        //             "items": [
        //                 {
        //                     "pic": "http://bbctest.aixue7.com/image/1/2020/08/03/b22be4303a51a762fa32e226dd40418cnIUa2NLGrtuWGiEt27ZY1npobUQlhLc4"
        //                 },
        //                 {
        //                     "pic": "http://bbctest.aixue7.com/image/1/2020/08/03/b22be4303a51a762fa32e226dd40418cnIUa2NLGrtuWGiEt27ZY1npobUQlhLc4"
        //                 }
        //             ],
        //             "items_num": 2,
        //             "status_msg": "已发货"
        //         },
        //         {
        //             "delivery_corp": "",
        //             "delivery_corp_name": "",
        //             "delivery_code": "",
        //             "items": [
        //                 {
        //                     "pic": "http://bbctest.aixue7.com/image/1/2020/08/03/b22be4303a51a762fa32e226dd40418cnIUa2NLGrtuWGiEt27ZY1npobUQlhLc4"
        //                 },
        //                 {
        //                     "pic": "http://bbctest.aixue7.com/image/1/2020/08/03/b22be4303a51a762fa32e226dd40418cnIUa2NLGrtuWGiEt27ZY1npobUQlhLc4"
        //                 }
        //             ],
        //             "items_num": 2,
        //             "status_msg": "未发货"
        //         }
        //     ]
        // }
        let { delivery_num, list } = data
        this.setState({
            delivery_num, list,
            order_id,
            order_type
        })
        // const info = pickBy(data.orderInfo, {
        //     tid: 'order_id',
        //     created_time_str: ({ create_time }) => formatTime(create_time * 1000),
        //     auto_cancel_seconds: 'auto_cancel_seconds',
        //     receiver_name: 'receiver_name',
        //     receiver_mobile: 'receiver_mobile',
        //     receiver_state: 'receiver_state',
        //     estimate_get_points: 'estimate_get_points',
        //     discount_fee: ({ discount_fee }) => (+discount_fee / 100).toFixed(2),
        //     point_fee: ({ point_fee }) => (+point_fee / 100).toFixed(2),
        //     point_use: 'point_use',
        //     receiver_city: 'receiver_city',
        //     receiver_district: 'receiver_district',
        //     receiver_address: 'receiver_address',
        //     status_desc: 'order_status_msg',
        //     delivery_code: 'delivery_code',
        //     delivery_name: 'delivery_corp_name',
        //     distributor_id: 'distributor_id',
        //     receipt_type: 'receipt_type',
        //     ziti_status: 'ziti_status',
        //     qrcode_url: 'qrcode_url',
        //     delivery_corp: 'delivery_corp',
        //     order_type: 'order_type',
        //     order_status_msg: 'order_status_msg',
        //     order_status_des: 'order_status_des',
        //     order_class: 'order_class',
        //     latest_aftersale_time: 'latest_aftersale_time',
        //     remark: 'remark',
        //     type: 'type',
        //     total_tax: ({ total_tax }) => (+total_tax / 100).toFixed(2),
        //     item_fee: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        //     coupon_discount: ({ coupon_discount }) => (+coupon_discount / 100).toFixed(2),
        //     freight_fee: ({ freight_fee }) => (+freight_fee / 100).toFixed(2),
        //     payment: ({ pay_type, total_fee }) => pay_type === 'point' ? Math.floor(total_fee) : (+total_fee / 100).toFixed(2), // 积分向下取整
        //     pay_type: 'pay_type',
        //     pickupcode_status: 'pickupcode_status',
        //     invoice_content: 'invoice.content',
        //     point: 'point',
        //     status: ({ order_status }) => resolveOrderStatus(order_status),
        //     orders: ({ items = [] }) => pickBy(items, {
        //         order_id: 'order_id',
        //         item_id: 'item_id',
        //         // aftersales_status: ({ aftersales_status }) => AFTER_SALE_STATUS[aftersales_status],
        //         delivery_code: 'delivery_code',
        //         delivery_corp: 'delivery_corp',
        //         delivery_name: 'delivery_corp_name',
        //         delivery_status: 'delivery_status',
        //         delivery_time: 'delivery_time',
        //         aftersales_status: 'aftersales_status',
        //         pic_path: 'pic',
        //         title: 'item_name',
        //         type: 'type',
        //         origincountry_name: 'origincountry_name',
        //         origincountry_img_url: 'origincountry_img_url',
        //         delivery_status: 'delivery_status',
        //         price: ({ item_fee }) => (+item_fee / 100).toFixed(2),
        //         point: 'item_point',
        //         num: 'num',
        //         item_spec_desc: 'item_spec_desc',
        //         order_item_type: 'order_item_type'
        //     })
        // })

        // const ziti = pickBy(data.distributor, {
        //     store_name: 'store_name',
        //     store_address: 'store_address',
        //     store_name: 'store_name',
        //     hour: 'hour',
        //     phone: 'phone',
        // })








    }









    handleClickDelivery = (item) => {
        console.log(item, 'item');
        let { delivery_code, delivery_corp, delivery_corp_name } = item
        console.log(delivery_code, delivery_corp, delivery_corp_name, 'delivery_code,delivery_corp,delivery_name');
        Taro.navigateTo({
            url: `/subpage/pages/trade/delivery-info?order_type=${this.state.order_type}&order_id=${this.state.order_id}&delivery_code=${delivery_code}&delivery_corp=${delivery_corp}&delivery_name=${delivery_corp_name}`
        })
    }









    render() {
        const { colors } = this.props
        const { list, delivery_num } = this.state
        if (list.length == 0) {
            return <Loading></Loading>
        }

        return (
            <View className="wuliu-detail">
                <NavBar title="订单详情" leftIconType="chevron-left" fixed="true" />

                <View className="wuliu-detail">
                    <View className="title-status">您有{delivery_num}个包裹已发出</View>
                    {list.map(item =>
                        <View className="wuliu-detail-item">
                            <View className="wuliu-status">
                                {item.status_msg=='已发货'&&<Text className='biao-icon biao-icon-yifahuo'><Text className="icon-text">已发货</Text></Text>}
                                {item.status_msg=='未发货'&&<Text className='biao-icon biao-icon-daifahuo'><Text className="icon-text">待发货</Text></Text>}
                                <Text className='wuliu-order'>{item.delivery_corp_name} {item.delivery_code}</Text>
                            </View>
                            <View className='wuliu-info' onClick={this.handleClickDelivery.bind(this, item)}>
                                {/* {item.status_msg} */}
                                这是测试的快递签收信息
                            </View>
                            <View className="good-list">
                                {/* <OrderItem
                               
                                info={info.orders[0]}
                            /> */}
                                <ScrollView
                                    scrollX
                                >
                                    {item.items.map(i => <SpImg
                                        img-class='order-item__img'
                                        src={i.pic}
                                        mode='aspectFill'
                                        width='300'
                                        lazyLoad
                                    />)}


                                </ScrollView>
                            </View>
                            <View className="ft-tips">共{item.items_num}件商品</View>
                        </View>)}
                    {/* <DetailItem info={info} /> */}
                </View>
                <SpToast></SpToast>
            </View>
        );
    }
}
