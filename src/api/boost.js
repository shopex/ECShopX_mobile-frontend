/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 助力接口
 * @FilePath: /unite-vshop/src/api/boost.js
 * @Date: 2020-09-22 16:37:29
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-22 17:36:39
 */
import req from './req'

// 获取助力列表
export const getList = (param = {}) => req.get('/promotion/bargains', param)

// 获取助力详情
export const getDetail = (param = {}) => req.get('/pageparams/setting', param)

export const getUserBargain = (param = {}) => req.get('/promotion/userbargain', param)
