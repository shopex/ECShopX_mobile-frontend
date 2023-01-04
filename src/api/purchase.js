import req from './req'

// 获取进行中员工内购详情
export function purchaseInfo(params = {}) {
  return req.get('/promotion/employeepurchase/getinfo', params)
}

// 员工内购绑定成为家属
export function purchaseBind(params = {}) {
  return req.post(`/promotion/employeepurchase/dependents`, params)
}

// 获取员工内购分享码
export function purchaseCode(params = {}) {
  return req.get('/promotion/employeepurchase/sharecode', params)
}

export function getEnterprisesList(params) { // 获取企业列表
  return req.get('/enterprises', params)
}

export function getEmailCode(params) { // 获取邮箱验证码
  return req.get('/employee/email/vcode', params)
}

export function getEmployeeActivityList(params) { // 获取可参与的活动列表
  return req.post('/employeepurchase/activities', params)
}

export function setEmployeeAuth(params) { // 员工身份验证
  return req.post('/employee/auth', params)
}

export function getEmployeeInvitData(params) { // 获取员工邀请数据
  return req.get('/employee/invitedata', params)
}

export function getEmployeeInviteCode() { // 获取员工邀请码
  return req.get('/employee/invitecode')
}

export function getEmployeeRelativeBind(params) { // 获取员工邀请码
  return req.post('/employee/relative/bind', params)
}