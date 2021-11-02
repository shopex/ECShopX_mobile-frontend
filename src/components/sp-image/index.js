import Taro, { Component } from "@tarojs/taro";
import { Image } from "@tarojs/components";
import { classNames } from "@/utils";
import "./index.scss";

const Fn = () => { }

function SpImage( props ) {
  const {
    src,
    className,
    mode = 'widthFix',
    onError = Fn,
    onLoad = Fn,
    lazyLoad = Fn
  } = this.props;
  const imgUrl = `${process.env.APP_IMAGE_CDN}/${src}`;
  return (
    <Image
      className={classNames(
        {
          "sp-image": true
        },
        className
      )}
      src={imgUrl}
      mode={mode}
      onError={onError}
      onLoad={onLoad}
      lazyLoad={lazyLoad}
    />
  );
}

export default SpImage;
