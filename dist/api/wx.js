"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.info = info;
exports.code = code;
exports.userInfo = userInfo;
exports.login = login;
exports.decryptPhoneInfo = decryptPhoneInfo;

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _req = require("./req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function info(data) {
  return _req2.default.post('/wx.info', data);
}

function code(code) {
  return _req2.default.get('/wx.code', { code: code });
}

function userInfo() {
  return _req2.default.get('/wx.user.info');
}

function login(data) {
  return _index2.default.request({
    url: 'https://bbc54.shopex123.com/index.php/api/wxapp/login',
    method: 'post',
    data: data
  }).then(function (res) {
    return res.data;
  });
}

function decryptPhoneInfo(params) {
  var config = {
    header: {
      'Accept': 'application/vnd.espier.v2+json'
    }
  };
  return _req2.default.get("https://bbc54.shopex123.com/index.php/api/wxapp/member/decryptPhoneInfo", params, config);
}