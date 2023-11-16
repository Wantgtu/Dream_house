import BaseChannel from "../base/BaseChannel";
import SwanRewardAd from "./SwanRewardAd";
import SwanScreenshot from "./SwanScreenshot";
import SwanBannerAd from "./SwanBannerAd";
import { ADName } from "../SDKConfig";
import BaseSubPackage from "../base/BaseSubPackage";

export default class SwanChannel extends BaseChannel {


    init() {
        let cfg = this.cfg;
        this.sdk.onShow(() => {

        })

        this.sdk.onHide(() => {

        })
        if (this.sdk.createRewardedVideoAd) {
            let list = cfg[ADName.reward]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.rewardAd.push(new SwanRewardAd(this, adId))
                }
            }
        }
        this.subPackage = new BaseSubPackage(this)
        this.screenshot = new SwanScreenshot(this)
        if (this.sdk.createBannerAd) {
            let list = cfg[ADName.banner]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.bannerAd.push(new SwanBannerAd(this, adId))
                }
            }
        }
    }

    vibrateShort() {
        this.sdk.vibrateShort()
    }



    showToast(title: string) {
        this.sdk.showToast({ title: title })
    }
    //展示网络图片
    previewImage(imgUrl: string) {
        this.sdk.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: [imgUrl] // 需要预览的图片http链接列表
        })
    }

    navigateToMiniProgram(appID: string) {
        this.sdk.navigateToMiniProgram({
            appKey: appID,
            success: () => {
                console.log(' jump ok')
            },
            fail: () => {
                console.log(' jump fail')
            }
        })
    }


}