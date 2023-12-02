

import BaseBannerAd from "../base/BaseBannerAd";
import { FunctionType, SDKState } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";
export default class QQBannerAd extends BaseBannerAd {


    constructor(c: BaseChannel, id: string) {
        super(c, id)
        this.setFunc(FunctionType.onRefresh, this.onRefresh.bind(this))
    }

    onRefresh() {

    }

    //没有load方法
    load(): void {

    }
    show(): void {
        this.logicState = SDKState.close;
        console.log(' QQBannerAd show 11111111111111111111')
        if (this.bannerAd) {

            // this.setState(SDKState.open)
            this.bannerAd.show().then(() => {
                this.setVisible(true)
                console.log(' QQBannerAd show true')
                if (this.callback) {
                    this.callback(SDKState.open)
                    this.callback = null;
                }
            }).catch(() => {
                if (this.callback) {
                    this.callback(SDKState.close)
                    this.callback = null;
                }
                console.log(' QQBannerAd show error')
                this.error = true
            })

        }
    }

    destroy() {
        if (this.bannerAd) {
            this.bannerAd.offLoad(this.getFunc(FunctionType.onLoad))
            this.bannerAd.offError(this.getFunc(FunctionType.onError))
            this.bannerAd.offResize(this.getFunc(FunctionType.onResize))
            this.bannerAd = null;
        }
    }

    create() {
        if (!this.bannerAd) {
            this.bannerAd = this.sdk.createBannerAd({
                adUnitId: this.adUnitID,
                style: this.getStyle(),
                // adIntervals: 30,
            })
            this.createTime()
            this.bannerAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.bannerAd.onError(this.getFunc(FunctionType.onError))
            this.bannerAd.onResize(this.getFunc(FunctionType.onResize))
            // this.bannerAd.onRefresh(this.getFunc(FunctionType.onRefresh))
        }

    }
}
