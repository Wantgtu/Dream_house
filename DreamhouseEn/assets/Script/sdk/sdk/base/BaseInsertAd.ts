import BaseAd from "./BaseAd";
import { SDKState, ResultCallback, ResultState, ADName } from "../SDKConfig";
import SDKEventID from "../third/SDKEventID";
import JsNativeBridge from "../native/JsNativeBridge";

let CLASS_NAME = 'org/cocos2dx/javascript/AppActivity';

(<any>window).insertAdCallback = function () {
    console.log("js insertAdCallback...........");
    if (window["insertAd"].callback) {
        window["insertAd"].callback(ResultState.YES)
        window["insertAd"].callback = null;
    }
};

export default abstract class BaseInsertAd extends BaseAd {

    protected insertAd: any;

    open(func: ResultCallback) {
        this.callback = func;
        console.log(' BaseInsertAd open state ', this.state)
        window["insertAd"] = this;

        const adUnitId = this.channel.getParamValue(ADName.insert);
        console.log(adUnitId);
        JsNativeBridge.callStaticMethod(CLASS_NAME, "createInsertAd", adUnitId[0]);
    }

    preload(logicState: SDKState) {
        this.logicState = logicState;
        this.destroy();
        this.create();
        this.load(null);
    }

    onLoad() {
        console.log('NativeTest BaseInsertAd onLoad')
        this.setState(SDKState.loadSucess)
        if (this.callback) {
            this.callback(ResultState.YES)
            this.callback = null;
        }
        if (this.logicState == SDKState.open) {
            this.logicState = SDKState.close;
            this.show()
        }

    }

    show() {
        if (this.insertAd) {
            this.insertAd.show()
        }
    }

    load(func?: ResultCallback) {
        this.callback = func;
        if (this.insertAd) {
            this.insertAd.load();
        }
    }

    onError(err) {
        console.log('NativeTest BaseInsertAd onError')
        this.setState(SDKState.loadFail)
        if (this.callback) {
            this.callback(ResultState.NO)
            this.callback = null;
        }
        if (err && err.errCode) {
            this.channel.trackEvent(SDKEventID.insert_ad_error, { code: err.errCode })
        }

    }

    destroy() {
        if (this.insertAd) {
            this.insertAd.destroy()
            this.insertAd = null;
        }
    }


}