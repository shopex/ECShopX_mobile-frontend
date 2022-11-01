import React, { useEffect, useRef, useContext } from 'react'
import { useSelector } from 'react-redux'
import { useImmer } from 'use-immer'
import Taro from '@tarojs/taro'
import api from '@/api'
import doc from '@/doc'
import { View, Text } from '@tarojs/components'
import { validate } from '@/utils'
import { Context } from './../sp-form/context'
import './index.scss'

const initialState = {
  message: ''
}
function SpFormItem(props) {
  const { label, prop, children } = props
  const [state, setState] = useImmer(initialState)
  const { message } = state
  const value = useRef()

  const { formData, rules, addFields } = useContext(Context)
  const rule = rules[prop]
  //   console.log('SpFormItem:', formData, label)
  value.current = formData[prop]

  useEffect(() => {
    addFields(validateItem)
  }, [])

  const validateItem = () => {
    let validateResult
    try {
      rule.forEach((item) => {
        if (item.required) {
          if (!validate.isRequired(value.current)) {
            throw item.message
          }
        } else if (item?.validate == 'mobile') {
          if (!validate.isMobileNum(value.current)) {
            throw item.message
          }
        }
      })
      setState((draft) => {
        draft.message = ''
      })
      validateResult = true
    } catch (e) {
      setState((draft) => {
        draft.message = e
      })
      validateResult = false
    }

    return validateResult
    // console.log('validate:', label, formData[prop], value.current)
  }

  // const isRequired = rule.find((item) => item.required)

  return (
    <View className='sp-form-item'>
      {label && (
        <View className='form-item-label'>
          {rule.length > 0 && <Text className='required'>*</Text>}
          <Text className='label'>{label}</Text>
        </View>
      )}
      <View className='form-item-control'>{children}</View>
      <View className='form-item-message'>{message}</View>
    </View>
  )
}

SpFormItem.options = {
  addGlobalClass: true
}

export default SpFormItem
