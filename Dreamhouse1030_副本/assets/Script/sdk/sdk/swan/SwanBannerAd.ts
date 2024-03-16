
import { ADName } from "../SDKConfig";
import BaseBannerAd from "../base/BaseBannerAd";
/**
 * https://smartprogram.baidu.com/docs/game/tutorials/adTutorial/bannerDoc/。
 */
export default class SwanBannerAd extends BaseBannerAd {





    create(): void {

        if (!this.bannerAd) {
            this.bannerAd = this.sdk.createBannerAd({
                adUnitId: this.adUnitID,
                appSid: this.channel.getParamValue(ADName.appid),
                style: this.getStyle()
            })
            this.bannerAd.onLoad(this.onLoad.bind(this))
            this.bannerAd.onError(this.onError.bind(this))
            this.bannerAd.onResize(this.onResize.bind(this))
        }


    }


}
