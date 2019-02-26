import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtNavBar, AtButton } from 'taro-ui'
import { GoodsItem, SpCheckbox } from '@/components'
import api from '@/api'
import { classNames } from '@/utils'
import S from '@/spx'

import './favorite.scss'

export default class MemberFavorite extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      ...this.state,
      list: [],
      selection: new Set(),
      mode: 'default'
    }
  }

  componentDidMount () {
    this.fetch()
  }

  componentWillUnmount () {
  }

  async fetch () {
    const { list } = await api.member.favoriteItems()
    list.forEach(item => {
      item.price = item.goods_price
      item.title = item.goods_name
    })
    this.setState({ list })
  }

  toggleMode (mode) {
    if (mode === undefined) {
      mode = this.state.mode !== 'edit' ? 'edit' : 'default'
    }
    this.setState({
      mode
    })
  }

  handleSelectionChange (item_id, checked) {
    this.state.selection[checked ? 'add' : 'delete'](item_id)
    const selection = new Set(this.state.selection)

    this.setState({
      selection
    })
  }

  handleGoBack = () => {
    this.toggleMode('default')
    Taro.navigateBack()
  }

  handleDelect = () => {
    const { selection } = this.state

    const items = [...selection]
    if (items.length <= 0) {
      return S.toast('请选择要删除的内容')
    }

    console.log(items)
  }

  render () {
    const { list, mode, selection } = this.state
    const totalSelection = selection.size

    return (
      <View className={classNames('member-favorite', mode === 'edit' ? 'member-favorite__edit' : null)}>
        <AtNavBar
          fixed
          leftIconType='chevron-left'
          rightFirstIconType='bullet-list'
          title='我的收藏'
          onClickLeftIcon={this.handleGoBack}
          onClickRgIconSt={() => this.toggleMode()}
        />
        <ScrollView
          className='favorite-items__scroll'
          scrollY
        >
          {list.map(item => {
            return (
              <GoodsItem
                key={item.item_id}
                info={item}
                onClick={this.onClickItem}
              >
                {mode == 'edit' && <SpCheckbox
                  key={item.item_id}
                  checked={selection.has(item.item_id)}
                  onChange={this.handleSelectionChange.bind(this, item.item_id)}
                />}
              </GoodsItem>
            )
          })}
        </ScrollView>
        <View className='toolbar'>
          <View className='toolbar-hd'>
            <Text>已选择<Text className='lnk'>{totalSelection}</Text>项内容</Text>
          </View>
          <View className='toolbar-bd'>
            <AtButton
              circle
              type='primary'
              className='btn-checkout'
              onClick={this.handleDelect}
            >删除</AtButton>
          </View>
        </View>
      </View>
    )
  }
}
