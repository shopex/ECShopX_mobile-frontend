import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import api from '@/api'

export default class TagsBar extends Component {
  static options = {
    addGlobalClass = true
  }

  static defaultProps = {
    current: 0,
    list: []
  }

  constructor (props) {
    super(props)

    const { current } = props
    this.state = {
      curIdx: current
    }
  }

  handleClickItem (idx) {
    const item = this.props.list[idx]

    this.setState({
      curIdx: idx
    })

    this.props.onChange({
      current: idx,
      sort: sortOrder
    })
  }

  render () {
    const { list } = this.props.list

    return (
      <ScrollView
        scroll-y
      >
        {
          list.map((item, idx) => {
            const isCurrent = curIdx === idx

            return (
              <View
                onClick={this.handleClickItem(item.tag_id)}
              >
                {item.tag_name}
              </View>
            )
          })
        }
      </ScrollView>
    )
  }
}
