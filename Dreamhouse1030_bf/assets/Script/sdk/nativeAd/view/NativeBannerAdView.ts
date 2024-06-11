
import NativeAdItemView from "./NativeAdItemView";
import CMgr from "../../channel-ts/CMgr";
import { BaseView } from "../../../cfw/view";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NativeBannerAdView extends BaseView {

    @property(NativeAdItemView)
    nativeAd: NativeAdItemView = null;


    start() {
        this.refresh();
    }

    refresh() {
        let x = CMgr.helper.getNativeBannerRefreshTime();
        if (x > 0) {
            cc.tween(this.node).delay(x).call(() => {
                this.nativeAd.start()
                this.refresh()
            })
                .start();
        }

    }


}
