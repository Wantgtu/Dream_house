


import BaseRewardAd from "../base/BaseRewardAd";

export default class KwaiRewardAd extends BaseRewardAd {


    create() {
        if (!this.rewardAd) {
            this.rewardAd = this.sdk.createRewardedVideoAd({
                adUnitId: this.adUnitID
            })
            this.rewardAd.onLoad(this.onLoad.bind(this))
            this.rewardAd.onError(this.onError.bind(this))
            this.rewardAd.onClose(this.onClose.bind(this))

        }

    }


}
