import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, ScrollView } from '@tarojs/components'
import { SpPage } from '@/components'
import { isWeb } from '@/utils'
import './point-rule.scss'

const initialState = {
  content: ''
}
function PointRule(props) {
  const [state, setState] = useImmer(initialState)
  const { content } = state

  useEffect(() => {
    fetchPointRules()
  }, [])

  const fetchPointRules = async () => {
    const { rule_desc } = await api.pointitem.getPointSetting()
    setState((draft) => {
      draft.content = rule_desc
    })
  }

  const _content = content
    .replace(/\s+style="[^"]*"/g, '')
    .replace(/<img/g, '<img style="width:100%;height:auto;display: block;"')
  console.log('content:', _content)
  return (
    <SpPage className='page-point-rule'>
      <ScrollView className="point-scroll-view" scrollY>
        {isWeb && <View dangerouslySetInnerHTML={{ __html: _content }} />}
        {!isWeb && <mp-html content={_content} />}
      </ScrollView>
    </SpPage>
  )
}

PointRule.options = {
  addGlobalClass: true
}

export default PointRule
