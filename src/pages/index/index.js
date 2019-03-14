import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () {
    Taro.redirectTo({
      url: '/pages/home/landing?user_id=8945&company_id=1&scene=user_id%3D8945%26company_id%3D1'
      // url: '/pages/auth/reg'
      // url: '/pages/item/espier-detail?id=268'
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
      </View>
    )
  }
}

