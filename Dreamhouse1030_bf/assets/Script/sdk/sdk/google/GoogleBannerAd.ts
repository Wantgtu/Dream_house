

import BaseBannerAd from "../base/BaseBannerAd";


export default class GoogleBannerAd extends BaseBannerAd {



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
        this.bannerAd.load()
    }

   
}