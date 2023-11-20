
import BaseRewardAd from "../base/BaseRewardAd";
import { FunctionType } from "../SDKConfig";
import NativeRewardedVideoAd from "../native/ads/NativeRewardedVideoAd";

export default class MiMoRewardAd extends BaseRewardAd {

    protected rewardAd:NativeRewardedVideoAd;
    create() {
        cc.log('NativeTest MiMoRewardAd create  ',this.adUnitID)
        if (!this.rewardAd) {
            this.rewardAd = this.sdk.createRewardedVideoAd({
                adUnitId: this.adUnitID
            })
            this.rewardAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.rewardAd.onError(this.getFunc(FunctionType.onError))
            this.rewardAd.onClose(this.getFunc(FunctionType.onClose))
            this.rewardAd.load();
        }else{
            this.rewardAd.load();
        }
    }
}
