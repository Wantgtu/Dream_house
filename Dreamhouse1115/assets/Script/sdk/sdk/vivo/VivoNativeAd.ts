

import BaseNativeAd from "../base/BaseNativeAd";
import VivoNativeAdItemModel from "./VivoNativeAdItemModel";

/**
 * https://minigame.vivo.com.cn/documents/#/api/da/native-ad
 */
export default class VivoNativeAd extends BaseNativeAd {


    protected loadFunc: Function;

    protected errorFunc: Function;

    getItemModel() {
        return new VivoNativeAdItemModel();
    }

    create() {
        // let self = this;
        // let loadFunc = function (res: any) {
        //     self.onLoad(res)
        // }
        // let errorFunc = function (err: any) {
        //     self.onError(err)
        // }


        if (this.nativeAd) {
            this.nativeAd.offError(this.errorFunc)
            this.nativeAd.offLoad(this.loadFunc)
        }

        // if (!this.nativeAd) {
        console.log(" VivoNativeAd create", this.adUnitID)
        this.nativeAd = this.sdk.createNativeAd({
            posId: this.adUnitID,
        });
        this.loadFunc = this.onLoad.bind(this)
        this.nativeAd.onLoad(this.loadFunc)

        this.errorFunc = this.onError.bind(this)
        this.nativeAd.onError(this.errorFunc)

        // }


    }

    destroy() {
    }
}