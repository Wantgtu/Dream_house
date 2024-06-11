import BaseChannel from "../base/BaseChannel";
import { ADName } from "../SDKConfig";
import KSRewardAd from "./KSRewardAd";
import KSInsertAd from "./KSInsertAd";
import KSShare from "./KSShare";
import KSRecorder from "./KSRecorder";


export default class KSChannel extends BaseChannel {


    constructor(c: BaseChannel) {
        super(c)
        let cfg = this.cfg;

        this.sdk.onShow(() => {

        })

        this.sdk.onHide(() => {

        })

        if (this.sdk.createInterstitialAd) {
            let list = cfg[ADName.insert]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.insertAd.push(new KSInsertAd(this, adId))
                }
            }
            // this.insertAd = new QQInsertAd(this)
        }

        if (this.sdk.createRewardedVideoAd) {
            // this.rewardAd = new QQVideoAd(this)
            let list = cfg[ADName.reward]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.rewardAd.push(new KSRewardAd(this, adId))
                }
            }
        }

        this.share = new KSShare(this, cfg[ADName.share])
        this.recorder = new KSRecorder(this, cfg[ADName.recorder])
    }

    showToast(title: string) {
        this.sdk.showToast({ title: title })
    }
}
