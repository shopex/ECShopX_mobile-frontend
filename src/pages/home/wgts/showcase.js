import React, { Component } from 'react';
import { View, Text } from '@tarojs/components'
import { SpImg } from '@/components'
import { navigateTo, linkPage, classNames } from "@/utils";
import './showcase.scss'

export default class WgtShowCase extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null
  }

  navigateTo = navigateTo

  handleClickItem = linkPage

  render() {
    const { info } = this.props
    if (!info) {
      return null
    }

    const { base, data, config } = info

    return (
      <View
        className={classNames("wgt wgt-showcase", {
          wgt__padded: base.padded,
        })}
      >
        {base.title && (
          <View className="wgt-head">
            <View className="wgt-hd">
              <Text className="wgt-title">{base.title}</Text>
              <Text className="wgt-subtitle">{base.subtitle}</Text>
            </View>
          </View>
        )}
        <View className={`showcase-scheme-${config.style}`}>
          <View className="scheme-item">
            <View
              className="layout layout-1"
              onClick={this.handleClickItem.bind(this, data[0])}
            >
              <SpImg
                img-class="show-img"
                src={data[0].imgUrl}
                mode="scaleToFill"
                width="375"
                lazyLoad
              />
            </View>
          </View>
          <View className="scheme-item">
            <View
              className="layout layout-2"
              onClick={this.handleClickItem.bind(this, data[1])}
            >
              <SpImg
                img-class="show-img"
                src={data[1].imgUrl}
                mode="scaleToFill"
                width="375"
                lazyLoad
              />
            </View>
            <View
              className="layout layout-3"
              onClick={this.handleClickItem.bind(this, data[2])}
            >
              <SpImg
                img-class="show-img"
                src={data[2].imgUrl}
                mode="scaleToFill"
                width="375"
                lazyLoad
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
