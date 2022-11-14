import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import "./after-sale-detail.scss";


function TradeAfterSaleDetail(props) {
  return <View className="page-trade-after-sale-detail"></View>;
}

TradeAfterSaleDetail.options = {
  addGlobalClass: true
}

export default TradeAfterSaleDetail
