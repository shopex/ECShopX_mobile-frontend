"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _dec, _class, _class2, _temp2;

var _index = require("../../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _helper = require("./helper.js");

var _index3 = require("../../../npm/@tarojs/redux/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WgtGoods = (_dec = (0, _index3.connect)(function (_ref) {
  var cart = _ref.cart,
      member = _ref.member;
  return {
    cart: cart,
    favs: member.favs
  };
}, function (dispatch) {
  return {
    onFastbuy: function onFastbuy(item) {
      return dispatch({ type: 'cart/fastbuy', payload: { item: item } });
    },
    onAddCart: function onAddCart(item) {
      return dispatch({ type: 'cart/add', payload: { item: item } });
    },
    onAddFav: function onAddFav(_ref2) {
      var item_id = _ref2.item_id;
      return dispatch({ type: 'member/addFav', payload: { item_id: item_id } });
    },
    onDelFav: function onDelFav(_ref3) {
      var item_id = _ref3.item_id;
      return dispatch({ type: 'member/delFav', payload: { item_id: item_id } });
    }
  };
}), _dec(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(WgtGoods, _BaseComponent);

  function WgtGoods() {
    var _ref4,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, WgtGoods);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref4 = WgtGoods.__proto__ || Object.getPrototypeOf(WgtGoods)).call.apply(_ref4, [this].concat(args))), _this), _this.$usedState = ["info", "base", "data", "curIdx"], _this.handleClickItem = _helper.linkPage, _this.handleSwiperChange = function (e) {
      var current = e.detail.current;


      _this.setState({
        curIdx: current
      });
    }, _this.handleClickOperate = function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item_data, type) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                /*console.log(item_data, this.props.favs, 37)
                if(type === 'collect') {
                  let is_fav = Boolean(this.props.favs[item_data.item_id])
                  console.log(is_fav, 39)
                  if (!is_fav) {
                    await api.member.addFav(item_data.item_id)
                    // this.props.onAddFav(item_data)
                    Taro.showToast({
                      title: '已加入收藏',
                      icon: 'none'
                    })
                  } else {
                    await api.member.delFav(item_data.item_id)
                    // this.props.onDelFav(item_data)
                    Taro.showToast({
                      title: '已移出收藏',
                      icon: 'none'
                    })
                  }
                }*/

                if (type === 'buy') {}

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x, _x2) {
        return _ref5.apply(this, arguments);
      };
    }(), _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(WgtGoods, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(WgtGoods.prototype.__proto__ || Object.getPrototypeOf(WgtGoods.prototype), "_constructor", this).call(this, props);

      this.state = {
        curIdx: 0
      };
    }
  }, {
    key: "_createData",
    value: function _createData() {
      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var info = this.__props.info;
      var curIdx = this.__state.curIdx;


      if (!info) {
        return null;
      }

      var config = info.config,
          base = info.base,
          data = info.data;

      var curContent = (data[curIdx] || {}).content;

      Object.assign(this.__state, {
        info: info,
        base: base,
        data: data
      });
      return this.__state;
    }
  }]);

  return WgtGoods;
}(_index.Component), _class2.properties = {
  "info": {
    "type": null,
    "value": null
  }
}, _class2.$$events = ["handleClickOperate"], _class2.options = {
  addGlobalClass: true
}, _class2.defaultProps = {
  info: null
}, _temp2)) || _class);
exports.default = WgtGoods;

Component(require('../../../npm/@tarojs/taro-weapp/index.js').default.createComponent(WgtGoods));