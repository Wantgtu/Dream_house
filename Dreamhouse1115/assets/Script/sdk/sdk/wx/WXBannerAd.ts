
import BaseBannerAd from "../base/BaseBannerAd";
import { SDKState, FunctionType } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";
/**
 * 创建 banner 广告组件。请通过 getSystemInfoSync() 返回对象的 SDKVersion 
 * 判断基础库版本号 >= 2.0.4 后再使用该 API。每次调用该方法创建 banner 广告都会返回一个全新的实例。
 */
export default class WXBannerAd extends BaseBannerAd {

    constructor(c: BaseChannel, id: string) {
        super(c, id)
        // this.preload(SDKState.close)
    }


    //没有load方法
    load(): void {

    }

    create(): void {
        if (!this.bannerAd) {
            console.log('WXBannerAd create  this.adUnitID', this.adUnitID)
            this.bannerAd = this.sdk.createBannerAd({
                adUnitId: this.adUnitID,
                adIntervals: 30,
                style: this.getStyle()
            })
            this.bannerAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.bannerAd.onError(this.getFunc(FunctionType.onError))
            this.bannerAd.onResize(this.getFunc(FunctionType.onResize))
            this.setState(SDKState.loading)
        }
    }
}
