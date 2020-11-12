/*
 * @Author: Arvin
 * @GitHub: https://github.com/973749104
 * @Blog: https://liuhgxu.com
 * @Description: 说明
 * @FilePath: /unite-vshop/src/utils/upload.js
 * @Date: 2020-03-06 16:32:07
 * @LastEditors: Arvin
 * @LastEditTime: 2020-11-12 17:24:10
 */
import Taro from '@tarojs/taro'
import req from '@/api/req'
// import * as qiniu from 'qiniu-js'

const getToken = (params) => {
  return req.get('espier/image_upload_token', params)
}

// const uploadURLFromRegionCode = (code) => {
//   switch(code) {
//       case 'z0': return'https://up.qiniup.com'
//       case 'z1': return 'https://up-z1.qiniup.com'
//       case 'z2': return 'https://up-z2.qiniup.com'
//       case 'na0': return 'https://up-na0.qiniup.com'
//       case 'as0': return 'https://up-as0.qiniup.com'
//       default: console.error('please make the region is with one of [z0, z1, z2, na0, as0]')
//   }
// }

const upload = {
  aliUpload: async (item, tokenRes) => {
    const {accessid, dir, host, policy, signature} = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    try {
      const res = await Taro.uploadFile({
        url: host,
        filePath: item.url,
        name: 'file',
        formData:{
          name: filename,
          key: `${dir}`,
          policy: policy,
          OSSAccessKeyId: accessid,
          // 让服务端返回200
          signature: signature,
          success_action_status: '200',
          // 服务端回调
          // callback: callback
        }
      })
      if (!res) {
        return false
      }
      return {
        url: `${host}${dir}`
      }
    } catch (e) {
      throw new Error (e)
    }
  },
  qiNiuUpload: async (item, tokenRes) => {
    const { token, key, domain, host } = tokenRes
    // const url = uploadURLFromRegionCode(region)
    try {
      const { data } = await Taro.uploadFile({
        url: host,
        filePath: item.url,
        name: 'file',
        formData:{
          'token': token,
          'key': key
      }})
      const imgData = JSON.parse(data)
      if (!imgData.key) {
        return false
      }
      return {
        url: `${domain}/${imgData.key}`
      }
    } catch (e) {
      throw new Error (e)
    }
  },
  localUpload: async (item, tokenRes) => {
    const { filetype, domain } = tokenRes
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    try {
      const res = await Taro.uploadFile({
        url: `${req.baseURL}espier/uploadlocal`,
        filePath: item.url,
        name: 'images',
        formData:{
          name: filename,
          filetype
        }
      })
      const data = JSON.parse(res.data)
      const { image_url } = data.data
      if (!image_url) {
        return false
      }
      return {
        url: `${domain}/${image_url}`
      }
    } catch (e) {
      throw new Error (e)
    }
  },
  awsUpload: async (item, tokenRes) => {
    const {
      key, 
      XAmzCredential = 'AKIA4MSC276F5NBR4P7G/20201112/cn-northwest-1/s3/aws4_request',
      XAmzAlgorithm = 'AWS4-HMAC-SHA256',
      XAmzDate = '20201112T082518Z',
      Policy = 'eyJleHBpcmF0aW9uIjoiMjAyMC0xMS0xMlQxMDoyNToxOFoiLCJjb25kaXRpb25zIjpbeyJidWNrZXQiOiJ3ZW1hbGwtbWVkaWEtZGV2In0seyJrZXkiOiJpbWFnZVwvMVwvMjAyMFwvMTFcLzEyXC9hOTMxN2FkOTNkNmI4MThhNzQyOTQ0NmU1MzM4YzY4Y3Rlc3QuanBnIn0seyJYLUFtei1EYXRlIjoiMjAyMDExMTJUMDgyNTE4WiJ9LHsiWC1BbXotQ3JlZGVudGlhbCI6IkFLSUE0TVNDMjc2RjVOQlI0UDdHXC8yMDIwMTExMlwvY24tbm9ydGh3ZXN0LTFcL3MzXC9hd3M0X3JlcXVlc3QifSx7IlgtQW16LUFsZ29yaXRobSI6IkFXUzQtSE1BQy1TSEEyNTYifV19',
      formAttributes = {
        action: 'https://wemall-media-dev.s3.cn-northwest-1.amazonaws.com.cn'
      },
      XAmzSignature = '2a2b5560a48e36c29c65ab4144dc2cc570c125dbf20833ba9d16ca060be01cf9' 
    } = tokenRes

    try {
      const res = await Taro.uploadFile({
        url: formAttributes.action,
        filePath: item.url,
        name: 'file',
        formData:{
          key,
          'X-Amz-Credential': XAmzCredential,
          'X-Amz-Algorithm': `AES256`,
          Policy: Policy,
          'X-Amz-Algorithm': XAmzAlgorithm,
          'X-Amz-Date': XAmzDate,
          'X-Amz-Signature': XAmzSignature
        }
      })
      console.log(res)
      // const data = JSON.parse(res.data)
      const { image_url } = res
      if (!image_url) {
        return false
      }
      return {
        url: ``
      }
    } catch (e) {
      throw new Error (e)
    }
  }
}

const getUploadFun = (dirver) => {
  const type = 'aws' || dirver
  switch (type) {
    case 'oss':
      return 'aliUpload'
    case 'local':
      return 'localUpload'
    case 'aws':
      return 'awsUpload'
    default:
      return 'qiNiuUpload'
  }
}

// 返回对应上传方式
const uploadImageFn = async (imgFiles, filetype = 'image') => {
  const imgs = []
  for (const item of imgFiles) {
    const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
    const { driver, token } = await getToken({ filetype, filename })
    const uploadType = getUploadFun(driver)
    if (!item.file) {
      continue
    }
    try {
      const img = await upload[uploadType](item, { ...token, filetype})
      if (!img || !img.url) {
        continue
      }
      imgs.push(img)
    } catch (e) {
      console.log(e)
    }
  }
  return imgs
}

export default {
  uploadImageFn
}