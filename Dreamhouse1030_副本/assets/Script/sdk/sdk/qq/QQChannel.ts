import BaseChannel from "../base/BaseChannel";
import QQRewardAd from "./QQRewardAd";
import QQBannerAd from "./QQBannerAd";
import QQShare from "./QQShare";
import QQInsertAd from "./QQInsertAd";
import QQAppBoxAd from "./QQAppBoxAd";
import QQScreenshot from "./QQScreenshot";
import { ADName } from "../SDKConfig";
import BaseSubPackage from "../base/BaseSubPackage";
import QQBlockAd from "./QQBlockAd";
import UmaEvent from "../third/uma/UmaEvent";


export default class QQChannel extends BaseChannel {

    init() {
        let cfg = this.cfg;

        this.sdk.onShow(() => {

        })

        this.sdk.onHide(() => {

        })

        this.share = new QQShare(this, cfg[ADName.share]);

        if (this.sdk.createInterstitialAd) {
            let list = cfg[ADName.insert]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.insertAd.push(new QQInsertAd(this, adId))
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
                    this.rewardAd.push(new QQRewardAd(this, adId))
                }
            }
        }
        if (this.sdk.createBannerAd) {
            // this.bannerAd = new QQBannerAd(this)
            let list = cfg[ADName.banner]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.bannerAd.push(new QQBannerAd(this, adId))
                }
            }
        }

        if (this.sdk.createAppBox) {
            // this.appBoxAd = new QQAppBoxAd(this)
            let list = cfg[ADName.appbox]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.appBoxAd.push(new QQAppBoxAd(this, adId))
                }
            }
        }
        if (this.sdk.createBlockAd) {
            // this.appBoxAd = new QQAppBoxAd(this)
            let list = cfg[ADName.blockAd]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.blockAd.push(new QQBlockAd(this, adId))
                }
            }
        }
        this.screenshot = new QQScreenshot(this)

        this.subPackage = new BaseSubPackage(this)
        
        this.event = new UmaEvent()

    }

    exitApplication() {
        this.sdk.exitMiniProgram({
            success: () => { },
            fail: () => { },
            complete: () => { }
        })
    }


    showToast(title: string) {
        this.sdk.showToast({ title: title })
    }

    vibrateShort() {
        this.sdk.vibrateShort();
    }

    postMessage(message: any) {

    }



    previewImage(imgUrl: string) {
        this.sdk.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: [imgUrl] // 需要预览的图片http链接列表
        })
    }

    navigateToMiniProgram(appID: string) {
        this.sdk.navigateToMiniProgram({
            appId: appID,
            success: () => {

            }
        })
    }
}