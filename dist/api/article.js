'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = list;
exports.detail = detail;
exports.focus = focus;
exports.praise = praise;
exports.praiseCheck = praiseCheck;
exports.praiseNum = praiseNum;
exports.collectArticle = collectArticle;
exports.delCollectArticle = delCollectArticle;

var _req = require('./req.js');

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function list() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.get('/article/management', params);
}

function detail(id) {
  return _req2.default.get('/article/management/' + id);
}

function focus(id) {
  return _req2.default.get('/article/focus/' + id);
}

function praise(id) {
  return _req2.default.get('/article/praise/' + id);
}

function praiseCheck(id) {
  return _req2.default.get('/article/praise/check/' + id);
}

function praiseNum(id) {
  return _req2.default.get('/article/praise/num/' + id);
}

function collectArticle(id) {
  return _req2.default.post('/member/collect/article/' + id);
}

function delCollectArticle() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return _req2.default.delete('/member/collect/article', params);
}

exports.default = {};