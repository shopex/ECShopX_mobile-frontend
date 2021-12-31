import req from './req'  

//商户类型列表
export function typeList(params) {
  return req.get('/merchant/type/list',params)
} 

//商户登陆
export function login(params) {
  return req.post('/merchant/login',params)
} 

//获取当前进行到哪一步
export function getStep(params) {
  return req.get('/merchant/settlementapply/step',params)
} 

//保存信息
export function save(params) {
  return req.post(`/merchant/settlementapply/${params.step}`,params)
} 

//保存信息
export function getSetting(params) {
  return req.get(`/merchant/basesetting`,params)
} 
