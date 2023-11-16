
import { ADName } from "../SDKConfig";
import BaseRewardAd from "../base/BaseRewardAd";

export default class SwanRewardAd extends BaseRewardAd {


    create(): void {
        if (!this.rewardAd) {
            // console.log('createVideoAd id ', this.adUnitID)
            this.rewardAd = this.sdk.createRewardedVideoAd({
                adUnitId: this.adUnitID,
                appSid: this.channel.getParamValue(ADName.appid)
            })
            this.rewardAd.onLoad(this.onLoad.bind(this))
            this.rewardAd.onError(this.onError.bind(this))
            this.rewardAd.onClose(this.onClose.bind(this))
        }
    }


}