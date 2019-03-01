import Taro from '@tarojs/taro'

export function linkPage (type, id) {
  let url = ''

  switch (type) {
    case 'goods':
      url = 'goodsdetail?id=' + id
      break;
    case 'category':
      url = 'goods_list?catId=' + id
      break;
    case 'article':
      url = 'article?id=' + id
      break;
    case 'link':
      url = id
      break;
    default:
  }

  Taro.navigateTo({
    url
  })
}

export default {}
