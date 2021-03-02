import Taro, { PureComponent } from '@tarojs/taro'
import { View, Video } from '@tarojs/components'
import { styleNames } from '@/utils'
import { connect } from '@tarojs/redux'
import { linkPage } from './helper'

import './film.scss'
@connect(({home }) => ({
  isShowPopupTempalte:home.isShowPopupTempalte
}), (dispatch) => ({
 
 
}))
export default class WgtFilm extends PureComponent {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    controls:true,
    onFullscreenChange: () => {}
  }

  state = {
    screenWidth: null,
    autoplay:false
  }

  componentDidMount () {
    const res = Taro.getSystemInfoSync()
    this.setState({
      screenWidth: res.screenWidth
    })
    let videoContext = Taro.createVideoContext('myVideo',this)
    const {info}=this.props
    if(info.config&&info.config.autoplay){
      videoContext.play()
    }
   
  }
  componentWillUnmount(){
    let videoContext = Taro.createVideoContext('myVideo',this)
    const {info}=this.props
    if(info.config&&info.config.autoplay){
      videoContext.pause()
    }
  }
  componentWillReceiveProps(nextProps){
    if(this.props.isShowPopupTempalte){
      let videoContext = Taro.createVideoContext('myVideo',this)
      const {info}=this.props
    
      if(info.config&&info.config.autoplay){
        videoContext.play()
      }
    }
  }

  


  handleClickItem = linkPage

  resolveSize ({ width, height, ratio: tRatio } = {}, screenWidth) {
   
    let ratio = 16 / 9
    let w = '100%', h
    let objectFit = 'contain'
    const defaultHeight = Math.round(screenWidth / ratio)
      
    if (width && height) {
      ratio = width / height
      if (ratio <= 10 / 16) {
        h = defaultHeight
      } else {
        objectFit = 'cover'
        h = Math.round(screenWidth / ratio)
      }
    } else {
      h = defaultHeight
    }

    if (tRatio === 'square') {
      // 1:1
      objectFit = 'cover'
      h = screenWidth
    } else if (tRatio === 'rectangle') {
      
      // 16:9
      objectFit ='contain'
      h = defaultHeight
      
    }else if(tRatio === 'fullscreen'){
      objectFit ='fill'
      h=100
    }
   
    return {
      width: w,
      height: tRatio === 'fullscreen'?'100vh':`${h}px`,
      objectFit
    }
  }

  /**
   * 当开始/继续播放时触发 play 事件
   */
  onPlayVideo(e){
    
   
  }

  handleClick=(e)=>{
    e.stopPropagation()
  }

  render () {
    const { info,controls } = this.props
    const { screenWidth,autoplay } = this.state

    if (!info) {
      return null
    }

    const { config, base, data } = info
    const { width, height,objectFit } = this.resolveSize(config, screenWidth)

    return (
      <View className={`wgt wgt-film ${base.padded ? 'wgt__padded' : null}`} onClick={this.handleClick}>
        {base.title && (
          <View className='wgts__header'>
            <View className='wgts__title'>{base.title}</View>
            <View className='wgts__subtitle'>{base.subtitle}</View>
          </View>
        )}
        <View
          className={`wgts-wrap ${config.padded ? 'padded' : ''}`}
          style={styleNames({ height })}
        >
          <Video
            initial-time='0.01'
            className='flim-video'
            id='myVideo'
            object-fit={objectFit}
            src={data[0].url}
            style={styleNames({ width, height })}
            onFullscreenChange={this.props.onFullscreenChange}
            controls={controls}
            autoplay={config.autoplay||false}
            onPlay={this.onPlayVideo.bind(this)}
           
          />
        </View>
      </View>
    )
  }
}
