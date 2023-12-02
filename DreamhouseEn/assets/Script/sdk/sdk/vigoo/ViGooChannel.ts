import BaseChannel from "../base/BaseChannel";
import ViGooRewardAd from "./ViGooRewardAd";
import ViGooInsertAd from "./ViGooInsertAd";
import { ADName } from "../SDKConfig";

export default class ViGooChannel extends BaseChannel {

    init() {
        let cfg = this.cfg;
        let list = cfg[ADName.reward]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.rewardAd.push(new ViGooRewardAd(this, adId))
            }
        }

        list = cfg[ADName.insert]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.insertAd.push(new ViGooInsertAd(this, adId))
            }
        }
    }
}
