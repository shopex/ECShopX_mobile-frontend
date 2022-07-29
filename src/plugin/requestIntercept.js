import Taro from '@tarojs/taro'

export function requestIntercept() {
  const interceptor = (chain) => {
    const requestParams = chain.requestParams
    const { method, data, url } = requestParams
    return chain.proceed(requestParams).then(res => {
      console.log(`http <-- ${url} request:`, res)
      return res
    })
  }
  Taro.addInterceptor(interceptor)
}
// export function requestIntercept() {
//   const hookMethods = ['request']
//   hookMethods.forEach((hook) => {
//     const originRequest = wx[hook]
//     console.log('Taro:', wx)
//     Object.defineProperty(wx, hook, {
//       writable: true,
//       enumerable: true,
//       configurable: true,
//       value:  (...args) => {
//         const options = args[0]
//         const { url, method } = options
//         console.log(`requestIntercept:`, options)
//         // 成功回调
//         const successHandler = (res) => {
//           console.log(`successHandler:`, res)
//           // return res
//         }
//         // 失败回调
//         const failHandler = () => {
//           debugger
//         }
//         const actOptions = {
//           ...options,
//           success: successHandler,
//           fail: failHandler
//         }
//         return originRequest.call(this, actOptions)
//       }
//     })
//   })
// }
