import React, { useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Picker } from '@tarojs/components'
import api from '@/api'
import { SpImage, SpPage, SpCheckbox } from '@/components'
import { useImmer } from 'use-immer'
import { AtTag, AtList, AtListItem, AtTextarea, AtButton } from 'taro-ui'
import CompMedicationPersonnel from './comps/comp-medication-personnel'

import './prescription-information.scss'


const initialState = {
  notesList: [
    {
      title: '是否使用过此类药物',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'before_ai_result_used_medicine',
      value: null
    },
    {
      title: '肝肾功能是否有异常',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'before_ai_result_body_abnormal',
      value: null
    },
    {
      title: '用药人是否孕妇',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'is_pregnant_woman',
      value: null
    },
    {
      title: '用药人是否哺乳期',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'is_lactation',
      value: null
    }, {
      title: '是否有药物过敏史',
      selector: [{
        key: 0,
        value: '否'
      }, {
        key: 1,
        value: '是'
      }],
      selectorChecked: '请选择',
      key: 'before_ai_result_allergy_history',
      value: null
    }
  ],
  isOpened: false
}


function PrescriptionPnformation() {
  const [state, setState] = useImmer(initialState)

  const {
    notesList,
    isOpened
  } = state


  useEffect(() => {

  }, [])

  const handleClickToEdit = () => {
  }

  const pickerChange = (e, index) => {
    let notesList1 = JSON.parse(JSON.stringify(notesList))
    notesList1[index].selectorChecked = notesList1[index].selector[e.detail.value].value
    notesList1[index].value = notesList1[index].selector[e.detail.value].key
    setState(draft => {
      draft.notesList = notesList1
    })
  }

  const colsePersonnel = () => {
    setState(draft => {
      draft.isOpened = !isOpened
    })
  }

  return (
    <SpPage className='prescription-information'
      renderFooter={
        <View className='btn-wrap'>
          <AtButton circle type='primary' onClick={handleClickToEdit}>
            提交并开药
          </AtButton>
        </View>
      }
    >
      <View className='information'>
        <View className='title'>
          <Text className='title-num'>1</Text>
          <Text className='title-text'>填写信息</Text>
        </View>
        <View className='titled'>-----</View>
        <View className='titled'>
          <Text className='titled-num'>2</Text>
          <Text>医生开方</Text>
        </View>
        <View className='titled'>-----</View>
        <View className='titled'>
          <Text className='titled-num'>3</Text>
          <Text>支付订单</Text>
        </View>
      </View>

      <View className='prompt'>您的信息用于处方药购买，平台会严格保密，请放心填写</View>

      <View className='medication'>
        <View className='personnel'>
          <View className='personnel-title'>用药人</View>
          <View className='personnel-name' onClick={colsePersonnel}>
            <Text className='iconfont icon-bianji1'></Text>
            添加/修改
          </View>
        </View>
        <View className='prompt'>请选择实际用药人，医生可能会电话联系用药人了解病情</View>
        <ScrollView scrollX>
          <View className='relationship'>
            <View className='relationship-wrap'>
              <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
              <View className='relationship-wrap-right'>
                <View className='name'>陈鑫</View>
                <View className='age'>女 18</View>
              </View>
              <View className='label'>本人</View>
            </View>
            <View className='relationship-wrap'>
              <SpImage src={'https://img2.baidu.com/it/u=2288767807,3468141490&fm=253&fmt=auto&app=138&f=JPEG?w=579&h=500'} width={80} />
              <View className='relationship-wrap-right'>
                <View className='name'>陈鑫</View>
                <View className='age'>女 18</View>
              </View>
              <View className='label'>本人</View>
            </View>
          </View>
        </ScrollView>
        <View className='prompt'>* 用药人体重为50.0kg，如有变化请及时修改已便医生诊断</View>
      </View>

      <View className='medication1'>
        <View className='personnel'>
          <Text>请选择线下已确诊疾病</Text>
          <Text className='personnel-title'>（每个药品至少选择一种）</Text>
        </View>
        <View className='medicine'>
          <View className='medicine-top'>
            <SpImage src={'https://img1.baidu.com/it/u=2828841796,3433654732&fm=253&fmt=auto&app=120&f=JPEG'} width={90} />
            <View className='medicine-top-right'>就感觉可飒的哈电视观看拉屎的几个克拉的厚爱水电工i啊哥猴卡上就够啦结果哦评价狗啊就尬聊卡就是格林卡结果</View>
          </View>
          <View className='medicine-bot'>
            <AtTag type='primary' circle active className='medicine-bot-name'>标签</AtTag>
          </View>
        </View>
      </View>

      <View className='notes'>
        {
          notesList.map((item, index) => {
            return (
              <Picker mode='selector' range={item.selector} rangeKey='value' key={index} onChange={(e) => pickerChange(e, index)}>
                <AtList>
                  <AtListItem
                    title={item.title}
                    extraText={item.selectorChecked}
                  />
                </AtList>
              </Picker>
            )
          })
        }
        <View className='notes-textarea'>
          <Text className='allergy'>药物过敏说明：</Text>
          <AtTextarea
            value='oooooo'
            maxLength={200}
            placeholder='你的问题是...'
          />
        </View>
      </View>

      <View className='informed'>
        <SpCheckbox
          checked='true'
        // onChange={onChangePayment.bind(this, item)}
        // onChange={this.handleChange.bind(this)}
        />
        <View>
          确认已在线下就诊，使用过所购买药品且无过敏或不良反应，当前病情稳定
          ，确认监护人已知晓病情及购药行为。我已阅读并同意
          <Text className='informed-title'>
            《互联网诊疗风险告知及知情同意书》
          </Text>
        </View>
      </View>

      <CompMedicationPersonnel isOpened={isOpened} colsePersonnel={colsePersonnel} />

    </SpPage>
  )
}

export default PrescriptionPnformation
