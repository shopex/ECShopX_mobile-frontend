/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 助力接口
 * @FilePath: /unite-vshop/src/api/boost.js
 * @Date: 2020-09-22 16:37:29
 * @LastEditors: Arvin
 * @LastEditTime: 2020-09-23 17:04:53
 */
import req from './req'

// 获取助力列表
export const getList = (param = {}) => req.get('/promotion/bargains', param)

// 获取助力配置
export const getDetail = (param = {}) => req.get('/pageparams/setting', param)

// 获取助力详情
export const getUserBargain = (param = {}) => req.get('/promotion/userbargain', param)

// 发起助力
export const postUserBargain = (param = {}) => req.post('/promotion/userbargain', param)
