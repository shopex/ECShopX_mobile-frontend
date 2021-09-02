import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtButton } from "taro-ui";
import S from "@/spx";
import api from "@/api";
import { showToast, classNames, navigateTo } from "@/utils";
import { Tracker } from "@/service";
import "./index.scss";

@connect(
  () => ({}),
  dispatch => ({
    setMemberInfo: memberInfo =>
      dispatch({ type: "member/init", payload: memberInfo })
  })
)
export default class SpLogin extends Component {
  static options = {
    addGlobalClass: true
  };

  constructor(props) {
    super(props);
    this.state = {
      token: S.getAuthToken()
    };
  }

  componentDidMount() {}

  navigateTo = navigateTo;

  handleOnChange() {
    this.props.onChange && this.props.onChange();
  }

  render() {
    const { token } = this.state;
    return (
      <View className={classNames("sp-login", this.props.className)}>
        {token && (
          <View onClick={this.handleOnChange.bind(this)}>
            {this.props.children}
          </View>
        )}

        {!token && (
          <AtButton className="login-btn" onClick={this.navigateTo.bind(this, '/subpage/pages/auth/login')}>
            {this.props.children}
          </AtButton>
        )}

      </View>
    );
  }
}
