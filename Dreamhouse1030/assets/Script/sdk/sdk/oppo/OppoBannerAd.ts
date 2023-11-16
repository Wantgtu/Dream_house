

import BaseBannerAd from "../base/BaseBannerAd";
import { SDKState } from "../SDKConfig";

//https://open.oppomobile.com/wiki/doc#id=10536
export default class OppoBannerAd extends BaseBannerAd {
    preload(s: SDKState) {
        this.logicState = s;
        this.destroy();
        this.create();
        this.show()
    }

    load(): void {
        //oppo的banner，没有load方法。
    }

    getStyle() {
        return {
        }
    }

    create() {
        console.log('OppoBannerAd this.adUnitID ', this.adUnitID)
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


}