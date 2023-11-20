
import BaseRewardAd from "../base/BaseRewardAd";
import { SDKState } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";
/**
 * 调用该方法创建的激励视频广告是一个单例
 * 默认是隐藏的，需要调用 RewardedVideoAd.show() 将其显示。
 * 每次创建自动加载
 * 创建激励视频广告组件。请通过 wx.getSystemInfoSync() 
 * 返回对象的 SDKVersion 判断基础库版本号后再使用该 API（小游戏端要求 >= 2.0.4，
 *  小程序端要求 >= 2.6.0）。
 * 调用该方法创建的激励视频广告是一个单例（小游戏端是全局单例
 * ，小程序端是页面内单例，在小程序端的单例对象不允许跨页面使用）。
 */
export default class WXRewardAd extends BaseRewardAd {

    constructor(c: BaseChannel, id: string) {
        super(c, id)
        this.reload(SDKState.close)
    }

    reload(s: SDKState) {
        // console.log('预加载视频', s)
        this.logicState = s;
        this.setState(SDKState.loading)
        // this.destroy(); //单例 不需要销毁
        this.create();
    }

    create(): void {

        let sdkVersion = this.sdk.getSystemInfoSync().SDKVersion;
        if (!this.rewardAd) {
            // console.log(' 不支持多例')
            this.rewardAd = this.sdk.createRewardedVideoAd({ adUnitId: this.adUnitID })
            this.rewardAd.onLoad(this.onLoad.bind(this))
            this.rewardAd.onError(this.onError.bind(this))
            this.rewardAd.onClose(this.onClose.bind(this))
        } else {
            //微信会在第一次创建的时候默认load一次。
            this.rewardAd.load();
        }

    }


}
