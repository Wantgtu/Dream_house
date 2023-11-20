import BaseNativeAd from "../base/BaseNativeAd";
import OppoNativeAdItemModel from "../oppo/OppoNativeAdItemModel";
import { FunctionType } from "../SDKConfig";


export default class MiMoNativeAd extends BaseNativeAd{
    protected instances: { [key: string]: any } = []
    getItemModel() {
        return new OppoNativeAdItemModel()
    }

    create() {
        console.log(" OppoNativeAd create", this.adUnitID)
        this.nativeAd = this.instances[this.adUnitID]
        if (!this.nativeAd) {
            this.nativeAd = this.sdk.createNativeAd({
                adUnitId: this.adUnitID,
            });
            this.nativeAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.nativeAd.onError(this.getFunc(FunctionType.onError))
            this.instances[this.adUnitID] = this.nativeAd
        }
    }
}