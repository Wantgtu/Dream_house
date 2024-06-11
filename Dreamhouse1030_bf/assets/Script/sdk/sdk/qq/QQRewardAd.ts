

import BaseRewardAd from "../base/BaseRewardAd";
import { SDKState } from "../SDKConfig";
export default class QQRewardAd extends BaseRewardAd {

    destroy(): void {

    }
    create(): void {
        console.log(' 不支持多例')
        if (!this.rewardAd) {
            console.log(' create 111111')
            this.rewardAd = this.sdk.createRewardedVideoAd({ adUnitId: this.adUnitID })
            this.rewardAd.onLoad(this.onLoad.bind(this))
            this.rewardAd.onError(this.onError.bind(this))
            this.rewardAd.onClose(this.onClose.bind(this))
        } else {

        }
        console.log(' create 2222')
        this.rewardAd.load();

    }

    show() {
        this.logicState = SDKState.close;
        this.setState(SDKState.open)
        if (this.rewardAd) {
            console.log(' 展示激励视频 ')
            this.rewardAd.show()
        }
    }



}
