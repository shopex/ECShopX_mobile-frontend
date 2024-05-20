import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { Text, View, ScrollView } from '@tarojs/components'
import { classNames, validate, showToast } from '@/utils'
import { SpImage, SpPage, SpTime, SpTabs } from '@/components'
import { useImmer } from 'use-immer'
import api from '@/api'
import S from '@/spx'
import CompCustomPicker from './comps/comp-custom-picker'
import CompTable from './comps/comp-table'
import './achievement.scss'

const initialConfigState = {
  list: [],
  tabList: [{ title: '全部' }, { title: '直推业绩' }, { title: '间推业绩' }],
  types: false,
  listData: [
    { rt: '111', ry: '222', tr: '44' },
    { rt: '22', ry: '33', tr: '55' },
    { rt: '77', tr: '55' }
  ],
  listHeader: [
    { title: '时间', id: 'rt' },
    { title: '业务员', id: 'ry' },
    { title: '销售额（元）', width: '120px', id: 'tr' },
    { title: '订单数', id: 'tr' },
    { title: '新增顾客', id: 'tr' },
    { title: '销售业绩（元）', width: '120px', id: 'tr' },
  ]
}

const Achievement = () => {
  const [state, setState] = useImmer(initialConfigState)
  const { list, tabList, types, listData, listHeader } = state

  const onTimeChange = (time) => {
    console.log(time)
  }

  const cancel = (index, val) => {
    console.log(index, val, 'cancel')
  }

  return (
    <SpPage className='page-achievement'>
      <View className='page-achievement-statistics'>
        <Text className='iconfont icon-tongji'></Text>
        <Text className='title'>业务员业绩统计</Text>
      </View>
      <View className='page-achievement-list'>
        <View className='page-achievement-list-picker'>
          <SpTime onTimeChange={onTimeChange} />
          <CompCustomPicker cancel={cancel} />
        </View>
        <SpTabs
          current={types}
          tablist={tabList}
          onChange={(e) => {
            setState((draft) => {
              draft.types = e
            })
          }}
        />

        <CompTable listData={listData} listHeader={listHeader} />
      </View>
    </SpPage>
  )
}

export default Achievement
