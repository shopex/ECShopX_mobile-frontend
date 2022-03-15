export const CHECKOUT_GOODS_ITEM = {
  item_id: 'item_id',
  cart_id: 'cart_id',
  title: 'item_name',
  curSymbol: 'fee_symbol',
  discount_info: 'discount_info',
  order_item_type: 'order_item_type',
  type: 'type',
  origincountry_img_url: 'origincountry_img_url',
  origincountry_name: 'origincountry_name',
  pics: 'pic',
  point: 'point',
  item_point: 'item_point',
  price: 'price', // ({ price }) => (+price / 100).toFixed(2),
  num: 'num',
  item_spec_desc: 'item_spec_desc'
}

export const INVOICE_TITLE = {
  type: 'type',
  content: 'title',
  company_address: 'companyAddress',
  registration_number: 'taxNumber',
  bankname: 'bankName',
  bankaccount: 'bankAccount',
  company_phone: 'telephone'
}

export const GUIDE_CHECKOUT_GOODSITEM = {
  itemName: 'item_name',
  img: 'pics',
  nospec: ({ item_spec_desc }) => {
    if (item_spec_desc) {
      return false
    } else {
      return true
    }
  },
  itemSpecDesc: 'item_spec_desc',
  num: 'num',
  price: ({ price }) => price / 100,
  activityPrice: ({ act_price }) => act_price / 100,
  memberPrice: ({ member_price }) => {
    if (!member_price) {
      return NaN
    } else {
      return member_price / 100
    }
  },
  marketPrice: ({ market_price }) => market_price / 100
}
