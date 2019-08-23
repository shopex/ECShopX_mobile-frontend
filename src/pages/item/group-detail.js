import Taro, { Component } from '@tarojs/taro'
import { View} from '@tarojs/components'
import { classNames, log, isNumber } from '@/utils'
import api from '@/api'
import './group-detail.scss'

export default class GroupDetail extends Component {
  static config = {
    navigationBarTitleText: '拼团详情'
  }

	constructor (props) {
		super(props)
		this.state = {
			isSelf: false,
			detail: null,
			isLeader: false,
			timer:null
		}
	}
	
	componentDidMount(){
		this.fetchDetail()
	}

  async fetchDetail() {
		const {group_id} = this.$router.params
		const params = {distributor_id:Taro.getStorageSync('trackIdentity')|| ''}
		const detail = await api.group.groupDetail(group_id,params)
		const {activity_info,over_time:total_micro_second,team_info,member_list} = detail

		const userInfo = Taro.getStorageSync('userinfo')
		const user_id = userInfo && userInfo.userId || 0

		const isLeader = (user_id && (user_id == team_info.head_mid)) ? true :false

		const isSelf = (user_id && member_list.list.find(v=>v.member_id == user_id)) ? true:false

		let timer = null
		timer = this.calcTimer(total_micro_second)
		
		this.setState({
			timer,
			detail,
			isLeader,
			isSelf
		})
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

render () {
	const {detail,timer} = this.state

	return (
		<View>
			<View className={classNames('status-icon',{'success icon-over-group':detail && detail.team_info.team_status == 2,'fail icon-ungroup':detail && detail.team_info.team_status == 3})}></View>
      {detail.team_info.team_status == 1 && (
        <View className='activity-time  View-flex View-flex-middle'>离结束还有：
					<AtCountdown
						isShowDay
						day={timer.dd}
						hours={timer.hh}
						minutes={timer.mm}
						seconds={timer.ss}
					/>
        </View>
      )}
      <View className='content-padded-b'>
        <View className='group-goods'>
          <View className='View-flex'>
            <image className='goods-img' src={detail.activity_info.pics[0]} mode='aspectFill' />
            <View className='View-flex-item View-flex View-flex-vertical View-flex-justify content-padded'>
              <View>
                <View className='goods-title'>{detail.activity_info.itemName}</View>
                {
                  detail.activity_info && (
                    <View className='price-label'><text className='num'>{detail.activity_info.person_num}</text><text className='label'>人团</text></View>
                    )
                }
              </View>
              {
                detail.activity_info && (
                  <View className='activity-amount'><text className='cur'>￥</text>{detail.activity_info.act_price/100}<text className='activity-market-price text-overline'>{detail.activity_info.price/100}</text></View>
                )
              }
            </View>
          </View>
        </View>
      </View>
      <View className='content-padded content-center'>
        {detail.team_info.team_status == 1 && ( <View>还差<text className='group-num'>{detail.activity_info.person_num - detail.team_info.join_person_num}</text>人拼团成功</View>)}
        {detail.team_info.team_status == 2 && (<View>团长人气爆棚，已经拼团成功啦</View>)}
        {detail.team_info.team_status == 3 && (<View>团长人气不足，拼团失败</View>)}
        
        <View className='group-member View-flex View-flex-center View-flex-wrap'>
          
        </View> 
      </View>
      <View className='content-padded-b'>
        {
          detail.team_info.team_status == 1 ? 
          <View>
            {
              (!isLeader && !isSelf) && (
                <View>
                  <form report-submit bindsubmit='formSubmit'>
                    <button className='btn-submit' form-type='submit'>我要参团</button>
                  </form>
                </View>
              )
            }
            {isLeader && (<button className='btn-submit' open-type='share'>邀请好友参团</button>)}
            {(!isLeader && isSelf) && (<button className='btn-submit' onClick='toOpen'>我也要开团</button>)}
          </View>
          : 
          <View>
            <View className='content-bottom-padded-b'>
              {!isLeader ? (<button className='btn-submit' onClick='toOpen'>我也要开团</button>) : (<button className='btn-submit' onClick='toOpen'>重新开团</button>)}
            </View>
            <button className='btn-default' onClick='toHome'>更多活动爆品</button>
          </View>
        }
      </View>
      {!isLeader ? (<View className='text-muted content-center'>将小程序分享到群里，将大大提高成团成功率</View>) : (<View className='text-muted content-center'>拼团玩法：好友参团，成团发货，不成团退款</View>)}   
    
		</View>
		)
	}
}