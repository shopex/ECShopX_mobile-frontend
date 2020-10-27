/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /ossVshop/src/utils/upload.js
 * @Date: 2020-03-06 16:32:07
 * @LastEditors: Arvin
 * @LastEditTime: 2020-03-11 10:08:19
 */

import AliOss from './aliyun'
import QiNiu from './qiniu'
// import Tecent from './tecent'
// 判断上传


console.log(process.env.STORAGE)

const storage = process.env.STORAGE === 'ali' ? AliOss: QiNiu

// switch (process.env.STORAGE) {
//   case 'ali':
//     storage = AliOss
//     break;
//   case 'tecent':
//     storage = Tecent
//     break;
//   default:
//     storage = QiNiu
// }

export default storage