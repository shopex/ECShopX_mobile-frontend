import Taro from "@tarojs/taro";
import qs from "qs";

class EntryLaunch {
  constructor() {
  }

  // 
  init(params) {
    const { query, scene } =
      process.env.TARO_ENV == "h5"
        ? { query: params }
        : Taro.getLaunchOptionsSync();
    let options = {
      ...query
    };
    
    if (scene) {
      options = {
        ...options,
        ...qs.parse(decodeURIComponent(query.scene))
      }
    }

    Taro.setStorageSync( "sence_params", options );
    this.sence_params = options
    return options;
  }

  // 获取参数
}

export default new EntryLaunch();
