import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import "./logistics-info.scss";


function TradeLogisticsInfo(props) {
  return <View className="page-trade-logistics-info"></View>;
}

TradeLogisticsInfo.options = {
  addGlobalClass: true
}

export default TradeLogisticsInfo
