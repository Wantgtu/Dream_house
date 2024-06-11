import BaseChannel from "../base/BaseChannel";
import { ADName } from "../SDKConfig";
import MiMoBannerAd from "./MiMoBannerAd";
import MiMoRewardAd from "./MiMoRewardAd";
import MiMoInsertAd from "./MiMoInsertAd";
import MiMoCustomAd from "./MiMoCustomAd";
import MiMoNativeAd from "./MiMoNativeAd";
import MiMoSelfRenderAd from "./MiMoSelfRenderAd";
import MiMoLogin from "./MiMoLogin";


export default class MiMoChannel extends BaseChannel {

    init() {
        let cfg = this.cfg;
        let list = cfg[ADName.reward]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.rewardAd.push(new MiMoRewardAd(this, adId))
            }
        }

        list = cfg[ADName.banner]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.bannerAd.push(new MiMoBannerAd(this, adId))
            }
        }

        list = cfg[ADName.insert]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.insertAd.push(new MiMoInsertAd(this, adId))
            }
        }

        list = cfg[ADName.customAd]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.customAd.push(new MiMoCustomAd(this, adId))
            }
        }   
        list = cfg[ADName.selfrender]
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const adId = list[index];
                this.selfRender.push(new MiMoSelfRenderAd(this, adId)) 
            }
        }        

        this.loginMgr = new MiMoLogin(this)
    }

    exitApplication(){
        this.sdk.exitApplication()
    }

    initAd(){
        this.sdk.initAd()
    }
}
