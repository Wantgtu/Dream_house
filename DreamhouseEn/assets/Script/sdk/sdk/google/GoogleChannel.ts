
import GoogleRewardAd from "./GoogleRewardAd";
import GoogleBannerAd from "./GoogleBannerAd";
import GoogleInsertAd from "./GoogleInsertAd";
import BaseChannel from "../base/BaseChannel";
import { ADName } from "../SDKConfig";
import NativeFileSystem from "../native/NativeFileSystem";
import GoogleInsertRewardAd from "./GoogleInsertRewardAd";

/**
 */
export default class GoogleChannel extends BaseChannel {



    init() {
        let cfg = this.cfg;
        let list = cfg[ADName.reward]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.rewardAd.push(new GoogleRewardAd(this, adId))
            }
        }
        list = cfg[ADName.insertReward]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.insertRewardAd.push(new GoogleInsertRewardAd(this, adId))
            }
        }
        list = cfg[ADName.banner]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.bannerAd.push(new GoogleBannerAd(this, adId))
            }
        }

        list = cfg[ADName.insert]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.insertAd.push(new GoogleInsertAd(this, adId))
            }
        }

        this.fileSystem = new NativeFileSystem(this)
    }

    getLang() {
        return 'en'
    }

}