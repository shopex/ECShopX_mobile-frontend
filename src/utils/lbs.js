class LBS {
  constructor () {
    if(process.env.TARO_ENV === 'h5'){
      this.loadJScript()
    }
  }

  // 加载地图sdk
  loadJScript() {
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = `https://apis.map.qq.com/tools/geolocation/min?key=${process.env.APP_MAP_KEY}&referer=${process.env.APP_MAP_NAME}`
    document.body.appendChild(script)
  }
}

export default LBS