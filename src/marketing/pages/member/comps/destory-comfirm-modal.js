import Taro, { Component } from "@tarojs/taro"
import { View } from "@tarojs/components"

import "./destory-comfirm-modal.scss"

export default class SettingIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
    };
  }

  render() {
    const { visible, onCancel, confirmBtn, cancelBtn, content, title } = this.props
    return (
      visible
      ? <View className='destory-comfirm-modal'>
          <View className='content'>
            <View className='title'>{title}</View>
            <View>{content}</View>
            <View onClick={() => onCancel('confirm')} className='confirm-button'>{confirmBtn}</View>
            { cancelBtn && <View onClick={() => onCancel('cancel')} className='cancel-button'>{cancelBtn}</View> }
          </View>
        </View>
      : null
    )
  }
}
