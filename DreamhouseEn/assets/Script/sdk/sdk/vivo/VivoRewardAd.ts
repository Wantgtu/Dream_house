
import BaseRewardAd from "../base/BaseRewardAd";
import { SDKState } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";
import SDKEvent from "../tools/SDKEvent";
/**
 * https://minigame.vivo.com.cn/documents/#/api/da/incentive-video-da
 * 注意： 第一次创建视频广告对象时，已自动加载一次广告，请勿重新加载
 * 注意：请在激励视频load成功（触发onLoad）后再调用show
 * 建议：激励视频加载失败后给用户直接发放奖励，或者展示一次其他类型广告并发放奖励
 */
export default class VivoRewardAd extends BaseRewardAd {

    constructor(c: BaseChannel, id: string) {
        super(c, id)
        this.reload(SDKState.close)
    }

    reload(s: SDKState) {
        this.logicState = s;
        this.setState(SDKState.loading)
        this.create();
    }

    show() {
        this.rewardAd.show().then(() => {
            console.log('激励视频广告展示完成');
            this.pause()
        }).catch((err: any) => {
            console.log('激励视频广告展示失败', JSON.stringify(err));
        })
    }


    create(): void {

        if (!this.rewardAd) {
            this.rewardAd = this.sdk.createRewardedVideoAd({ posId: this.adUnitID })
            this.rewardAd.onLoad(this.onLoad.bind(this))
            this.rewardAd.onError(this.onError.bind(this))
            this.rewardAd.onClose(this.onClose.bind(this))
            console.log(' 创建成功')
        } else {
            console.log(' 主动加载')
            this.rewardAd.load();

        }

    }

    destroy() {

    }

}