/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /feat-Unite-group-by/src/groupBy/utils/index.js
 * @Date: 2020-06-12 18:14:20
 * @LastEditors: Arvin
 * @LastEditTime: 2020-06-15 14:03:55
 */


const formatGood = (data) => {
  if (!data || !data.length) {
    return []
  }
  const list = data.map(item => {
    return {
      itemId: item.itemId || item.cart_id,
      itemName: item.item_name,
      history_data: item.history_data || [],
      initial_sales: item.initial_sales || 0,
      brief: item.brief,
      pics: Array.isArray(item.pics) ? item.pics[0] : item.pics,
      activity_id: item.activity_id,
      isChecked: item.is_checked || false,
      num: item.cart_num || item.num,
      limit_num: item.limit_num,
      price: (item.activity_price / 100).toFixed(2),
      activity_price: (item.activity_price / 100).toFixed(2)
    }
  })
  return list
}

const test = () => {}

export {
  formatGood,
  test
}