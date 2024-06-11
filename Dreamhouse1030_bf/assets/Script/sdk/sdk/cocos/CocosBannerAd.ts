
import { ADName, SDKState } from "../SDKConfig";
import BaseBannerAd from "../base/BaseBannerAd";

export default class CocosBannerAd extends BaseBannerAd {


    create() {
        if (!this.bannerAd) {
            this.bannerAd = this.sdk.createBannerAd(ADName.banner, this.adUnitID, 2);
            this.bannerAd.onLoad(this.onLoad.bind(this))
            this.bannerAd.onError(this.onError.bind(this))
        }

    }






}
