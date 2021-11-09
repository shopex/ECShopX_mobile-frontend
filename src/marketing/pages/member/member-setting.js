import Taro, { Component } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import req from "@/api/req";
import { SpCell } from "@/components";
import S from "@/spx";

import "./member-setting.scss";

export default class SettingIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectInfo: {}
    };
  }

  componentDidShow() {
    this.fetchRedirect();
  }

  config = {
    navigationBarTitleText: '设置'
  }

  // 获取积分个人信息跳转
  async fetchRedirect() {
    const url = `/pageparams/setting?template_name=yykweishop&version=v1.0.1&page_name=member_center_redirect_setting`;
    const { list = [] } = await req.get(url);
    if (list[0] && list[0].params) {
      this.setState({
        redirectInfo: list[0].params
      });
    }
    // this.setState({
    //   memberBanner:list
    // })
  }

  handleClickWxOAuth = (url, isLogin = false) => {
    if (!S.getAuthToken() && isLogin) {
      Taro.showToast({
        title: "请先登录",
        icon: "none"
      });
      return false;
    }
    Taro.navigateTo({ url });
  }

  handleClickInfo = () => {
    const { redirectInfo } = this.state;
    if (!S.getAuthToken()) {
      Taro.showToast({
        title: "请先登录",
        icon: "none"
      });
      return false;
    }
    if (redirectInfo.data && redirectInfo.data.info_url_is_open) {
      Taro.navigateToMiniProgram({
        appId: redirectInfo.data.info_app_id,
        path: redirectInfo.data.info_page
      });
    } else {
      this.handleClickWxOAuth("/marketing/pages/member/userinfo", true)
    }
  }

  async handleCancelMenber() {
    console.log('注销会员')
    this.handleClickWxOAuth("/marketing/pages/member/destroy-member", true)
    //
    // Taro.showLoading()
    // const url = `/member`
    // req.delete(url).then(res => {
    //   if (res.status) {
    //     Taro.hideLoading()
    //     Taro.showModal({
    //       title: "注销会员",
    //       content:
    //         "一旦注销会员，会员资产会被清零且不能对历史订单发起售后，请确认是否注销",
    //       showCancel: true,
    //       success: res => {
    //         if (res.confirm) {
    //           Taro.showLoading();
    //           const url = `/member?is_delete=1`;
    //           req.delete(url).then(res => {
    //             if (res.status) {
    //               Taro.hideLoading();
    //               wx.clearStorage();
    //               Taro.showToast({
    //                 title: "注销成功",
    //                 icon: "none",
    //                 mask: true,
    //                 duration: 2000
    //               });
    //               Taro.navigateBack();
    //             } else {
    //               Taro.showModal({
    //                 title: "注销会员",
    //                 content: res.message
    //               });
    //             }
    //           });
    //           Taro.hideLoading();
    //         }
    //       }
    //     });
    //   } else {
    //     Taro.showModal({
    //       title: "注销会员",
    //       content: res.message
    //     });
    //   }
    // });
    // Taro.hideLoading();
  }

  render() {
    return (
      <View className='member-setting'>
        <View className='page-member-section'>
          <SpCell
            title='个人信息'
            isLink
            onClick={this.handleClickInfo.bind(this)}
          ></SpCell>
          <SpCell
            title='地址管理'
            isLink
            onClick={this.handleClickWxOAuth.bind(
              this,
              '/marketing/pages/member/address',
              true
            )}
          ></SpCell>
          {S.getAuthToken() && (
            <Button className='button' onClick={this.handleCancelMenber.bind(this)}>
              注销账号
            </Button>
          )}
        </View>
      </View>
    );
  }
}
