import BaseChannel from "../base/BaseChannel";
import KwaiRewardAd from "./KwaiRewardAd";
import { ADName } from "../SDKConfig";


export default class KwaiChannel extends BaseChannel {

    init() {
        let cfg = this.cfg;
        let list = cfg[ADName.reward]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.rewardAd.push(new KwaiRewardAd(this, adId))
            }
        }
    }
}
