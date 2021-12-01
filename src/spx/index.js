import Taro,{ getCurrentInstance } from "@tarojs/taro";
import api from "@/api";
import { isWeixin, isAlipay, log, isGoodsShelves, showToast } from "@/utils";
import { SG_TOKEN, SG_USER_INFO } from '@/consts/localstorage'
import qs from 'qs'

const globalData = {}
class Spx {
  constructor(options = {}) {
    this.hooks = [];
    this.options = {
      autoRefreshToken: true,
      ...options
    };

  }

  getAuthToken() {
    const authToken = Taro.getStorageSync(SG_TOKEN);
    if (authToken && !this.get(SG_TOKEN)) {
      this.set(SG_TOKEN, authToken);
    }
    return authToken;
  }

  setAuthToken(token) {
    this.set(SG_TOKEN, token);
    Taro.setStorageSync(SG_TOKEN, token);
  }

  logout() {
    Taro.removeStorageSync( SG_TOKEN )
    Taro.removeStorageSync( SG_USER_INFO )
    this.delete(SG_TOKEN, true)
  }

  get(key, forceLocal) {
    let val = globalData[key];
    if (forceLocal) {
      val = Taro.getStorageSync(key);
      this.set(key, val);
    }
    return val;
  }

  set(key, val, forceLocal) {
    globalData[key] = val;
    if (forceLocal) {
      Taro.setStorageSync(key, val);
    }
  }
  
  delete(key, forceLocal) {
    delete globalData[key];
    if (forceLocal) {
      Taro.removeStorageSync(key);
    }
  }

  toast(...args) {
    Taro.eventCenter.trigger.apply(Taro.eventCenter, [
      "sp-toast:show",
      ...args
    ]);
  }

  closeToast() {
    Taro.eventCenter.trigger("sp-toast:close");
  }
}

export default new Spx();
