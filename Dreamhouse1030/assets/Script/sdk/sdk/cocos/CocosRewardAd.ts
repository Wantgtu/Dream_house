
import { ADName, ResultState } from "../SDKConfig";
import BaseRewardAd from "../base/BaseRewardAd";

export default class CocosRewardAd extends BaseRewardAd {




    create() {
        if (!this.rewardAd) {
            this.rewardAd = this.sdk.createRewardedVideoAd(ADName.reward, this.adUnitID, 1);
            this.rewardAd.onLoad(this.onLoad.bind(this))
            this.rewardAd.onError(this.onError.bind(this))
            this.rewardAd.onClose(this.onClose.bind(this))
        }
    }



    show() {
        let self = this
        this.rewardAd.show().then(function () {
            console.log('videoAd 广告显示成功，发放激励奖励')
            if (self.callback) {
                self.callback(ResultState.YES)
            }
        }, function (err: any) {
            console.log('videoAd 广告显示失败')
            if (self.callback) {
                self.callback(ResultState.NO)
            }
        });
    }
}
