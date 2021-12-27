export default {
  pages: [
    "pages/index", // 首页
    "pages/category/index", // 分类
    "pages/cart/espier-index", // 购物车页面
    "pages/cart/espier-checkout", // 结算页面
    "pages/store/index", // 店铺首页

    
    'pages/home/landing', // 跳转等待页面
    'pages/floorguide/index', // 楼层引导页面

    "pages/item/list", // 商品列表页面
    "pages/item/espier-detail", // 商品详情页面
    'pages/item/item-params', // 商品参数详情页面
    'pages/item/package-list', // 商品优惠组合详情页面



    'pages/article/index', // 文章页面
    'pages/recommend/list', // 推荐软文列表
    'pages/member/item-fav',

    'pages/custom/custom-page', // 自定义页面
    'pages/liveroom/index'
  ],
  subPackages: [
    {
      root: "subpages/ecshopx",
      pages: ["nearly-shop", "shop-list"],
    },
    {
      root: "subpages/member",
      pages: [
        "index" // 会员中心
      ],
    },
    // {
    //   root: "subpages/auth",
    //   pages: ["login"],
    // },
    {
      root: 'marketing',
      pages: [
        'pages/distribution/index', // 推广管理首页
        'pages/distribution/setting', // 推广管理会员资料
        'pages/distribution/shop-home', // 小店首页
        'pages/distribution/statistics', // 推广费详情页面
        'pages/distribution/trade', // 推广订单列表
        'pages/distribution/subordinate', // 我的会员列表
        'pages/distribution/withdraw', // 提现页面
        'pages/distribution/withdrawals-record', // 提现记录
        'pages/distribution/withdrawals-acount', // 提现绑定账户
        'pages/distribution/goods', // 推广商品列表
        'pages/distribution/shop', // 我的小店概览页面
        'pages/distribution/shop-setting', // 小店设置页面
        'pages/distribution/shop-form', // 小店设置编辑页面
        'pages/distribution/qrcode', // 小店二维码
        'pages/distribution/shop-category', // 小店商品分类
        'pages/distribution/good-category',
        'pages/distribution/shop-goods',
        'pages/distribution/shop-trade',
        'pages/distribution/shop-achievement',

        'pages/distribution/point-platform',

        'pages/verified-card/index',
        'pages/verified-card/verified',
        'pages/verified-card/card',
        'pages/reservation/brand-list',
        'pages/reservation/brand-detail',
        'pages/reservation/brand-result',
        'pages/reservation/reservation-list',
        'pages/reservation/goods-reservate',
        'pages/reservation/reservation-detail',

        'pages/member/item-activity',
        'pages/member/activity-detail',
        'pages/member/user-info',
        'pages/member/complaint',
        'pages/member/complaint-record',
        'pages/member/coupon',
        'pages/member/coupon-detail',
        'pages/member/address',
        'pages/member/edit-address',
        'pages/member/crm-address-list',
        'pages/member/setting',
        'pages/member/userinfo',
        'pages/member/item-history',
        'pages/member/item-guess',
        'pages/member/member-code',
        'pages/member/group-list',
        'pages/member/member-setting',
        'pages/member/destroy-member',

        'pages/wheel/index',
        'pages/item/espier-evaluation',
        'pages/item/espier-evaluation-detail',
        'pages/item/rate',
        'pages/item/success',

        'pages/item/seckill-goods-list',
        'pages/item/seckill-list',
        'pages/item/group-detail',
        'pages/item/group-list',

        'pages/plusprice/detail-plusprice-list',
        'pages/plusprice/cart-plusprice-list',
        'pages/member/qrcode'
      ],
    },
    {
      root: 'subpage',
      pages: [
        'pages/recommend/detail',
        'pages/trade/list',
        'pages/trade/customer-pickup-list',
        'pages/trade/drug-list',
        'pages/trade/detail',
        'pages/trade/after-sale-detail',
        'pages/trade/delivery-info',
        'pages/trade/split-bagpack',
        'pages/trade/rate',
        'pages/trade/cancel',
        'pages/trade/after-sale',
        'pages/trade/refund',
        'pages/trade/refund-detail',
        'pages/trade/refund-sendback',
        'pages/trade/invoice-list',
        'pages/cashier/index',
        'pages/cashier/cashier-result',
        'pages/qrcode-buy',
        'pages/vip/vipgrades',
        'pages/auth/reg',
        'pages/auth/reg-rule',
        'pages/auth/login',
        'pages/auth/forgotpwd',
        'pages/auth/wxauth',
        'pages/auth/pclogin',
        'pages/auth/store-reg',
        // 编辑分享
        'pages/editShare/index',
        'pages/auth/bindPhone'
      ]
    },
  //   // 助力
    {
      root: 'boost',
      pages: [
        'pages/home/index',
        'pages/detail/index',
        'pages/flop/index',
        'pages/pay/index',
        'pages/payDetail/index',
        'pages/order/index'
      ]
    },

    {
      root: 'others',
      pages: [
        'pages/home/license',
        'pages/home/coupon-home',
        'pages/protocol/privacy',
        // 美恰客服
        'pages/meiqia/index',
        'pages/echat/index',
        // 扫码授权登录
        'pages/auth/index',
        // 储值
        'pages/recharge/index',
        'pages/recharge/history',
        'pages/store/list', // 门店列表
        'pages/store/category',
        // cart
        'pages/cart/coupon-picker',
        'pages/cart/drug-info',
        // 绑定订单
        'pages/bindOrder/index',
        // 过期优惠券
        'pages/nullify/coupon-nullify'
      ]
    },
    {
      root: 'pointitem',
      pages: ['pages/list']
    }
  ],
  permission: {
    "scope.userLocation": {
      desc: "您的位置信息将用于定位附近门店",
    },
  }
};