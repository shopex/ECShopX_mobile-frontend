
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './img-gif.scss'

export default class WgtImgGif extends Component {
    static options = {}

    static defaultProps = {
        info: {}
    }

    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {

        const { info } = this.props

        return (
            <View className={`index ${info.base.padded ? 'wgt__padded' : null}`}>
                <View className='imglist'>
                    <Image
                        mode='widthFix'
                        className='scale-placeholder png'
                        src={info.data[0].imgUrl}
                    />
                    <Image
                        mode='widthFix'
                        className='scale-placeholder gif'
                        src={info.data[1].imgUrl}
                    />
                </View >
            </View>
        )
    }
}
