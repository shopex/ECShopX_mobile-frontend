import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, ScrollView } from '@tarojs/components'
import { SpPage } from '@/components'
import { isWeb } from '@/utils'
import './chief-licence.scss'

const initialState = {
  content: ''
}
function PointRule(props) {
  const [state, setState] = useImmer(initialState)
  const $instance = getCurrentInstance()
  const { content } = state

  useEffect(() => {
    aggrementAndExplanation()
  }, [])

  const aggrementAndExplanation = async () => {
    const { distributor_id } = $instance.router.params
    const { aggrement } = await api.community.aggrementAndExplanation({ distributor_id })
    setState(draft => {
      draft.content = aggrement
    })
  }

  const _content = content
    .replace(/\s+style="[^"]*"/g, '')
    .replace(/<img/g, '<img style="width:100%;height:auto;display: block;"')
  console.log('content:', _content)
  return (
    <SpPage className='page-community-chief-licence'>
      <ScrollView className="scroll-view" scrollY>
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
