


import BaseInsertRewardAd from "../base/BaseInsertRewardAd";


export default class GoogleInsertRewardAd extends BaseInsertRewardAd {


    create() {
        if (!this.insertRewardAd) {
            this.insertRewardAd = this.sdk.createInsertRewardedVideoAd({
                adUnitId: this.adUnitID
            })
            this.insertRewardAd.onLoad(this.onLoad.bind(this))
            this.insertRewardAd.onError(this.onError.bind(this))
            this.insertRewardAd.onClose(this.onClose.bind(this))
        }
    }



}