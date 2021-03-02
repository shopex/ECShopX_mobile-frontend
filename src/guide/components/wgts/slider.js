import Taro, { PureComponent } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { classNames, styleNames,previewImgVideo } from '@/utils'
import api from '@/api'
import { linkPage } from './helper'
import './slider.scss'

export default class WgtSlider extends PureComponent {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    autoPlay: true
  }

  constructor(props) {
    super(props)

    this.state = {
      curIdx: 0,
      imgHeight:null
     
    }
  }
  componentWillMount(){
    
     const {  info:{data} } = this.props
      Taro.getImageInfo({
        src: data[0].imgUrl,
      }).then(res => {
        let width=res.width
        let height=res.height
        let ratio=width/height
        let imgHeight=+(Taro.$systemSize.screenWidth/ratio).toFixed(2)
        this.setState({
           imgHeight
        })
    })
  }
  

  handleClickItem = async (item,index) => {
    
    if(item.linkPage){
      linkPage(item.linkPage, item.id, item)
    }else{
      const {info:{data}}=this.props
      let bannerImg=data.map((p_item)=>{
        let p_obj={
          filet:'image',
          url:p_item.imgUrl
        }
        return p_obj
      })
      previewImgVideo(bannerImg,index)

    }
}

  handleSwiperChange = (e) => {
    const { current } = e.detail

    this.setState({
      curIdx: current
    })
  }


  render() {
    const { info, autoPlay} = this.props
    const { curIdx,imgHeight} = this.state

   
    if (!(info&&(imgHeight||info.config.imgHeight))) {
      return null
    }
    const { config, base, data } = info
    const curContent = (data[curIdx] || {}).content
    let sliderImgHeight=imgHeight||config.imgHeight
   

    // 'height':`${sliderImgHeight}px`,
  return (
  <View style={styleNames({'position': 'relative', 'top': `${Number(config.top) ? -(Number(config.top)) : 0}px` })}>
    <View className={`wgt ${base.padded ? 'wgt__padded' : null} slidepostion`} style={styleNames({'background-image': 'url(' + config.bgimgUrl + ')', 'background-size': 'contain', 'padding': `${config.bgpadding?(`${config.bgpadding.toppadding||0}px ${config.bgpadding.rightpadding||0}px ${config.bgpadding.bottompadding||0}px ${config.bgpadding.leftpadding||0}px`):'0px'}` })}>
      {base.title && (
        <View className='wgt__header'>
          <View className='wgt__title'>{base.title}</View>
          <View className='wgt__subtitle'>{base.subtitle}</View>
          <Text className={classNames('wgt__header__more', Taro.$system === 'iOS' ? 'wgt__header__iosmore' : '')}> > </Text>
        </View>
      )}
      {/* style={styleNames({'height':`${imgHeight}px`})} */}
      {
        config
          ? <View className={`slider-wrap ${config.padded ? 'padded' : ''}`} style={styleNames({'height':`${sliderImgHeight}px`})}>
            {/* <Image
              mode='widthFix'
              className={classNames('slider-item__img plus-hidden__img', config.type === 'type2' ? 'type2-img' : config.type === 'type3'?'type3-img':'')}
             
              src={data[0].imgUrl}

            /> */}
            {/* plus_img */}

            {(config.type === 'type1'||!config.type) && <Swiper
              className='slider-img'
              circular
              autoplay={autoPlay}
              current={curIdx}
              interval={config.interval}
              duration={400}
              style={styleNames({'height':`${sliderImgHeight}px`})}
              onChange={this.handleSwiperChange}
            >
              {data.map((item, index) => {
                return (
                  <SwiperItem
                    key='id'
                    className={`slider-item ${config.rounded ? 'rounded' : null}`}
                   
                  >
                    <View
                      style={`height:${imgHeight}px;padding: 0 ${config.padded ? Taro.pxTransform(20) : 0}`}
                      onClick={this.handleClickItem.bind(this, item,index)}
                      
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
            </Swiper>}
            {data.length > 1 && config.dot && (
              <View className={classNames('slider-dot', { 'dot-size-switch': config.animation }, config.dotLocation, config.dotCover ? 'cover' : 'no-cover', config.shape)}>
                {data.map((dot, dotIdx) =>
                  <View
                    className={classNames('dot', { active: curIdx === dotIdx })}
                    style={styleNames({ 'background-color': curIdx === dotIdx ? config.activedotColor : config.dotColor })}
                    key='id'
                  > </View>
                )}
              </View>
            )}

            {data.length > 1 && !config.dot && (
              <View
                className={classNames('slider-count', config.dotLocation, config.shape, config.dotColor)}
                style={styleNames({ 'background-color': config.dotColor })}
              >
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
  </View>
     

    )
  }
}
