import Taro, { useRouter } from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import { useState, useRef } from 'react'
import { MNavBar, MCell } from './comps'
import { SpSearchBar, SpPage, SpScrollView, SpImage } from '@/components'
import api from '@/api'
import { usePage, useDepChange } from '@/hooks'
import { useSelector, useDispatch } from 'react-redux'
import { MERCHANT_TYPE, BUSINESS_SCOPE } from './consts'
import { useImmer } from 'use-immer'
import { setMerchant } from './util'
import './selector.scss'

const initialState = {
  list: [],
  name: ''
}

const Selector = () => {
  const [state, setState] = useImmer(initialState)
  const selectsRef = useRef()
  const {
    params: { type, parent_id }
  } = useRouter()
  const fetch = async ({ pageIndex: page, pageSize }) => {
    const params = {
      page,
      page_size: pageSize,
      parent_id: type === MERCHANT_TYPE ? 0 : parent_id,
      name: state.name
    }
    const { list, total_count } = await api.merchant.typeList(params)

    await setState((v) => {
      v.list = [...v.list, ...list]
    })

    return {
      total: total_count
    }
  }

  //点击搜索框搜索
  const handleConfirm = async (val) => {
    await setState((v) => {
      v.list = []
      v.name = val
    })
    selectsRef.current.reset()
  }

  const handleClick = ({ id, name, parent_id }) => {
    setMerchant({ key: type, id, name, parent_id })
    Taro.navigateBack()
  }

  const handleSearchOff = () => {
    setState((v) => {
      v.name = ''
    })
  }

  const handleOnClear = async () => {
    await setState((v) => {
      v.name = ''
      v.list = []
    })
    selectsRef.current.reset()
  }

  const handleOnChange = async (val) => {
    await setState((v) => {
      v.name = val
    })
  }

  const handleBlur = () => {
    setState((v) => {
      v.name = ''
    })
  }

  const renderEmpty = (
    <View className='render-empty'>
      <SpImage src='empty_goods.png' />
      <View className='title'>暂无可选项～</View>
    </View>
  )
  const { list, name } = state

  console.log('name', name)

  return (
    <SpPage className='page-merchant-selector' needNavbar={false}>
      <MNavBar canLogout={false} />

      <View className='page-merchant-selector-inputwrapper'>
        <SpSearchBar
          keyword={name}
          className='sp-page-selector-input'
          placeholder='请输入商家类型'
          onConfirm={handleConfirm}
          onCancel={handleSearchOff}
          onClear={handleOnClear}
          onChange={handleOnChange}
          onBlur={handleBlur}
        />
      </View>

      <SpScrollView
        scrollY
        fetch={fetch}
        className='selector-scroll'
        ref={selectsRef}
        renderEmpty={renderEmpty}
      >
        <View className='page-merchant-selector-content'>
          <View className='card'>
            {list.map((item, index) => (
              <MCell key={index} title={item.name} noselect onClick={() => handleClick(item)} />
            ))}
          </View>
        </View>
      </SpScrollView>
    </SpPage>
  )
}

export default Selector
