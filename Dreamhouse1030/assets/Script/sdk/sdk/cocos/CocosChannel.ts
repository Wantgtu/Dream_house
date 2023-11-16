import BaseChannel from "../base/BaseChannel";
import { ADName } from "../SDKConfig";
import CocosBannerAd from "./CocosBannerAd";
import CocosInsertAd from "./CocosInsertAd";
import CocosRewardAd from "./CocosRewardAd";
import CocosFileSystem from "./CocosFileSystem";

export default class CocosChannel extends BaseChannel {

    init() {
        let cfg = this.cfg;
        window['AdSDK'].init();
        let list = cfg[ADName.reward]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.rewardAd.push(new CocosRewardAd(this, adId))
            }
        }
        list = cfg[ADName.banner]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.bannerAd.push(new CocosBannerAd(this, adId))
            }
        }

        list = cfg[ADName.insert]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.insertAd.push(new CocosInsertAd(this, adId))
            }
        }
        this.fileSystem = new CocosFileSystem(this.getSDK())
    }

    getFlipY() {
        return -1;
    }
    // createCanvas() {
    //     return window._canvas;
    // }
}
