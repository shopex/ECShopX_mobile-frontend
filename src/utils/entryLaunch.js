import Taro from "@tarojs/taro";
import api from "@/api";
import qs from "qs";
import configStore from "@/store";
import { showToast, log } from "@/utils";

class EntryLaunch {
  constructor() {
    const { store } = configStore();
    this.store = store;
  }

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
      };
    }

    Taro.setStorageSync("launch_params", options);
    this.sence_params = options;
    this.initAMap();
    return options;
  }

  /**
   * @function 初始化高德地图配置
   */
  initAMap() {
    AMap.plugin(["AMap.Geolocation", "AMap.Geocoder"], () => {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：5s
        position: "RB", //定位按钮的停靠位置
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
      });
      this.geocoder = new AMap.Geocoder({
        radius: 1000 //范围，默认：500
      });
    });
  }

  /**
   * @function 获取当前店铺
   */
  async getCurrentStore() {
    const { is_open_wechatapp_location } = Taro.getStorageSync("settingInfo");
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const { dtid } = currentPage.$router.params;
    let storeQuery = {}; // 店铺查询参数
    if (dtid) {
      storeQuery = {
        distributor_id: dtid
      };
    } else {
      // 开启定位
      if (is_open_wechatapp_location == 1) {
        const { position } = await this.getLocationInfo();
        storeQuery = {
          ...storeQuery,
          lat: position.lat,
          lng: position.lng
        };
        const {
          addressComponent,
          formattedAddress
        } = await this.getAddressByLnglat([position.lng, position.lat]);
        Taro.setStorageSync("locationAddress", {
          ...addressComponent,
          formattedAddress,
          lat: position.lat,
          lng: position.lng
        } );
        showToast(formattedAddress);
      }
    }
    const storeInfo = await api.shop.getShop(storeQuery);
    Taro.setStorageSync("curStore", storeInfo);
    this.store.dispatch({
      type: "shop/setShop",
      payload: storeInfo
    });
    return storeInfo;
  }

  /**
   * @function 根据经纬度获取定位信息
   */
  getLocationInfo() {
    if (process.env.TARO_ENV === "weapp") {
    } else {
      return new Promise((reslove, reject) => {
        this.geolocation.getCurrentPosition(function(status, result) {
          if (status == "complete") {
            reslove(result);
          } else {
            reject(result.message);
          }
        });
      });

      // const geolocation = new qq.maps.Geolocation();
      // return new Promise((resolve, reject) => {
      //   geolocation.getLocation(
      //     res => {
      //       showToast(JSON.stringify(res));
      //       resolve(res);
      //     },
      //     error => {
      //       reject(`qq maps geolocation fail... ,`, error);
      //     },
      //     { timeout: 9000 }
      //   );
      // });
    }
  }

  /**
   * @function 根据经纬度解析地址
   */
  getAddressByLnglat(lnglat) {
    return new Promise((reslove, reject) => {
      this.geocoder.getAddress(lnglat, function(status, result) {
        if (status === "complete" && result.regeocode) {
          reslove(result.regeocode);
        } else {
          reject(status);
        }
      });
    });
  }

  /**
   * @function 是否开启店铺
   * @returns Boolean
   * @description 标准版有门店，并且根据后台设置是否展示门店；平台版不显示门店
   */
  hasStores() {
    const { nostores_status } = Taro.getStorageSync("otherSetting");
    if (process.env.APP_PLATFORM === "standard") {
      return !nostores_status;
    } else {
      return false;
    }
  }
}

export default new EntryLaunch();
