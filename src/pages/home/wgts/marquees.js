import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import { AtNoticebar } from 'taro-ui'

import './marquees.scss'

export default class WgtMarquees extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor(props) {
    super(props)

    this.state = {
      announce: null
    }
  }

  componentDidMount() {
    const { info } = this.props
    const { config, data } = info

    if (config.direction === 'horizontal') {
      const announce = data.map((t) => t.title).join('　　')
      this.setState({
        announce
      })
    }
  }

  handleClickItem = (id) => {
    try {
      Taro.navigateTo({
        url: `/subpage/pages/recommend/detail?id=${id}`
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { info } = this.props

    if (!info) {
      return null
    }
    const { config, base, data } = info
    const { announce } = this.state

    return (
      <View
        className={classNames(`wgt wgt-goods-grid`, {
          wgt__padded: base.padded
        })}
      >
        {config.label && (
          <View
            className='marquees-label'
            style={styleNames({
              color: config.labelcolor
            })}
          >
            <Text className='iconfont icon-tongzhituiguang'></Text>
            {config.label}
          </View>
        )}
        {config.direction === 'vertical' ? (
          <Swiper
            className='marquees'
            style={styleNames({
              background: config.bgcolor
            })}
            autoplay
            circular
            interval={3000}
            duration={300}
            vertical={config.direction}
          >
            {data.map((item, idx) => (
              <SwiperItem key={`marquees-item__${idx}`} className='marquees-item'>
                <View
                  className='item-text'
                  style={styleNames({
                    color: config.fontcolor
                  })}
                  onClick={this.handleClickItem.bind(this, item.id)}
                >
                  {item.title}
                </View>
              </SwiperItem>
            ))}
          </Swiper>
        ) : (
          <View
            style={styleNames({
              background: config.bgcolor,
              color: config.fontcolor
            })}
          >
            <AtNoticebar marquee>
              <View
                style={styleNames({
                  color: config.fontcolor
                })}
              >
                {announce}
              </View>
            </AtNoticebar>
          </View>
        )}
      </View>
    )
  }
}
