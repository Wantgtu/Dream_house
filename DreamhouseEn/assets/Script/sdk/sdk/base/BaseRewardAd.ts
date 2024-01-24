import BaseAd from "./BaseAd";
import { SDKState, ResultState, ResultCallback, ADName } from "../SDKConfig";
import SDKEvent from "../tools/SDKEvent";
import SDKEventID from "../third/SDKEventID";
import JsNativeBridge from "../native/JsNativeBridge";

let CLASS_NAME = 'org/cocos2dx/javascript/AppActivity';

(<any>window).rewardAdCallback = function () {
    console.log("js rewardAdCallback...........");
    if (window["rewardAd"].callback) {
        window["rewardAd"].callback(ResultState.YES)
        window["rewardAd"].callback = null;
    }
};

export default abstract class BaseRewardAd extends BaseAd {
    protected rewardAd: any;

    open(callback: ResultCallback) {
        console.log(' BaseRewardAd open state ', this.state)
        window["rewardAd"] = this;
        if (callback) {
            this.callback = callback;
        }
        const adUnitId = this.channel.getParamValue(ADName.reward);
        console.log(adUnitId);
        JsNativeBridge.callStaticMethod(CLASS_NAME, "createRewardAd", adUnitId[0]);
    }

    reload(s: SDKState) {
        this.logicState = s;
        this.setState(SDKState.loading)
        this.destroy();
        this.create();
    }

    load() {
        if (this.rewardAd) {
            this.rewardAd.load();
        }
    }

    onError(err: any) {
        console.log('NativeTest 视频加载失败 ', err)
        this.setState(SDKState.loadFail)
        if (this.callback) {
            this.callback(ResultState.NO);
            this.callback = null;
        }
        this.channel.showToast('Video loading failure')
        if (err && err.errCode)
            this.channel.trackEvent(SDKEventID.vedio_ad_error, { code: err.errCode })
    }

    show() {
        this.setState(SDKState.open)
        this.logicState = SDKState.close;
        if (this.rewardAd) {
            console.log(' 展示激励视频 ')
            this.rewardAd.show().then(() => {
                this.setState(SDKState.open)
                console.log(' 激励视频展示成功 ')
                this.pause()
            }).catch(() => {
                // 失败重试
                console.log(' show  激励视频 播放失败重试')
                this.rewardAd.load()
                    .then(() => {
                        this.rewardAd.show()
                        this.setState(SDKState.open)
                        this.pause()
                    })
                    .catch((err: any) => {
                        // console.log(' 激励视频重试失败 err ', err)
                        this.setState(SDKState.loadFail)
                        this.channel.showToast('Video loading failure')
                        if (err && err.errCode)
                            this.channel.trackEvent(SDKEventID.vedio_ad_error, { code: err.errCode })
                        // callback(false)
                        // this.channel.showShare(0, this.callback)

                    })
            })
        }
    }

    onLoad() {
        console.log('NativeTest 视频加载成功 ')
        this.setState(SDKState.loadSucess)
        if (this.logicState == SDKState.open) {
            this.show();

        }

        // sel
    }

    destroy(): void {
        if (this.rewardAd) {
            this.rewardAd.destroy();
            this.rewardAd = null;
        }
    }

    onClose(res: any) {
        console.log('NativeTest onClose ', res)
        this.setState(SDKState.close)
        if (res && res.isEnded || res === undefined) {
            // console.log('视频结束关闭 ')
            // 正常播放结束，可以下发游戏奖励
            if (this.callback) {
                this.callback(ResultState.YES)
                this.callback = null;
            }

        } else {
            // 播放中途退出，不下发游戏奖励
            // console.log('视频中途关闭 ')
            if (this.callback) {
                this.callback(ResultState.NO);
                this.callback = null;
                // ToastController.instance().intoLayer('ui.not_finish');
            }

        }
        this.resume()
    }

    pause() {
        // console.warn(' BaseReward Ad  pause')
        SDKEvent.instance().emit(SDKEvent.REWARD_AD_OPEN)
    }

    resume() {
        // console.warn(' BaseReward Ad  resume')
        SDKEvent.instance().emit(SDKEvent.REWARD_AD_CLOSE)
    }
}