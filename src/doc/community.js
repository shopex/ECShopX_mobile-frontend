import { pickBy } from '@/utils'

export const COMMUNITY_ORDER_LIST = {
  orderId: 'order_id',
  orderStatus: 'order_status',
  orderStatusMsg: 'order_status_msg',
  items: 'items',
  remark: 'remark',
  receiver_name: 'receiver_name',
  receiver_mobile: 'receiver_mobile',
  receiver_state: 'receiver_state',
  receiver_city: 'receiver_city',
  receiver_district: 'receiver_district',
  receiver_address: 'receiver_address',
  receiver_type: 'receiver_type',
  memberInfo: 'member',
  zitiInfo: 'zitiList',
  createDate: 'create_date',
  totalNum: 'total_num',
  buildingNumber: 'building_number',
  houseNumber: 'house_number',
  items: ({ items }) => {
    if (!items) {
      return []
    } else {
      return pickBy(items, {
        itemName: 'item_name',
        // price: 'price',
        total_fee: 'total_fee',
        num: 'num',
        zitiName: 'ziti_name',
        pic: 'pic'
      })
    }
  }
}

export const COMMUNITY_ACTIVITY_LIST = {}
