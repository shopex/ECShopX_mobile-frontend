"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _class, _class2, _temp2;

var _index = require("../../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("../../hocs/index.js");

var _index4 = require("../../api/index.js");

var _index5 = _interopRequireDefault(_index4);

var _index6 = require("../../utils/index.js");

var _index7 = require("../../spx/index.js");

var _index8 = _interopRequireDefault(_index7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RecommendList = (0, _index3.withPager)(_class = (0, _index3.withBackToTop)(_class = (_temp2 = _class2 = function (_BaseComponent) {
  _inherits(RecommendList, _BaseComponent);

  function RecommendList() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, RecommendList);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = RecommendList.__proto__ || Object.getPrototypeOf(RecommendList)).call.apply(_ref, [this].concat(args))), _this), _this.$usedState = ["anonymousState__temp", "loopArray0", "multiIndex", "areaList", "showDrawer", "scrollTop", "list", "page", "showBackToTop", "info"], _this.handleClickItem = function (item) {
      var url = "/pages/recommend/detail?id=" + item.item_id;
      _index2.default.navigateTo({
        url: url
      });
    }, _this.handleClickFilter = function () {
      _this.setState({
        showDrawer: true
      });
    }, _this.handleClickPicker = function () {
      var arrProvice = [];
      var arrCity = [];
      var arrCounty = [];
      if (_this.addList) {
        _this.addList.map(function (item, index) {
          arrProvice.push(item.label);
          if (index === 0) {
            item.children.map(function (c_item, c_index) {
              arrCity.push(c_item.label);
              if (c_index === 0) {
                c_item.children.map(function (cny_item) {
                  arrCounty.push(cny_item.label);
                });
              }
            });
          }
        });
        _this.setState({
          areaList: [arrProvice, arrCity, arrCounty],
          multiIndex: [0, 0, 0]
        });
      }
    }, _this.bindMultiPickerChange = function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
        var info;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                info = _this.state.info;

                _this.addList.map(function (item, index) {
                  if (index === e.detail.value[0]) {
                    info.province = item.label;
                    item.children.map(function (s_item, sIndex) {
                      if (sIndex === e.detail.value[1]) {
                        info.city = s_item.label;
                        s_item.children.map(function (th_item, thIndex) {
                          if (thIndex === e.detail.value[2]) {
                            info.county = th_item.label;
                          }
                        });
                      }
                    });
                  }
                });
                _this.setState({ info: info });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }(), _this.bindMultiPickerColumnChange = function (e) {
      var _this$state = _this.state,
          areaList = _this$state.areaList,
          multiIndex = _this$state.multiIndex;

      if (e.detail.column === 0) {
        _this.setState({
          multiIndex: [e.detail.value, 0, 0]
        });
        _this.addList.map(function (item, index) {
          if (index === e.detail.value) {
            var arrCity = [];
            var arrCounty = [];
            item.children.map(function (c_item, c_index) {
              arrCity.push(c_item.label);
              if (c_index === 0) {
                c_item.children.map(function (cny_item) {
                  arrCounty.push(cny_item.label);
                });
              }
            });
            areaList[1] = arrCity;
            areaList[2] = arrCounty;
            _this.setState({ areaList: areaList });
          }
        });
      } else if (e.detail.column === 1) {
        multiIndex[1] = e.detail.value;
        multiIndex[2] = 0;
        _this.setState({
          multiIndex: multiIndex
        }, function () {
          _this.addList[multiIndex[0]].children.map(function (c_item, c_index) {
            if (c_index === e.detail.value) {
              var arrCounty = [];
              c_item.children.map(function (cny_item) {
                arrCounty.push(cny_item.label);
              });
              areaList[2] = arrCounty;
              _this.setState({ areaList: areaList });
            }
          });
        });
      } else {
        multiIndex[2] = e.detail.value;
        _this.setState({
          multiIndex: multiIndex
        });
      }
    }, _this.anonymousFunc0Array = [], _this.$$refs = [], _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RecommendList, [{
    key: "_constructor",
    value: function _constructor(props) {
      _get(RecommendList.prototype.__proto__ || Object.getPrototypeOf(RecommendList.prototype), "_constructor", this).call(this, props);

      this.state = _extends({}, this.state, {
        list: [],
        showDrawer: false,
        info: {},
        areaList: [],
        multiIndex: []
      });
    }
  }, {
    key: "componentDidShow",
    value: function componentDidShow() {
      var _this3 = this;

      _index2.default.showLoading();
      this.resetPage();
      this.setState({
        list: []
      });
      setTimeout(function () {
        _this3.nextPage();
        _index2.default.hideLoading();
      }, 200);

      // this.praiseNum()
    }
  }, {
    key: "fetch",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
        var page, pageSize, article_query, res, addList, arrProvice, arrCity, arrCounty, _ref4, list, total, nList;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                page = params.page_no, pageSize = params.page_size;
                article_query = {
                  article_type: 'bring',
                  page: page,
                  pageSize: pageSize
                };
                _context2.next = 4;
                return _index5.default.member.areaList();

              case 4:
                res = _context2.sent;
                addList = (0, _index6.pickBy)(res, {
                  label: 'label',
                  children: 'children'
                });

                this.addList = addList;
                arrProvice = [];
                arrCity = [];
                arrCounty = [];

                addList.map(function (item, index) {
                  arrProvice.push(item.label);
                  if (index === 0) {
                    item.children.map(function (c_item, c_index) {
                      arrCity.push(c_item.label);
                      if (c_index === 0) {
                        c_item.children.map(function (cny_item) {
                          arrCounty.push(cny_item.label);
                        });
                      }
                    });
                  }
                });
                this.setState({
                  areaList: [arrProvice, arrCity, arrCounty]
                });

                if (!_index8.default.getAuthToken()) {
                  _context2.next = 18;
                  break;
                }

                _context2.next = 15;
                return _index5.default.article.authList(article_query);

              case 15:
                _context2.t0 = _context2.sent;
                _context2.next = 21;
                break;

              case 18:
                _context2.next = 20;
                return _index5.default.article.list(article_query);

              case 20:
                _context2.t0 = _context2.sent;

              case 21:
                _ref4 = _context2.t0;
                list = _ref4.list;
                total = _ref4.total_count;
                nList = (0, _index6.pickBy)(list, {
                  img: 'image_url',
                  item_id: 'article_id',
                  title: 'title',
                  author: 'author',
                  summary: 'summary',
                  head_portrait: 'head_portrait',
                  isPraise: 'isPraise',
                  articlePraiseNum: 'articlePraiseNum.count'
                });


                nList.map(function (item) {
                  if (!item.articlePraiseNum) {
                    item.articlePraiseNum = 0;
                  }
                });

                this.setState({
                  list: [].concat(_toConsumableArray(this.state.list), _toConsumableArray(nList))
                });

                return _context2.abrupt("return", {
                  total: total
                });

              case 28:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function fetch(_x2) {
        return _ref3.apply(this, arguments);
      }

      return fetch;
    }()

    // 选定开户地区

  }, {
    key: "_createData",
    value: function _createData() {
      var _this4 = this;

      this.__state = arguments[0] || this.state || {};
      this.__props = arguments[1] || this.props || {};
      var __runloopRef = arguments[2];
      ;

      var _state = this.__state,
          list = _state.list,
          showBackToTop = _state.showBackToTop,
          scrollTop = _state.scrollTop,
          page = _state.page,
          showDrawer = _state.showDrawer;


      var anonymousState__temp = "" + _index2.default.pxTransform(500);
      var loopArray0 = list.map(function (item, __index0) {
        item = {
          $original: (0, _index.internal_get_original)(item)
        };

        _this4.anonymousFunc0Array[__index0] = function () {
          return _this4.handleClickItem(item.$original);
        };

        return {
          $original: item.$original
        };
      });
      Object.assign(this.__state, {
        anonymousState__temp: anonymousState__temp,
        loopArray0: loopArray0,
        scrollTop: scrollTop,
        page: page,
        showBackToTop: showBackToTop
      });
      return this.__state;
    }
  }, {
    key: "anonymousFunc0",
    value: function anonymousFunc0(__index0, e) {
      ;
      this.anonymousFunc0Array[__index0] && this.anonymousFunc0Array[__index0](e);
    }
  }]);

  return RecommendList;
}(_index.Component), _class2.properties = {}, _class2.$$events = ["handleConfirm", "handleClickFilter", "handleClickPicker", "bindMultiPickerChange", "bindMultiPickerColumnChange", "handleClickSearchParams", "handleScroll", "nextPage", "anonymousFunc0", "scrollBackToTop"], _class2.config = {
  navigationBarTitleText: '种草'
}, _temp2)) || _class) || _class;

exports.default = RecommendList;

Component(require('../../npm/@tarojs/taro-weapp/index.js').default.createComponent(RecommendList, true));