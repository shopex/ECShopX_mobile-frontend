import React, { useEffect } from "react";
import { useSelector } from "react-redux"
import { useImmer } from "use-immer"
import Taro from "@tarojs/taro";
import api from "@/api"
import doc from "@/doc"
import { View } from "@tarojs/components"
import "./store-picker.scss";


function TradeStorePicker(props) {
  return <View className="page-trade-store-picker"></View>;
}

TradeStorePicker.options = {
  addGlobalClass: true
}

export default TradeStorePicker
