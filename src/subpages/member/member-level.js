import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, ScrollView } from '@tarojs/components'
import { SpPage, SpImage, SpHtml } from '@/components'
import { styleNames } from '@/utils'
import './member-level.scss'

function MemberLevel(props) {
  return (
    <SpPage className='page-member-level'>
      <View
        className='level-hd'
        style={styleNames({
          background: `url(${process.env.APP_IMAGE_CDN}/member_bg.jpg)`
        })}
      >
        <ScrollView className="member-card-scroll" scrollX>
          {[1, 2, 3, 4, 5].map((item) => (
            <View className='member-card'>
              {/* <View
                className='member-card'
                style={styleNames({
                  background: `url(${process.env.APP_IMAGE_CDN}/fufei_bg.png)`
                })}
              ></View> */}
              <SpImage src="fufei_bg.png" width={600} height={375} />
            </View>
          ))}
        </ScrollView>
      </View>
      <View className='level-bd'>
        <View className='content-hd'>
          <SpImage src='quanyi_zuo.png' width={200} height={36} />
          <View className='title'>读取会员名称权益</View>
          <SpImage src='quanyi_you.png' width={200} height={36} />
        </View>
        <View className='content-bd'>
          <SpHtml content='<p>123</p>'></SpHtml>
        </View>
        <View className='content-ft'>
          <SpImage src='quanyi_h.png' width={556} height={54} />
        </View>
      </View>
    </SpPage>
  )
}

MemberLevel.options = {
  addGlobalClass: true
}

export default MemberLevel
