
import BaseInsertAd from "../base/BaseInsertAd";

export default class QQInsertAd extends BaseInsertAd {


    onClose() {
        console.log(' 插屏广告关闭')
    }

    create() {
        // 创建插屏广告实例，提前初始化
        if (!this.insertAd) {
            this.insertAd =  this.sdk.createInterstitialAd({
                adUnitId: this.adUnitID
            })
            this.insertAd.onLoad(this.onLoad.bind(this))
            this.insertAd.onError(this.onError.bind(this))
            this.insertAd.onClose(this.onClose.bind(this))
        }
    }

}
