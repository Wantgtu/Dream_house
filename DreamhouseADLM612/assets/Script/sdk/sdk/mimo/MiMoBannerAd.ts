
import BaseBannerAd from "../base/BaseBannerAd";
import { FunctionType, SDKState } from "../SDKConfig";
import NativeBannerAd from "../native/ads/NativeBannerAd";
export default class MiMoBannerAd extends BaseBannerAd {
    protected bannerAd:NativeBannerAd;
    create() {
        if (!this.bannerAd) {
            this.bannerAd = this.sdk.createBannerAd({
                adUnitId: this.adUnitID,
                layout: 1,
                width: 300,
                height: 100
            })
            this.bannerAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.bannerAd.onError(this.getFunc(FunctionType.onError))
        }
    }

    updateSize(){

    }

    hide(){
        super.hide();
        this.setState(SDKState.close)
    }
}
