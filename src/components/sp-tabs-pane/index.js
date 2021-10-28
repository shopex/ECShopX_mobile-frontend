import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { navigateTo } from "@/utils";
import "./index.scss";

export default class SpTabs extends Component {
  static options = {
    addGlobalClass: true
  };

  navigateTo = navigateTo;

  render() {
    const { store } = this.props;
    return (
      <View
        className={"sp-tabs"}
        onClick={this.navigateTo.bind(this, "/pages/store/list")}
      >
        {/* <Text className="iconfont icon-dizhi-01"></Text> */}
        <Text className="shop-name">
          {store ? store.store_name : "选择店铺"}
          {store ? store.store_name : "选择店铺"}
        </Text>
        <Text className="iconfont icon-arrowRight"></Text>
      </View>
    );
  }
}
