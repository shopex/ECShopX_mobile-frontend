import Taro, { Component } from '@tarojs/taro'
import { View, Switch } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { SpCell } from '@/components'
import S from '@/spx'

import './edit.scss'

export default class AddressEdit extends Component {
  static options = {
    addGlobalClass: true
  }

  constructor (props) {
    super(props)

    this.state = {
      info: { ...this.props.value }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.state.info) {
      this.setState({
        info: { ...nextProps.value }
      })
    }
  }

  handleSubmit = (e) => {
    const { value } = e.detail
    const data = {
      ...this.state.info,
      ...value
    }

    if (!data.name) {
      return S.toast('请输入收件人')
    }

    if (!data.mobile || !/1\d{10}/.test(data.mobile)) {
      return S.toast('请输入正确的手机号')
    }

    if (!data.area) {
      return S.toast('请选择所在区域')
    }

    if (!data.addr) {
      return S.toast('请输入详细地址')
    }

    this.props.onChange && this.props.onChange(data)
    this.props.onClose && this.props.onClose()
  }

  handleChange = (name, val) => {
    const { info } = this.state
    info[name] = val
    console.log(info)
  }

  handleDefChange = (val) => {
    const info = {
      ...this.state.info,
      def_addr: val ? 1 : 0
    }

    this.setState({
      info
    })
  }

  handleDelete = () => {
    this.props.onDelete(this.state.info)
  }

  render () {
    const { info } = this.state
    if (!info) {
      return null
    }

    return (
      <View className='address-edit'>
        <AtForm
          onSubmit={this.handleSubmit}
        >
          <View className='sec address-edit__form'>
            <AtInput
              title='收件人姓名'
              name='name'
              value={info.name}
              onChange={this.handleChange.bind(this, 'name')}
            />
            <AtInput
              title='手机号码'
              name='mobile'
              maxLength={11}
              value={info.mobile}
              onChange={this.handleChange.bind(this, 'mobile')}
            />
            <AtInput
              title='所在区域'
              name='area'
              value={info.area}
              onChange={this.handleChange.bind(this, 'area')}
            />
            <AtInput
              border={false}
              title='详细地址'
              name='addr'
              value={info.addr}
              onChange={this.handleChange.bind(this, 'addr')}
            />
          </View>

          <View className='sec'>
            <SpCell
              title='设为默认地址'
            >
              <Switch
                checked={info.def_addr}
                onChange={this.handleDefChange}
              />
            </SpCell>
          </View>

          <View className='btns'>
            <AtButton type='primary' formType='submit'>提交</AtButton>
            {
              info.addr_id && (<AtButton onClick={this.handleDelete}>删除</AtButton>)
            }
          </View>
        </AtForm>
      </View>
    )
  }
}
