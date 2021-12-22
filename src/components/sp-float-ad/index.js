import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { useImmer } from "use-immer";
import { AtCurtain } from "taro-ui";
import { SpImage } from "@/components"
import api from "@/api";
import S from "@/spx";
import "./index.scss";

const initialState = {
  list: [],
};

function SpFloatAd(props) {
  const [state, setState] = useImmer(initialState);

  useEffect(() => {
    fetchAdList();
  }, []);

  const fetchAdList = async () => {
    const { general, membercard } = await api.promotion.automatic({
      register_type: "all",
    });

    setState( draft => {
      draft.list = [{ ...general }, { ...membercard }];
    })
  };

  const onCloseAd = () => {

  }

  return (
    <View>
      {state.list.map((item, index) => (
        <AtCurtain isOpened={true} onClose={onCloseAd}>
          <SpImage src={item.ad_pic} mode="heightFix" />
          <View className="ad-title">{item.ad_title}</View>
        </AtCurtain>
      ))}
    </View>

    // <View className="sp-float-ad">
    //   {isShow && (
    //     <View className="gift-wrap">
    //       <View className="gift">
    //         <Image className="gift-bg" src={info.adPic} mode="widthFix" />
    //         <Button
    //           className={`btn-primary ${info.title ? null : "gift-btn"}`}
    //           onClick={onClick}
    //         >
    //           {info.title}
    //         </Button>
    //         <View
    //           className="zoom-btn iconfont icon-close"
    //           onClick={onClose}
    //         ></View>
    //       </View>
    //     </View>
    //   )}
    // </View>
  );
}

SpFloatAd.options = {
  addGlobalClass: true,
};

export default SpFloatAd;
