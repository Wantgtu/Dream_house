import BaseAd from "./BaseAd";
import { SDKState, ResultState, ResultCallback, ADName } from "../SDKConfig";
import SDKEvent from "../tools/SDKEvent";
import SDKEventID from "../third/SDKEventID";
import JsNativeBridge from "../native/JsNativeBridge";

let CLASS_NAME = 'org/cocos2dx/javascript/AppActivity';

(<any>window).insertRewardAdCallback = function () {
    console.log("js insertRewardAdCallback...........");
    if (window["insertRewardAd"].callback) {
        window["insertRewardAd"].callback(ResultState.YES)
        window["insertRewardAd"].callback = null;
    }
};

export default abstract class BaseInsertRewardAd extends BaseAd {
    protected insertRewardAd: any;

    open(callback: ResultCallback) {
        console.log(' BaseInsertRewardAd open state ', this.state)
        window["insertRewardAd"] = this;
        if (callback) {
            this.callback = callback;
        }
        const adUnitId = this.channel.getParamValue(ADName.insertReward);
        console.log(adUnitId);
        JsNativeBridge.callStaticMethod(CLASS_NAME, "createInsertRewardAd", adUnitId[0]);
    }

    reload(s: SDKState) {
        this.logicState = s;
        this.setState(SDKState.loading)
        this.destroy();
        this.create();
    }

    load() {
       
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
        
    }

    onLoad() {
        console.log('NativeTest 视频加载成功 ')
        this.setState(SDKState.loadSucess)
        if (this.logicState == SDKState.open) {
            this.show();

        }
    }

    destroy(): void {
       
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