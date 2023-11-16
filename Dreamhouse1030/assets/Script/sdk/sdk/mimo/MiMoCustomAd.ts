
import BaseCustomAd from "../base/BaseCustomAd";
import { FunctionType, ResultCallback } from "../SDKConfig";
import NativeTemplateAd from "../native/ads/NativeTemplateAd";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class MiMoCustomAd extends BaseCustomAd {
    protected customAd:NativeTemplateAd;
    create() {
        let size = this.channel.getVisibleSize();
        if (!this.customAd) {
            this.customAd = this.sdk.createTemplateAd({
                adUnitId: this.adUnitID,
                sizeIndex: 1,
                width: size.width,
                height: size.height
            })
            this.customAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.customAd.onError(this.getFunc(FunctionType.onError))
        }

    }

    open(func: ResultCallback) {
        this.callback = func;
        this.destroy()
        this.create();
        this.load();
    }

    onLoad() {
        this.show();
    }

    onError() {

    }

    load() {
        if (this.customAd) {
            this.customAd.load();
        }
    }

    show() {
        if (this.customAd) {
            this.customAd.show();
        }
    }

    destroy() {
        if (this.customAd) {
            this.customAd.destroy();
            this.customAd = null;
        }
    }
}
