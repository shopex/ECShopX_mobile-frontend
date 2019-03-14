import Taro from '@tarojs/taro'
import S from '@/spx'

export default function useHooks () {
  S.bind('logout', () => {
    Taro.navigateTo({
      url: '/pages/auth/login'
    })
  })
}
