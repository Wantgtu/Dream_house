
import BaseInsertAd from "../base/BaseInsertAd";
import { ADName, SDKState } from "../SDKConfig";

export default class CocosInsertAd extends BaseInsertAd {

    protected insertAd: any;


    preload() {
        this.state = SDKState.loading;
        this.destroy()
        this.create()
    }


    create() {
        if (!this.insertAd) {
            this.insertAd =  this.sdk.createInterstitialAd(ADName.insert, this.adUnitID, 1);
            this.insertAd.onLoad(this.onLoad.bind(this))
            this.insertAd.onError(this.onError.bind(this))
        }

    }


}
