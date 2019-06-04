const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')

const SRC_PATH = path.resolve(__dirname, '../dist')
const DIST_PATH = path.resolve(__dirname, '../dist_iwa')
const pagesToCopy = [
  'iwp/item-list',
  'iwp/item-detail',
  'iwp/recommend-list',
  'iwp/recommend-detail'
]

const componentsToCopy = [
  'item/comps',
  'home/wgts'
]

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

const components = glob.sync('pages/**/*', {
    cwd: SRC_PATH
  })
  .filter(include(componentsToCopy))

function copyFile (file) {
  const from = path.resolve(SRC_PATH, file)
  const to = path.resolve(DIST_PATH, file)
  fs.copySync(from, to)
}

async function resolveAsyncGenerator () {
//   const spxIndexFile = path.resolve(DIST_PATH, 'spx/index.js')

//   let data = await fs.readFile(spxIndexFile, 'utf8')
//   data = `
// Object.defineProperty(Object.prototype, '__root', {
//   get() {
//     if (this && this.App === App) {
//       return this
//     }
//   },
//   configurable: false,
//   enumerable: false
// })
// __root.regeneratorRuntime = require("../npm/regenerator-runtime/runtime.js")
// ` + data

//   await fs.outputFile(spxIndexFile, data)
  const files = glob.sync('**/*', {
    cwd: DIST_PATH,
    nodir: true,
    ignore: [
      'npm/**/*'
    ]
  })

  files.forEach(file => {
    const f = path.resolve(DIST_PATH, file)
    let data = fs.readFileSync(f, 'utf8')
    if (data.indexOf('regeneratorRuntime.') >= 0) {
      console.log(f)
      data = data.replace(/regeneratorRuntime\./g, 'getApp().regeneratorRuntime.')
      fs.outputFileSync(f, data)
    }
  })
}

async function resolveNpmLodashNow () {
  const file = path.resolve(DIST_PATH, 'npm/lodash/now.js')
  let data = await fs.readFile(file, 'utf8')

  data = data.replace('root.Date', 'Date')
  await fs.outputFile(file, data)
}

async function start () {
  await fs.emptyDir(DIST_PATH)
  const filesToCopy = [...files, ...pages, ...components]
  filesToCopy.forEach(copyFile)

  await fs.copy(path.resolve(__dirname, 'template'), DIST_PATH, err => {
    if (err) console.error(err)
  })

  await resolveAsyncGenerator()
  await resolveNpmLodashNow()
}

start()