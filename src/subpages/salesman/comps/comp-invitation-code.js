import React, { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { SpImage } from '@/components'
import './comp-invitation-code.scss'

const initialState = {
  list: [],
}

function CompInvitationCode(props) {
  const [state, setState] = useImmer(initialState)
  const {
    status = true,
    information = { name: '分销员名称', distributor_name: '分销员店铺名称' },
    cancel = () => {}
  } = props
  const { list } = state

  const preserves = () => {
    Taro.downloadFile({
      url: 'https://example.com/path/to/image.jpg', // 网络图片链接
      success: function (res) {
        // 下载成功，保存图片到相册
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath, // 下载后的图片临时文件路径
          success: function (res) {
            // 保存成功
            Taro.showToast({
              title: '图片保存成功'
            })
          },
          fail: function (err) {
            // 保存失败
            Taro.showToast({
              title: '图片保存失败',
              icon: 'none'
            })
          }
        })
      },
      fail: function (err) {
        // 下载失败
        Taro.showToast({
          title: '图片下载失败',
          icon: 'none'
        })
      }
    })
  }

  return (
    <View className='comp-invitation'>
      <View className='comp-invitation-code'>
        <View className='comp-invitation-code-pop'>
          <SpImage src='fxy_bk.png' className='fxy_bk' />
          <View className='comp-invitation-code-pop-text'>
            {status ? (
              <View className='name'>
                <View>{information.name}</View>
                <View>{information.distributor_name}</View>
              </View>
            ) : (
              <View className='names'>{information.name}</View>
            )}

            <View className='img'></View>
            <View className='preserve' onClick={preserves}>
              <Text className='iconfont icon-baocuntupian'></Text>
              <Text>保存图片</Text>
            </View>
          </View>
        </View>
        <Text className='iconfont icon-guanbi3' onClick={cancel} />
      </View>
    </View>
  )
}

CompInvitationCode.options = {
  addGlobalClass: true
}

export default CompInvitationCode
