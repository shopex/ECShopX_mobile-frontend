import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import { AtCountdown } from "taro-ui"
import { debounce } from '@/utils'
import api from '@/api'
import LoadingMore from '@/boost/component/loadingMore'
// src/boost/pages/order/index.js
// src/pages/liveroom/index.js
import './index.scss'

export default class LiveRoomList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scrollTop: 0,
      isRefresh: false,
      liveRoomList: [],
      isEnd: false,
      isLoading: false,
      isEmpty: false,
      param: {
        page: 1,
        pageSize: 5
      }
    }
  }

  componentDidMount () {
    this.getList()
  }

  calcTimer (totalSec) {
    let remainingSec = totalSec
    const dd = Math.floor(totalSec / 24 / 3600)
    remainingSec -= dd * 3600 * 24
    const hh = Math.floor(remainingSec / 3600)
    remainingSec -= hh * 3600
    const mm = Math.floor(remainingSec / 60)
    remainingSec -= mm * 60
    const ss = Math.floor(remainingSec)

    return {
			dd,
			hh,
      mm,
      ss
    }
  }

  getList = async (isRefrsh = false) => {
    const { param, liveRoomList } = this.state
    isRefrsh && Taro.showLoading({title: '正在加载...', mask: true})
    await api.liveroom.getLiveRoomList({ page: param.page, page_size: param.pageSize }).then(res => {
      const { list, total_count } = res
      const isEnd = param.page >= (total_count / param.pageSize)
      console.log(list, isRefrsh)
      this.setState({
        liveRoomList: isRefrsh ? list : [...liveRoomList, ...list],
        isRefresh: false,
        isLoading: false,
        isEnd,
        isEmpty: list.length <= 0
      })
      isRefrsh && Taro.hideLoading()
    })
  }

  // 滚动事件
  onScroll = debounce((e) => {
    const { scrollTop } = e.detail
    this.setState({
      scrollTop
    })
  }, 1000)

  // 下拉刷新
  handleRefresh = () => {
    const { param } = this.state
    param.page = 1
    this.setState({
      isRefresh: true,
      param
    })
    this.getList(true)
  }

  // 上拉加载
  handleLoadMore = () => {
    const { isLoading, isEnd, param, isEmpty } = this.state
    if (isEnd || isLoading || isEmpty) return
    this.setState({
      param: {
        page: ++param.page,
        pageSize: param.pageSize
      },
      isLoading: true
    })
    this.getList()
  }

  getTime = (second, getDateType) => {
    var date = new Date(second)
    if (getDateType == 0) {
      return date.getFullYear()
    } else if (getDateType == 1) {
      if ((date.getMonth() + 1) <= 9) {
        return '0' + (date.getMonth() + 1)
      } else {
        return date.getMonth()+1
      }
    } else if (getDateType == 2) {
      if (date.getDate() <= 9) {
        return '0' + date.getDate()
      } else {
        return date.getDate()
      }
    } else if (getDateType == 3) {
      if (date.getHours() <= 9) {
        return '0' + date.getHours()
      } else {
        return date.getHours()
      }
    } else if (getDateType==4) {
      if (date.getMinutes() <= 9) {
        return '0' + date.getMinutes()
      } else {
        return date.getMinutes()
      }
    } else if (getDateType==5) {
      return date.getSeconds()
    } else {
      alert('输入时间格式有误!')
      return
    }
  }

  onLocation = (item) => {
    if ((item.live_status === 103 && item.close_replay === 0) || item.live_status === 101) {
      Taro.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomid}`
      })
    } else {
      return
    }
  }

  render () {
    const { liveRoomList, scrollTop, isRefresh, isEnd, isLoading, isEmpty } = this.state
    return (
      <ScrollView
        className='liveroom-page'
        scrollY
        scroll-anchoring
        refresherEnabled
        scrollWithAnimation
        scrollTop={scrollTop}
        onScroll={this.onScroll}
        refresherTriggered={isRefresh}
        onRefresherRefresh={this.handleRefresh}
        onScrollToLower={this.handleLoadMore}
      >
        {
          liveRoomList.map(item => (
            <View style={{ position: 'relative' }} onClick={this.onLocation.bind(this, item)} key={item.roomid}>
            {/* <Navigator
              hover-class='none'
              style={{ position: 'relative' }}
              key={item.roomid}
              url={`plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${item.roomid}`}
            > */}
            <Image className='liveroom-page-bck' mode='aspectFit' src={item.cover_img}></Image>
            <View className='liveroom-page-title'>{item.name}</View>
            {
              item.live_status == 101 &&
              <View className='liveroom-page-state'>
                <View className='live'>直播</View>
                <View className='content'>正在直播中</View>
              </View>
            }
            {
              item.live_status == 102 &&
              <View className='liveroom-page-state'>
                <View className='live notice'>预告</View>
                <View className='content'>
                  <AtCountdown
                    isShowDay
                    format={{ day: '天', hours: '时', minutes: '分', seconds: '' }}
                    day={this.calcTimer(1632476044).dd}
                    hours={this.calcTimer(1632476044).hh}
                    minutes={this.calcTimer(1632476044).mm}
                    seconds={this.calcTimer(1632476044).ss}
                  />
                </View>
              </View>
            }
            {
              (item.live_status == 103) &&
              <View className='liveroom-page-state'>
                <View className='live return'>回放</View>
                <View className='content'>{item.live_time_text}</View>
              </View>
            }
          </View>
        ))
      }
      {/* 加载更多 */}
      <LoadingMore isLoading={isLoading} isEnd={isEnd} isEmpty={isEmpty} />
      {/* 防止子内容无法支撑scroll-view下拉刷新 */}
      <View style='width:2rpx;height:2rpx;bottom:-2rpx;position:absolute;' />
    </ScrollView>
  )}
}
