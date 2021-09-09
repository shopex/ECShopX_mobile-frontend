import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { SpGoodsItem } from "@/components";
import "./index.scss";

export default class SpRecommend extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    info: null
  };

  render() {
    const { info } = this.props;
    return (
      <View className={"sp-recommend"}>
        <View className="sp-recommend-hd">猜你喜欢</View>
        <View className="sp-recommend-bd">
          {info.map((goods, index) => (
            <View className="goods-item-wrap" key={`goods-item-wrap__${index}`}>
              <SpGoodsItem info={goods} />
            </View>
          ))}
        </View>
      </View>
    );
  }
}
