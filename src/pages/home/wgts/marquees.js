import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { classNames } from '@/utils'
import { linkPage } from './helper'

import './slider.scss'

export default class WgtMarquees extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  constructor (props) {
    super(props)
  }

  handleClickItem = linkPage

  render () {
    const { info } = this.props

    if (!info) {
      return null
    }
    const { config, base, data } = info

    return (
      <View className={`wgt ${base.padded ? 'wgt__padded' : null}`}>
        {
          config
            ? <View className={`slider-wrap ${config.padded ? 'padded' : ''}`}>
                <Swiper
                  className='slider-img'
                  circular
                  autoplay
                  current={curIdx}
                  interval={config.interval}
                  duration={300}
                  onChange={this.handleSwiperChange}
                >
                  {data.map((item, idx) => {
                    return (
                      <SwiperItem
                        key={idx}
                        className={`slider-item ${config.rounded ? 'rounded' : null}`}
                      >
                        <View
                          style={`padding: 0 ${config.padded ? Taro.pxTransform(20) : 0}`}
                          onClick={this.handleClickItem.bind(this, item.linkPage, item.id)}
                        >
                          <Image
                            mode='widthFix'
                            className='slider-item__img'
                            src={item.imgUrl}
                          />
                        </View>
                      </SwiperItem>
                    )
                  })}
                </Swiper>

                {data.length > 1 && config.dot && (
                  <View className={classNames('slider-dot', { 'dot-size-switch': config.animation}, config.dotLocation, config.dotCover ? 'cover' : 'no-cover', config.dotColor, config.shape)}>
                    {data.map((dot, dotIdx) =>
                      <View
                        className={classNames('dot', { active: curIdx === dotIdx })}
                        key={dotIdx}
                      ></View>
                    )}
                  </View>
                )}

                {data.length > 1 && !config.dot && (
                  <View className={classNames('slider-count', config.dotLocation, config.shape, config.dotColor)}>
                    {curIdx + 1}/{data.length}
                  </View>
                )}
              </View>
            : null
        }
        {config.content && data.length > 0 && (
          <Text className='slider-caption'>{curContent}</Text>
        )}
      </View>
    )
  }
}
