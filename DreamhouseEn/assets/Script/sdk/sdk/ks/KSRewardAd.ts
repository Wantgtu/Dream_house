

import BaseRewardAd from "../base/BaseRewardAd";
import { SDKState, ResultCallback } from "../SDKConfig";
export default class KSRewardAd extends BaseRewardAd {


    open(callback: ResultCallback) {

        console.log(' BaseRewardAd open state ', this.state)
        if (callback) {
            this.callback = callback;
        }
        // if (this.state == SDKState.loadSucess) {
        //     this.show()
        // } else {
        this.reload(SDKState.open)
        // }
    }
    reload(s: SDKState) {
        // console.log('预加载视频', s)
        this.logicState = s;
        this.setState(SDKState.loading)
        // this.destroy(); //单例 不需要销毁
        this.create();
        this.show()
    }

    create(): void {

        // let sdkVersion = this.sdk.getSystemInfoSync().SDKVersion;
        if (!this.rewardAd) {
            console.log(' 不支持多例')
            this.rewardAd = this.sdk.createRewardedVideoAd({ adUnitId: this.adUnitID })
            // this.rewardAd.onLoad(this.onLoad.bind(this))
            this.rewardAd.onError(this.onError.bind(this))
            this.rewardAd.onClose(this.onClose.bind(this))
        } else {
            //微信会在第一次创建的时候默认load一次。
            // this.rewardAd.load();
        }

    }

    show() {
        if (this.rewardAd) {
            let p = this.rewardAd.show()
            p.then(function (result) {
                // 激励视频展示成功
                console.log(`show rewarded video ad success, result is ${result}`)
                this.pause()
            }).catch(function (error) {
                // 激励视频展示失败
                console.log(`show rewarded video ad failed, error is ${error}`)
            })
        }

    }



}
