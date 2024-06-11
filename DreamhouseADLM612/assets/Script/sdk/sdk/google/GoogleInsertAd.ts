

import BaseInsertAd from "../base/BaseInsertAd";
export default class GoogleInsertAd extends BaseInsertAd {


    create() {
        // 创建插屏广告实例，提前初始化
        if (!this.insertAd) {
            this.insertAd =  this.sdk.createInterstitialAd({
                adUnitId: this.adUnitID
            })
            this.insertAd.onLoad(this.onLoad.bind(this))
            this.insertAd.onError(this.onError.bind(this))
        }
    }
}