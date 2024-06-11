import BaseChannel from "../base/BaseChannel";
import CSJBannerAd from "./CSJBannerAd";
import CSJInsertAd from "./CSJInsertAd";
import CSJRewardAd from "./CSJRewardAd";
import { ADName } from "../SDKConfig";
import NativeFileSystem from "../native/NativeFileSystem";

/**
 * V3.3.0.1
 */
export default class CSJChannel extends BaseChannel {


    init() {
        let cfg = this.cfg;
        let list = cfg[ADName.reward]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.rewardAd.push(new CSJRewardAd(this, adId))
            }
        }

        // list = cfg[ADName.banner]
        // if (list) {
        //     for (let index = 0; index < list.length; index++) {
        //         const adId = list[index];
        //         this.bannerAd.push(new CSJBannerAd(this, adId))
        //     }
        // }

        // list = cfg[ADName.insert]
        // if (list) {
        //     for (let index = 0; index < list.length; index++) {
        //         const adId = list[index];
        //         this.insertAd.push(new CSJInsertAd(this, adId))
        //     }
        // }

        // this.fileSystem = new NativeFileSystem(this)
    }

}
