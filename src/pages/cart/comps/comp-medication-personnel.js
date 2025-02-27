import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
import { SpImage } from '@/components'
import { AtFloatLayout, AtButton } from 'taro-ui'
import { View, Text, Button } from '@tarojs/components'

import './comp-medication-personnel.scss'
import Taro from '@tarojs/taro'

function CompMedicationPersonnel(props) {
  const {
    isOpened = false,
    colsePersonnel = () => { }
  } = props

  const [state, setState] = useImmer({

  })

  const { } = state


  return (
    <View className='comp-medication-personnel'>
      <AtFloatLayout isOpened={isOpened}>
        <View>
          <View className='title'>
            <View className='title-text'>添加/修改用药人</View>
            <Text className='iconfont icon-guanbi-01' onClick={colsePersonnel}></Text>
          </View>
          <View className='prompt'>
            <Text className='iconfont icon-bg-security'></Text>
            您的信息仅用于平台信息校验，平台会保障您的个人信息安全
          </View>
          <View className='informations'>
            <View className='informations-item'>
              <View className='label'>
                <SpImage src='men.png' width={80} />
                <View className='info'>
                  <View>
                    <Text>小鑫鑫</Text>
                    <Text className='relationship'>本人</Text>
                  </View>
                  <View className='age'>女 18岁</View>
                </View>
              </View>
              <View className='icon-wrap'>
                <Text className='iconfont icon-bianji1'></Text>
                <Text className='iconfont icon-shanchu'></Text>
              </View>
            </View>

            <View className='informations-item'>
              <View className='label'>
                <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
                <View className='info'>
                  <View>
                    <Text>小鑫鑫</Text>
                    <Text className='relationship'>本人</Text>
                  </View>
                  <View className='age'>女 18岁</View>
                </View>
              </View>
              <View className='icon-wrap'>
                <Text className='iconfont icon-bianji1'></Text>
                <Text className='iconfont icon-shanchu'></Text>
              </View>
            </View>
            <View className='informations-item'>
              <View className='label'>
                <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
                <View className='info'>
                  <View>
                    <Text>小鑫鑫</Text>
                    <Text className='relationship'>本人</Text>
                  </View>
                  <View className='age'>女 18岁</View>
                </View>
              </View>
              <View className='icon-wrap'>
                <Text className='iconfont icon-bianji1'></Text>
                <Text className='iconfont icon-shanchu'></Text>
              </View>
            </View>
            <View className='informations-item'>
              <View className='label'>
                <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
                <View className='info'>
                  <View>
                    <Text>小鑫鑫</Text>
                    <Text className='relationship'>本人</Text>
                  </View>
                  <View className='age'>女 18岁</View>
                </View>
              </View>
              <View className='icon-wrap'>
                <Text className='iconfont icon-bianji1'></Text>
                <Text className='iconfont icon-shanchu'></Text>
              </View>
            </View>
            <View className='informations-item'>
              <View className='label'>
                <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
                <View className='info'>
                  <View>
                    <Text>小鑫鑫</Text>
                    <Text className='relationship'>本人</Text>
                  </View>
                  <View className='age'>女 18岁</View>
                </View>
              </View>
              <View className='icon-wrap'>
                <Text className='iconfont icon-bianji1'></Text>
                <Text className='iconfont icon-shanchu'></Text>
              </View>
            </View>
            <View className='informations-item'>
              <View className='label'>
                <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
                <View className='info'>
                  <View>
                    <Text>小鑫鑫</Text>
                    <Text className='relationship'>本人</Text>
                  </View>
                  <View className='age'>女 18岁</View>
                </View>
              </View>
              <View className='icon-wrap'>
                <Text className='iconfont icon-bianji1'></Text>
                <Text className='iconfont icon-shanchu'></Text>
              </View>
            </View>
            <View className='informations-item'>
              <View className='label'>
                <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
                <View className='info'>
                  <View>
                    <Text>小鑫鑫</Text>
                    <Text className='relationship'>本人</Text>
                  </View>
                  <View className='age'>女 18岁</View>
                </View>
              </View>
              <View className='icon-wrap'>
                <Text className='iconfont icon-bianji1'></Text>
                <Text className='iconfont icon-shanchu'></Text>
              </View>
            </View>
            <View className='informations-item'>
              <View className='label'>
                <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
                <View className='info'>
                  <View>
                    <Text>小鑫鑫</Text>
                    <Text className='relationship'>本人</Text>
                  </View>
                  <View className='age'>女 18岁</View>
                </View>
              </View>
              <View className='icon-wrap'>
                <Text className='iconfont icon-bianji1'></Text>
                <Text className='iconfont icon-shanchu'></Text>
              </View>
            </View>
            <View className='informations-item'>
              <View className='label'>
                <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
                <View className='info'>
                  <View>
                    <Text>小鑫鑫</Text>
                    <Text className='relationship'>本人</Text>
                  </View>
                  <View className='age'>女 18岁</View>
                </View>
              </View>
              <View className='icon-wrap'>
                <Text className='iconfont icon-bianji1'></Text>
                <Text className='iconfont icon-shanchu'></Text>
              </View>
            </View>

          </View>

          <View className='btn-wrap'>
            <AtButton circle type='primary'
              onClick={() => {
                Taro.navigateTo({
                  url: '/pages/cart/add-personnel'
                })
              }}
            >
              添加用药人
            </AtButton>
          </View>
        </View>
      </AtFloatLayout>
    </View>
  )
}

CompMedicationPersonnel.options = {
  addGlobalClass: true
}

export default CompMedicationPersonnel
