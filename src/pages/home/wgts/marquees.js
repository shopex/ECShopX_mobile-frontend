import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'

import './marquees.scss'

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

  handleClickItem = (id) => {
    try {
      Taro.navigateTo({
        url: `/pages/recommend/detail?id=${id}`
      })
    } catch (error) {
      console.log(error)
    }
  }

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
            ? <Swiper
                  className='marquees'
                  autoplay
                  circular
                  interval={3000}
                  duration={300}
                  vertical={config.direction}
                  style={`background-color:${config.bgcolor}`}
                >
                  {data.map((item, idx) => {
                    return (
                      <SwiperItem
                        key={idx}
                        className='marquees-item'
                      >
                        <View
                          onClick={this.handleClickItem.bind(this, item.id)}
                          style={`color:${config.fontcolor}`}
                        >
                          {item.title}
                        </View>
                      </SwiperItem>
                    )
                  })}
                </Swiper>
            : null
        }
      </View>
    )
  }
}
