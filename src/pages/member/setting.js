import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { SpCell, NavBar } from '@/components'
import S from '@/spx'

export default class MemberSetting extends Component {
  handleClickLogout = () => {
    S.logout()
    Taro.redirectTo({
      url: '/pages/home/index'
    })
  }

  render () {
    return (
      <View class='page-member-setting'>
        <NavBar
          title='设置'
        />

        <View className='sec'>
          <SpCell title='版本'>
            {APP_VERSION}
          </SpCell>
        </View>

        <View className='btns'>
          <AtButton
            type='primary'
            onClick={this.handleClickLogout}
            size='large'
          >退出登录</AtButton>
        </View>
      </View>
    )
  }
}
