"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// import * as AzureStorage from 'azure-storage/browser/azure-storage.blob.export'
// import log from "./log";
// var querystring = require('querystring')

var uploadImageFn = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(imgFiles, getUrl, curFilesystem, curFiletype) {
    var _this = this;

    var promises, _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, results;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            promises = [];
            /*var sasToken = 'sv=2017-11-09&sr=c&se=2019-06-08T07:44:41Z&sp=rw&spr=https&sig=HmMpfx%2F4t8OEadu6W1YVbvm%2FA4%2B1JZPRB8QfDyrYRko%3D';
            var fileUri = 'https://shopexbbcdata.blob.core.chinacloudapi.cn';
            var blobService = AzureStorage.createBlobServiceWithSas(fileUri, sasToken);
            console.log(blobService)
            // If one file has been selected in the HTML file input element
            var file = document.getElementById('fileinput').files[0];
              var customBlockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
            blobService.singleBlobPutThresholdInBytes = customBlockSize;
              var finishedOrError = false;
              var speedSummary = blobService.createBlockBlobFromBrowserFile('espier-images', 'aaa/bbb/ccc/dd111d' + file.name, file, {blockSize : customBlockSize}, function(error, result, response) {
              finishedOrError = true;
              if (error) {
                // Upload blob failed
                console.log('Upload blob failed')
              } else {
                console.log('Upload successfully')
                // Upload successfully
              }
            });*/

            _loop = function _loop(item) {
              var promise = new Promise(function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                  var filename, _ref3, region, token, key, domain, fileUri, blobService;

                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (item.file) {
                            _context.next = 4;
                            break;
                          }

                          resolve(item);
                          _context.next = 15;
                          break;

                        case 4:
                          filename = item.url.slice(item.url.lastIndexOf('/') + 1);
                          _context.next = 7;
                          return _req2.default.get(getUrl, {
                            filesystem: curFilesystem,
                            filetype: curFiletype,
                            filename: filename
                          });

                        case 7:
                          _ref3 = _context.sent;
                          region = _ref3.region;
                          token = _ref3.token;
                          key = _ref3.key;
                          domain = _ref3.domain;
                          fileUri = 'https://shopexbbcdata.blob.core.chinacloudapi.cn';
                          blobService = _azureStorageBlobExport2.default.createBlobServiceWithSas(fileUri, token).withFilter(new _azureStorageBlobExport2.default.ExponentialRetryPolicyFilter());


                          console.log(blobService, 42);
                          // let uploadUrl = uploadURLFromRegionCode(region)
                          /*Taro.uploadFile({
                            url: fileUri,
                            filePath: item.url,
                            name: 'file',
                            formData:{
                              'token': token,
                              'key': key
                            },
                            success: res => {
                              let imgData = JSON.parse(res.data)
                              resolve({
                                url: `${domain}/${imgData.key}`
                              })
                            },
                            fail: error => reject(error)
                          })*/

                        case 15:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x5, _x6) {
                  return _ref2.apply(this, arguments);
                };
              }());
              promises.push(promise);
            };

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 5;
            for (_iterator = imgFiles[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              item = _step.value;

              _loop(item);
            }

            _context2.next = 13;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](5);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 13:
            _context2.prev = 13;
            _context2.prev = 14;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 16:
            _context2.prev = 16;

            if (!_didIteratorError) {
              _context2.next = 19;
              break;
            }

            throw _iteratorError;

          case 19:
            return _context2.finish(16);

          case 20:
            return _context2.finish(13);

          case 21:
            _context2.next = 23;
            return Promise.all(promises);

          case 23:
            results = _context2.sent;
            return _context2.abrupt("return", results);

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[5, 9, 13, 21], [14,, 16, 20]]);
  }));

  return function uploadImageFn(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

/*function resolveBlobFromFile (url, type) {
  return fetch(url)
    .then(res => res.blob())
    .then(blob => blob.slice(0, blob.size, type))
}

function uploadURLFromRegionCode(code) {
  let uploadURL = null;
  switch(code) {
    case 'z0': uploadURL = 'https://up.qiniup.com'; break;
    case 'z1': uploadURL = 'https://up-z1.qiniup.com'; break;
    case 'z2': uploadURL = 'https://up-z2.qiniup.com'; break;
    case 'na0': uploadURL = 'https://up-na0.qiniup.com'; break;
    case 'as0': uploadURL = 'https://up-as0.qiniup.com'; break;
    default: console.error('please make the region is with one of [z0, z1, z2, na0, as0]');
  }
  return uploadURL;
}*/

// module.export = {
//   uploadImageFn: uploadImageFn,
// }

var _index = require("../npm/@tarojs/taro-weapp/index.js");

var _index2 = _interopRequireDefault(_index);

var _azureStorageBlobExport = require("../npm/azure-storage/browser/azure-storage.blob.export.js");

var _azureStorageBlobExport2 = _interopRequireDefault(_azureStorageBlobExport);

var _req = require("../api/req.js");

var _req2 = _interopRequireDefault(_req);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  uploadImageFn: uploadImageFn
};