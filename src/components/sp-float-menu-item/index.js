import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

function SpFloatMenuItem(props) {
  const { children, onClick = () => {} } = props;
  return (
    <View className="sp-float-menu-item" onClick={onClick}>
      {children}
    </View>
  );
}

SpFloatMenuItem.options = {
  addGlobalClass: true,
};

export default SpFloatMenuItem;
