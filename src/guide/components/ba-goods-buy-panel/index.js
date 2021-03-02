import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'

import { Price } from '@/components'
import InputNumber from '@/components/input-number'
import { classNames, log, isNumber } from '@/utils'
import api from '@/api'
import S from '@/spx'
import debounce from 'lodash/debounce'
import './index.scss'


export default class BaGoodsBuyPanel extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    info: null,
    isOpened: false,
    type: 'fastbuy',
    fastBuyText: '立即购买',
    busy: false,
    onClose: () => {},
    onChange: () => {},
    onClickAddCart: () => {},
    onClickFastBuy: () => {},
    clear: false // 列表页 允许关闭按钮重置组件内部state
  }

  constructor (props) {
    super(props)

    this.state = {
      marketing: 'normal',
      selection: [],
      selcurSku: null,
      curImg: null,
      quantity: 1,
      isActive: props.isOpened
    }

    this.disabledSet = new Set()
  }

  componentDidMount () {
    this.transformInfo(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const { isOpened } = nextProps
    if (isOpened !== this.state.isActive) {
      this.transformInfo(nextProps)
      this.setState({
        isActive: isOpened
      })
    }
  }

  transformInfo (props) {
    const { info } = props
    
    const { spec_items } = info
    const marketing = info.group_activity
      ? 'group'
      : info.seckill_activity
      ? 'seckill'
      :info.activity_type!=='normal'
      ?info.activity_type: 'normal'
    const skuDict = {}

    spec_items.forEach(t => {
      const key = t.item_spec.map(s => s.spec_value_id).join('_')
      const propsText = t.item_spec.map(s => s.spec_value_name).join(' ')
      t.propsText = propsText
      skuDict[key] = t
    })
    const selection = Array(info.item_spec_desc.length).fill(null)
    this.skuDict = skuDict
    this.setState({
      marketing,
      selection
    })

    if (!spec_items || !spec_items.length) {
      this.noSpecs = true
    }else{
      this.noSpecs = false
    }
  }

  getSkuProps = () => {
    const { info } = this.props
    if (!info) return ''

    const { selcurSku } = this.state
    let propsText = ''

    if (this.noSpecs) {
      return ''
    }

    if (!selcurSku) {
      return `请选择`
    }

    propsText = selcurSku.propsText
    return `已选 “${propsText}”`
  }

  calcDisabled (selection) {
   
    const skuDict = this.skuDict
    const disabledSet = new Set()
    const makeReg = (sel, row, val) => {
      const tSel = sel.slice()
      const regStr = tSel.map((s, idx) => row === idx
        ? val
        : !s ? '(\\d+)' : s
      ).join('_')

      return new RegExp(regStr)
    }
    const { info } = this.props
    const isNotDisabled = (sel, row, val) => {
      const reg = makeReg(sel, row, val)

      return Object.keys(skuDict).some(key => {
       
        if(info.is_open_o2o){
           return key.match(reg)
        }else{
          return key.match(reg) && skuDict[key].store > 0
        }

      })
    }



    for (let i = 0, l = info.item_spec_desc.length; i < l; i++) {
      const { spec_values } = info.item_spec_desc[i]
      for (let j = 0, k = spec_values.length; j < k; j++) {
        const id = spec_values[j].spec_value_id
        // console.log('isNotDisabled---1',isNotDisabled(selection, i, id))
        // console.log('disabledSet---1',disabledSet.has(id))
        if (!disabledSet.has(id) && !isNotDisabled(selection, i, id)) {
          disabledSet.add(id)
        }
      }
    }
    
    this.disabledSet = disabledSet
  }

  getCurSkuImg (sku) {
    let img = this.props.info.pics[0]
    if (!sku) {
      return img
    }

    sku.item_spec.some(s => {
      if (s.spec_image_url) {
        img = s.spec_image_url
        return true
      }
    })
    return img
  }

  updateCurSku (selection) {
    selection = selection || this.state.selection
    this.calcDisabled(selection)
    if (selection.some(s => !s)) {
      this.setState({
        selcurSku: null,
        curImg: null
      })
      this.props.onChange(null)
      return
    }

    const selcurSku = this.skuDict[selection.join('_')]
    const curImg = this.getCurSkuImg(selcurSku)
    this.setState({
      selcurSku,
      curImg
    })

    this.props.onChange(selcurSku)
    log.debug('[goods-buy-panel] updateCurSku: ', selcurSku)
  }

  handleQuantityChange = (val) => {
   
    this.setState({
      quantity: val
    })
  }

  handleSelectSku = (item, idx) => {

 
    if (this.disabledSet.has(item.spec_value_id)) return

    const { selection } = this.state
    if (selection[idx] === item.spec_value_id) {
      selection[idx] = null
    } else {
      selection[idx] = item.spec_value_id
    }

    this.updateCurSku(selection)
    this.setState({
      selection
    })
  }

  toggleShow = (isActive) => {
    if (isActive === undefined) {
      isActive = !this.state.isActive
    }
    const {onClose}=this.props
    onClose()
    this.setState({ isActive })
    this.resetData()
  }

  resetData = () => {
    if (!this.props.clear) return

    this.setState({
      marketing: 'normal',
      selection: [],
      selcurSku: null,
      curImg: null,
      quantity: 1,
      isActive: this.props.isOpened
    })
  }


  handleBuyClick =debounce(async (type, skuInfo, num) => {
  
    if (this.state.busy) return
    const {info } = this.state

    const { item_id } = this.noSpecs ? info : skuInfo
    const {onAddCart } = this.props
    
    this.setState({
      busy: true
    })

    if (type === 'cart') {
    
      try {
        await api.cart.add({
          item_id,
          num
        })
        onAddCart&&onAddCart()
      } catch (e) {
       
        if(e){
          this.setState({
            busy: false
          })
          return false
        }

      }

      Taro.showToast({
        title: '成功加入购物车',
        icon: 'success'
      })
    
      this.setState({
        busy: false
      })
      this.resetData()
    }

   
    

  },1000) 

  render () {
    const { info, type, fastBuyText } = this.props
   
    const { curImg, quantity, selection, isActive, busy } = this.state
    if (!info) {
      return null
    }
    let activity_info=info.activity_info||null
 
    const ipxClass = S.get('ipxClass')
    let curSku = this.noSpecs ? info : this.state.selcurSku;
    let maxStore =1
    let hasStore=null
    if(info.is_open_o2o){//开启o2o配送方式，则无库存时还是可以添加购物车和立即购买
      hasStore=true
      maxStore=99999
    }else{//不开启o2o配送，只要官网配送时，若无库存则不能添加购物车和立即购买
      hasStore = curSku ? curSku.store > 0 : info.store > 0
      maxStore=+(curSku ? curSku.store : (info.store || 99999))
    }
    
    let priceCurSku=0
    let market_priceCurSku=0

    if(curSku){//选择多规格商品时价格
      priceCurSku = curSku&&curSku.act_price ? curSku.act_price:curSku.price
      market_priceCurSku = curSku&&curSku.act_price ? curSku.price:curSku.market_price
     
    }else{//未选择规格时的价格
      
      priceCurSku = info&&info.act_price ? info.act_price:info.price
      market_priceCurSku = info&&info.act_price ? info.price:info.market_price
     
    }
   
    return (
      <View className={classNames('goods-buy-panel', isActive ? 'goods-buy-panel__active' : null)}>
        <View className='goods-buy-panel__overlay'></View>

        <View className='goods-buy-panel__wrap'>
          <View
            className='at-icon at-icon-close'
            onClick={() => this.toggleShow(false)}
          />
          <View className='goods-buy-panel__hd'>
            <View className='goods-img__wrap'>
              <Image
                className='goods-img'
                mode='aspectFill'
                src={curImg || info.pics[0]}
              />
            </View>
            <View className='goods-sku__price'>
              <Price
                primary
                unit='cent'
                noSymbol
                appendText='元'
                value={priceCurSku}
              />
              {
                priceCurSku < market_priceCurSku
                  ? <Price
                    className='price-market'
                    symbol='¥'
                    unit='cent'
                    value={market_priceCurSku}
                  />
                  : null
              }

            </View>
            <View className='goods-sku__info'>
          
              {this.noSpecs
                ? (<Text className='goods-sku__props'>{info.item_name}</Text>)
                :(<Text className='goods-sku__props'>
                    <Text className='goods-sku__props-label'>选择规格</Text>
                    <Text>{curSku ? `已选择 ${curSku.propsText}` : '请选择'}</Text>
                  </Text>)
              }
            </View>
          </View>
          <View className='goods-buy-panel__bd'>
            <ScrollView
              className='goods-skus__wrap'
              scrollY
            >
              {
                info.item_spec_desc.map((spec, idx) => {
                  return (
                    <View
                      className='sku-item__group'
                      key={spec.spec_id}
                    >
                      {info.item_spec_desc.length > 1 && (<Text className='sku-item__group-hd'>{spec.spec_name}</Text>)}
                      <View className='sku-item__group-bd'>
                        {
                          spec.spec_values.map(sku => {
                            return (
                              <Text
                                className={classNames('sku-item', { 'is-active': sku.spec_value_id === selection[idx], 'is-disabled': this.disabledSet.has(sku.spec_value_id) })}
                                key={sku.spec_value_id}
                                onClick={this.handleSelectSku.bind(this, sku, idx)}
                              >{sku.spec_value_name}</Text>
                            )
                          })
                        }
                      </View>
                    </View>
                  )
                })
              }
            </ScrollView>
            <View className='goods-quantity__wrap'>
              <Text className='goods-quantity__hd'></Text>
              <View className='goods-quantity__bd'>
                <InputNumber
                  activityType={type}
                  inputDisable={false}
                  min={1}
                  max={maxStore}
                  value={quantity}
                  onChange={this.handleQuantityChange.bind(this)}
                  onChangeNum={this.handleQuantityChange.bind(this)}
                />
              </View>
            </View>
          </View>
          <View className='goods-buy-panel__ft'>
            <View className='goods-buy-panel__btns'>
              {(type === 'cart' && hasStore) && (
                <Button
                  loading={busy}
                  className={classNames('goods-buy-panel__btn btn-add-cart', { 'is-disabled': !curSku })}
                  onClick={this.handleBuyClick.bind(this, 'cart', curSku, quantity)}
                  disabled={Boolean(!curSku)}
                >为顾客下单</Button>
              )}
           
           
              {!hasStore && (<Button disabled className='goods-buy-panel__btn btn-fast-buy'>当前商品无货</Button>)}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
