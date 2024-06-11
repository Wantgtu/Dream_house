
import BaseInsertAd from "../base/BaseInsertAd";
import { FunctionType, ResultCallback, SDKState } from "../SDKConfig";
import NativeInterstitialAd from "../native/ads/NativeInterstitialAd";


export default class MiMoInsertAd extends BaseInsertAd {

    protected insertAd: NativeInterstitialAd;
    open(func: ResultCallback) {
        this.callback = func;

        this.preload(SDKState.open);


    }
    create() {
        if (!this.insertAd) {
            this.insertAd = this.sdk.createInterstitialAd({
                adUnitId: this.adUnitID
            })
            this.insertAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.insertAd.onError(this.getFunc(FunctionType.onError))
        }
    }

}
