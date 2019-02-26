import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.scss'

export default class IconMenu extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    title: '',
    onClick: () => {},
    size: 32
  }

  handleClick = () => {
    const { to, onClick } = this.props
    if (to) {
      Taro.navigateTo({
        url: to
      })
    }

    onClick()
  }

  render () {
    const { img, icon, title, size, className } = this.props

    return (
      <View
        className={`sp-icon-menu ${className || ''}`}
        onClick={this.handleClick}
      >
        <View className='sp-icon-menu__icon'>
          {img && (<Image mode='aspectFill' className='sp-icon-menu__img' src={img} />)}
          {icon && (<AtIcon value={icon} size={size} />)}
        </View>
        <Text className='sp-icon-menu__title'>{title}</Text>
      </View>
    )
  }
}
