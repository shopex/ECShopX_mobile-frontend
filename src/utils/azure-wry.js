import Taro from "@tarojs/taro";
import AzureStorage from 'azure-storage/browser/azure-storage.blob.export'
import req from '@/api/req'
import { APP_COMPANY_ID } from '@/config'


async function uploadImageFn (imgFiles, getUrl) {
  let promises = []
  for (let item of imgFiles) {
    const promise = new Promise(async (resolve, reject) => {
      if (!item.file) {
        resolve(item)
      } else {
        // const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
        Taro.uploadFile({
          url: req.baseURL,
          filePath: item.url,
          name: 'file',
          formData:{
            'file': item.url,
          },
          success: res => {
            console.log(res, 23)
            // let imgData = JSON.parse(res.data)

          },
          fail: error => reject(error)
        })
       /* console.log(item.url, 37)
        var formData = new FormData(filename);
        formData.append('file', filename);
        console.log(formData.get('file'),39)*/
        /*Taro.request({
          url: req.baseURL + 'espier/upload',
          method: 'POST',
          data: {
            file: filename,
            company_id: APP_COMPANY_ID
          }
        }).then(res => {
          console.log(res, 49)
        })*/
        /*const res = await req.post(getUrl, {
          file: filename
        })*/

      }
    })
    promises.push(promise)
  }

  let results = await Promise.all(promises)

  return results
}

export default {
  uploadImageFn
}
