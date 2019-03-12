import Taro from '@tarojs/taro'

export function linkPage (type, id) {
  let url = ''

  switch (type) {
    case 'goods':
      url = '/pages/item/index?id=' + id
      break;
    case 'category':
      url = '/pages/item/list?cat_id=' + id
      break;
    case 'article':
      url = '/pages/article/index?id=' + id
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
