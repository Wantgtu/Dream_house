
import BaseBannerAd from "../base/BaseBannerAd";
import BaseChannel from "../base/BaseChannel";

export default class TTBannerAd extends BaseBannerAd {


    constructor(c: BaseChannel, id: string) {
        super(c, id)
        let winSize = this.sdk.getSystemInfoSync();
        if (winSize.width > winSize.height) {
            this.width = 128
        } else {
            this.width = 300
        }

        this.height = 100;
    }
    create() {
        if (!this.bannerAd) {
            this.bannerAd = this.sdk.createBannerAd({
                adUnitId: this.adUnitID,
                style: this.getStyle()
            })
            this.bannerAd.onLoad(this.onLoad.bind(this))
            this.bannerAd.onError(this.onError.bind(this))
            this.bannerAd.onResize(this.onResize.bind(this))
        }
    }

    load(): void {
        //tt banner 没有load方法。
    }
}
