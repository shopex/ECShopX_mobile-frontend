"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../api/index.js");

var _index4 = _interopRequireDefault(_index3);

var _index5 = require("../../utils/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WxAuth = (_temp2 = _class = function (_BaseComponent) {
  _inherits(WxAuth, _BaseComponent);

  function WxAuth() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, WxAuth);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WxAuth.__proto__ || Object.getPrototypeOf(WxAuth)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["userInfo"], _this.handleGetUserInfo = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(res) {
        var loginParams, iv, encryptedData, _ref3, code, extConfig, _userInfo, mobile;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                loginParams = res.detail;
                iv = loginParams.iv, encryptedData = loginParams.encryptedData;

                if (!(!iv || !encryptedData)) {
                  _context.next = 5;
                  break;
                }

                _index2.default.showModal({
                  title: '授权提示',
                  content: "'\u7231\u8309\u8389\u5C0F\u7A0B\u5E8F'" + "\u9700\u8981\u60A8\u7684\u6388\u6743\u624D\u80FD\u6B63\u5E38\u8FD0\u884C",
                  showCancel: false,
                  confirmText: '知道啦'
                });

                return _context.abrupt("return");

              case 5:
                _context.next = 7;
                return _index2.default.login();

              case 7:
                _ref3 = _context.sent;
                code = _ref3.code;
                extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};

                loginParams.appid = extConfig.appid;
                loginParams.code = code;

                _index2.default.showLoading({
                  mask: true,
                  title: '正在加载...'
                });

                _context.prev = 13;
                _context.next = 16;
                return _index4.default.wx.login(loginParams);

              case 16:
                _userInfo = _context.sent;

                _index5.log.debug("[authorize] userInfo:", _userInfo);

                mobile = _userInfo.memberInfo.mobile;

                _index2.default.setStorageSync('user_info', _userInfo);
                _index2.default.setStorageSync('user_mobile', mobile);
                _this.redirect();
                _context.next = 28;
                break;

              case 24:
                _context.prev = 24;
                _context.t0 = _context["catch"](13);

                console.info(_context.t0);
                _index2.default.showToast({
                  title: '授权失败，请稍后再试',
                  icon: 'none'
                });

              case 28:

                _index2.default.hideLoading();

              case 29:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2, [[13, 24]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.handleGetPhoneNumber = function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
        var _e$detail, iv, encryptedData, errMsg, _ref5, code, res;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // TODO: handle phone
                _e$detail = e.detail, iv = _e$detail.iv, encryptedData = _e$detail.encryptedData, errMsg = _e$detail.errMsg;
                _context2.next = 3;
                return _index2.default.login();

              case 3:
                _ref5 = _context2.sent;
                code = _ref5.code;
                _context2.next = 7;
                return _index4.default.wx.decryptPhoneInfo({
                  code: code,
                  iv: iv,
                  encryptedData: encryptedData
                });

              case 7:
                res = _context2.sent;


                console.info(res);
                debugger;

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, _this2);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WxAuth, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(WxAuth.prototype.__proto__ || Object.getPrototypeOf(WxAuth.prototype), "_constructor", this).call(this, props);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // this.getUserInfo()
    }
  }, {
    key: "getUserInfo",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _ref7, authSetting;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _index2.default.getSetting();

              case 2:
                _ref7 = _context3.sent;
                authSetting = _ref7.authSetting;

                if (!authSetting['scope.userInfo']) {
                  _context3.next = 9;
                  break;
                }

                _context3.next = 7;
                return _index2.default.getUserInfo({ lang: 'zh_CN' });

              case 7:
                userInfo = _context3.sent;

                console.info(userInfo);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getUserInfo() {
        return _ref6.apply(this, arguments);
      }

      return getUserInfo;
    }()
  }, {
    key: "redirect",
    value: function redirect() {
      var redirect = this.$router.params.redirect;
      var redirect_url = redirect ? decodeURIComponent(redirect) : '/pages/home/index';

      _index2.default.redirectTo({
        url: redirect_url
      });
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var userInfo = this.__state.userInfo;


      Object.assign(this.__state, {
        userInfo: userInfo
      });
      return this.__state;
    }
  }]);

  return WxAuth;
}(_index.Component), _class.properties = {}, _class.$$events = ["handleGetUserInfo"], _temp2);
exports.default = WxAuth;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WxAuth, true));