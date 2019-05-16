const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')

const SRC_PATH = path.resolve(__dirname, '../dist')
const DIST_PATH = path.resolve(__dirname, '../dist_iwa')
const pagesToCopy = [
  'article/index',
  'recommend/list',
  'item/list'
]

const appJSON = {
  "pages": [
    "pages/article/index",
    "pages/recommend/list",
    "pages/item/list"
  ]
}

const appStr = `
var _index = require("./npm/@tarojs/taro-weapp/index.js");
var _index2 = _interopRequireDefault(_index);
var _index5 = require("./npm/@tarojs/redux/index.js");
var _index6 = require("./store/index.js");
var _index7 = _interopRequireDefault(_index6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _configStore = (0, _index7.default)(),
    store = _configStore.store;
(0, _index5.setStore)(store);
_index2.default.initPxTransform({
  "designWidth": 750,
  "deviceRatio": {
    "640": 1.17,
    "750": 1,
    "828": 0.905
  }
});
`

const files = glob.sync('**/*', {
  cwd: SRC_PATH,
  nodir: true,
  ignore: [
    'app.json',
    'pages/**/*',
    'project.config*',
    'assets/**/*'
  ]
})

const include = results => file => {
  return results.some(name => file.indexOf(name) >= 0)
}

const pages = glob.sync('pages/**/*.*', {
    cwd: SRC_PATH
  })
  .filter(include(pagesToCopy))

async function copyFile (file) {
  const from = path.resolve(SRC_PATH, file)
  const to = path.resolve(DIST_PATH, file)
  await fs.copySync(from, to)
}

fs.emptyDir(DIST_PATH)
  .then(() => {
    [...files, ...pages].forEach(copyFile)

    fs.writeJSON(path.resolve(DIST_PATH, 'app.json'), appJSON, err => {
      if (err) console.log(err)
    })
    fs.outputFile(path.resolve(DIST_PATH, 'app.js'), appStr, err => {
      if (err) console.log(err)
    })
  })
