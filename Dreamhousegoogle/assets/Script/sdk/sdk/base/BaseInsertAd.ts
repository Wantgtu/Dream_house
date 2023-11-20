import BaseAd from "./BaseAd";
import { SDKState, ResultCallback, ResultState } from "../SDKConfig";
import SDKEventID from "../third/SDKEventID";

export default abstract class BaseInsertAd extends BaseAd {

    protected insertAd: any;

    open(func: ResultCallback) {
        this.callback = func;
        if (this.state == SDKState.loadSucess) {
            this.show();
        } else {
            this.preload(SDKState.open);
        }

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