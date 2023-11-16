
import BaseInsertAd from "../base/BaseInsertAd";
import { SDKState, ResultCallback } from "../SDKConfig";

export default class KSInsertAd extends BaseInsertAd {

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

    show() {
        if (this.insertAd) {
            let p = this.insertAd.show()
            p.then(function (result) {
                // 插屏广告展示成功
                console.log(`show interstitial ad success, result is ${result}`)
            }).catch(function (error) {
                console.log('error.code ', error.code)
                // 插屏广告展示失败
                console.log(`show interstitial ad failed, error is ${error}`)
                if (error.code === -10005) {
                    // 表明当前app版本不支持插屏广告，可以提醒用户升级app版本

                }
            })
        }

    }

    create() {
        // 创建插屏广告实例，提前初始化
        if (!this.insertAd) {
            this.insertAd = this.sdk.createInterstitialAd({
                adUnitId: this.adUnitID
            })
            // this.insertAd.onLoad(this.onLoad.bind(this))
            this.insertAd.onError(this.onError.bind(this))
            this.insertAd.onClose(this.onClose.bind(this))
        }
    }

}
