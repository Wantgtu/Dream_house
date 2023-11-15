
import BaseRewardAd from "../base/BaseRewardAd";
import { SDKState, FunctionType } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";

// import ToastController from "../../logic/toast/ToastController";
//https://open.oppomobile.com/wiki/doc#id=10537
//创建激励视频广告组件，全局单例，如果创建新的广告位 Ad 对象，会导致之前的 Ad 被销毁
export default class OppoRewardAd extends BaseRewardAd {

    create(): void {
        if (!this.rewardAd) {
            this.rewardAd = this.sdk.createRewardedVideoAd({ adUnitId: this.adUnitID })
            this.rewardAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.rewardAd.onError(this.getFunc(FunctionType.onError))
            this.rewardAd.onClose(this.getFunc(FunctionType.onClose))
            console.log(' 创建成功')
        } else {
            this.rewardAd.load();
        }

    }

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
        }).catch((err: any) => {
            console.log('激励视频广告展示失败', JSON.stringify(err));
        })
    }

    destroy() {

    }
}