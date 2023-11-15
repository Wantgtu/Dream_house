
import BaseInsertAd from "../base/BaseInsertAd";
import { SDKState, ResultCallback } from "../SDKConfig";

export default class WXInsertAd extends BaseInsertAd {


    open(func: ResultCallback) {
        this.callback = func;
        // console.log('BaseInterstitialAd showAd adUnitID ', this.adUnitID)
        this.state = SDKState.loading;
        this.destroy()
        this.create()
        this.show()
    }


    onClose() {

    }

    create() {
        // 创建插屏广告实例，提前初始化
        if (!this.insertAd) {
            this.insertAd = this.sdk.createInterstitialAd({
                adUnitId: this.adUnitID
            })
            this.insertAd.onLoad(this.onLoad.bind(this))
            this.insertAd.onError(this.onError.bind(this))
            this.insertAd.onClose(this.onClose.bind(this))
        }
    }
}
