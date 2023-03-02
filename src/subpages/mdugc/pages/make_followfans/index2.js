import React, { useEffect, useRef, useCallback } from 'react'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import S from '@/spx'
import { connect } from 'react-redux'
import { SpNote, BackToTop, Loading, SpPage, SpScrollView } from '@/components'
import { FilterBar } from '../../components'
import { pickBy } from '@/utils'
import { useImmer } from 'use-immer'
import { useSelector, useDispatch } from 'react-redux'

import api from '@/api'
//import '../../font/iconfont.scss'
import './index2.scss'

const initialState = {
  list: [],
  val: '', //搜索框
  type: '',
  curTagId: 0,
  tab: [
    {
      title: '关注',
      t_id: 0
    },
    {
      title: '粉丝',
      t_id: 1
    }
  ],
  list1: [
    {
      headimgurl:
        'https://bbc-espier-images.amorepacific.com.cn/image/2/2023/02/27/8cb6a339f27aeaeb02669173e9a68fdeHe4tKEonZIuygGC8ZSSCWXdGJXJKeywv',
      nickname: '123'
    },
    {
      headimgurl:
        'https://bbc-espier-images.amorepacific.com.cn/image/2/2023/02/27/8cb6a339f27aeaeb02669173e9a68fdeHe4tKEonZIuygGC8ZSSCWXdGJXJKeywv',
      nickname: '456'
    }
  ]
}

function make_followfans(props) {
  const [state, setState] = useImmer(initialState)
  const memberData = useSelector(({ member }) => member.member)
  const router = useRouter()
  const listRef = useRef()

  useEffect(() => {
    const { type } = getCurrentInstance().router.params
    let id = type === 'user' ? 1 : 0
    // Taro.setNavigationBarTitle({
    //   title
    // })
    setState((draft) => {
      draft.type = type
      draft.curTagId = id
    })
  }, [])

  // 列表
  const fetch = async ({ page_no = 1, page_size = 10 }) => {
    const { user_id } = getCurrentInstance().router.params
    let type = state.type === '' ? getCurrentInstance().router.params?.type : state.type

    const params = {
      page_no,
      page_size,
      user_id,
      user_type: type
    }
    console.log(6, params, state)
    const { list, total_count: total } = await api.mdugc.followerlist(params)
    console.log('list, total', list, total)

    setState(
      (draft) => {
        draft.list = [...state.list, ...list]
      },
      () => {
        Taro.stopPullDownRefresh()
      }
    )

    return { total }
  }

  const handleTagChange = useCallback(async (i) => {
    listRef?.current?.reset()
    await setState((draft) => {
      ;(draft.list = []), (draft.curTagId = i), (draft.type = i ? 'user' : 'follower')
    })
    // await fetch()
  })

  // 关注|取消关注
  const followercreate = async (i) => {
    let { list } = state
    let item = list[i]
    let data = {
      user_id: item.user_id,
      follower_user_id: memberData.memberInfo.user_id
    }
    let res = await api.mdugc.followercreate(data)
    if (res.action == 'unfollow') {
      // 取消关注
      item.mutal_follow = 0
      Taro.showToast({
        icon: 'none',
        title: '取消关注'
      })
    } else if (res.action == 'follow') {
      // 关注
      item.mutal_follow = 1
      Taro.showToast({
        icon: 'none',
        title: '关注成功'
      })
    }
    list[i] = item
    setState((draft) => {
      draft.list = list
    })
  }
  const topages = (url) => {
    console.log('url', url)
    Taro.navigateTo({ url })
  }
  // 下拉刷新
  const onPullDownRefresh = () => {
    console.log('下拉')
    Taro.startPullDownRefresh()
    // this.resetPage()
    this.setState((draft) => {
      draft.list = []
    })
  }

  const { curTagId, tab, list1,type } = state

  return (
    <View className='follow'>
      <FilterBar current={curTagId} tab={tab} onTabClick={handleTagChange.bind(this)} />
      <SpPage scrollToTopBtn isDefault={false} defaultMsg='暂无更新～'>
        <SpScrollView className='ugcmember_b_list__scroll' auto={true} ref={listRef} fetch={fetch}>
          <View className='follow_list'>
            <View className='follow_list__scroll_scrolls'>
              {list1.map((item, i) => {
                return (
                  <View className='follow_list__scroll_scrolls_item' key={i}>
                    <View
                      className='follow_list__scroll_scrolls_item_l'
                      onClick={topages.bind(
                        this,
                        `/mdugc/pages/member/index?user_id=${item.user_id}`
                      )}
                    >
                      <Image
                        className='follow_list__scroll_scrolls_item_l_img'
                        mode='aspectFill'
                        src={item.headimgurl}
                      />
                    </View>
                    <View className='follow_list__scroll_scrolls_item_cen'>
                      <View className='follow_list__scroll_scrolls_item_cen_title'>
                        {item.nickname}
                      </View>
                    </View>
                    {type == 'follower' ? (
                      <View
                        onClick={followercreate.bind(this, i)}
                        className='follow_list__scroll_scrolls_item_r'
                      >
                        已关注
                      </View>
                    ) : (
                      <View
                        className='follow_list__scroll_scrolls_item_r active'
                        onClick={followercreate.bind(this, i)}
                      >
                        +关注
                      </View>
                    )}
                    {/* {item.mutal_follow == 0 ? (
                      type == 'user' ? (
                        <View
                          onClick={this.followercreate.bind(this, i)}
                          className='follow_list__scroll_scrolls_item_r'
                        >
                          回粉
                        </View>
                      ) : (
                        <View className='follow_list__scroll_scrolls_item_r active'>已关注</View>
                      )
                    ) : (
                      <View className='follow_list__scroll_scrolls_item_r active'>互相关注</View>
                    )} */}
                  </View>
                )
              })}
            </View>
          </View>
        </SpScrollView>
      </SpPage>
    </View>
  )
}

export default make_followfans
