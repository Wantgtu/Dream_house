

import BaseBannerAd from "../base/BaseBannerAd";
/**
 * public enum BannerLayout {
    TOP_MID,//上中
    BOTTOM_MID,//下中
 }
 */
export default class CSJBannerAd extends BaseBannerAd {

    create() {
        if (!this.bannerAd) {
            this.bannerAd = this.sdk.createBannerAd({
                adUnitId: this.adUnitID,
                layout: 1,
                width: 300,
                height: 100
            })
            this.bannerAd.onLoad(this.onLoad.bind(this))
            this.bannerAd.onError(this.onError.bind(this))
        }

        // this.instance.onResize(this.onResize.bind(this))
        this.bannerAd.load()
    }
}
