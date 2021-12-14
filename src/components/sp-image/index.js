import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { classNames, styleNames } from '@/utils'
import './index.scss'

function SpImage(props) {
  const {
    src,
    className,
    mode = 'widthFix',
    width = 'auto',
    onError = () => {},
    onLoad = () => {},
    lazyLoad = () => {}
  } = props
  const imgUrl = /^http/.test(src) ? src : `${process.env.APP_IMAGE_CDN}/${src}`
  return (
    <View
      className={classNames(
        {
          'sp-image': true
        },
        className
      )}
      style={styleNames({
        width: width == 'auto' ? 'auto' : `${width / 2}px`
      })}
    >
      <Image
        className='sp-image-img'
        src={imgUrl}
        mode={mode}
        // onError={onError}
        // onLoad={onLoad}
        // lazyLoad={lazyLoad}
      />
    </View>
  )
}

SpImage.options = {
  addGlobalClass: true
}

export default SpImage
