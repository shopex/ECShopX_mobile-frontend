import Taro, { Component } from "@tarojs/taro"
import { View, Button } from "@tarojs/components"
import "./member-setting.scss"

export default class SettingIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
    };
  }

  config = {
    navigationBarTitleText: '注销账号'
  }

  render() {
    return (
      <View className='destory-member'>
        的点点滴滴
      </View>
    );
  }
}
