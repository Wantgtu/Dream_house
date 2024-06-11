
import BaseRewardAd from "../base/BaseRewardAd";
import { SDKState, ResultCallback } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";

/**
 * 全局唯一的视频广告实例，通过tt.createRewardedVideoAd来创建。
 */
export default class TTRewardAd extends BaseRewardAd {

    constructor(c: BaseChannel, id: string) {
        super(c, id)
        this.reload(SDKState.close)
    }



    open(callback: ResultCallback) {
        console.log(' TTRewardAd open state ',this.state)
        this.callback = callback;
        this.show()
    }

    onLoad() {
        this.setState(SDKState.loadSucess)
    }


    create(): void {
        // console.log(' 不支持多例')
        if (!this.rewardAd) {
            this.rewardAd = this.sdk.createRewardedVideoAd({
                adUnitId: this.adUnitID,
                // multiton: true,
                // multitonRewardedMsg: "观看下一个可领取更多奖励",
            })
            this.rewardAd.onLoad(this.onLoad.bind(this))
            this.rewardAd.onError(this.onError.bind(this))
            this.rewardAd.onClose(this.onClose.bind(this))
        } else {
            // this.load();
        }
    }

    destroy() {

    }
}
