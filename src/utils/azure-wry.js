import Taro from "@tarojs/taro";
import AzureStorage from 'azure-storage/browser/azure-storage.blob.export'
import req from '@/api/req'
// import * as AzureStorage from 'azure-storage/browser/azure-storage.blob.export'
// import log from "./log";
// var querystring = require('querystring')

async function uploadImageFn (imgFiles, getUrl, curFilesystem, curFiletype) {
  let promises = []
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
  for (let item of imgFiles) {
    const promise = new Promise(async (resolve, reject) => {
      if (!item.file) {
        resolve(item)
      } else {
        const filename = item.url.slice(item.url.lastIndexOf('/') + 1)
        const { region, token, key, domain } = await req.get(getUrl, {
          filesystem: curFilesystem,
          filetype: curFiletype,
          filename
        })
        let  fileUri = 'https://shopexbbcdata.blob.core.chinacloudapi.cn'
        let blobService = AzureStorage.createBlobServiceWithSas(fileUri, token).withFilter(new AzureStorage.ExponentialRetryPolicyFilter())

        console.log(blobService, 42)
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

      }
    })
    promises.push(promise)
  }

  let results = await Promise.all(promises)

  return results
}

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

export default {
  uploadImageFn
}
