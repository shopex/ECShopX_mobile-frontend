import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { classNames, navigateTo } from "@/utils";
import "./index.scss";

export default class SpTabs extends Component {
  static options = {
    addGlobalClass: true
  };

  static defaultProps = {
    tablist: []
  };

  navigateTo = navigateTo;

  render() {
    const { tablist } = this.props;
    return (
      <View className={"sp-tabs"}>
        <View className="sp-tab-hd">
          {tablist.map((tab, index) => (
            <View key={`tab-item__${index}`}>
              {tab.icon && (
                <Text className={classNames(`iconfont`, tab.icon)}></Text>
              )}
              <Text>{tab.title}</Text>
            </View>
          ))}
        </View>
        <View className="sp-tab-bd">
          {this.props.children}
        </View>
      </View>
    );
  }
}
