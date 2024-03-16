import CMgr from "../../channel-ts/CMgr";
import OVNativeAdC from "../OVNativeAdC";
import { SDKDir } from "../../sdk/SDKConfig";
import SDKManager from "../../sdk/SDKManager";
import { GEvent } from "../../../cfw/event";
import InsertAdMgr from "../../comp/InsertAdMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export class BannerComp extends cc.Component {


    start() {
        // [3]
        GEvent.instance().on(InsertAdMgr.OPEN_NATIVE_AD, this.hide, this)
        GEvent.instance().on(InsertAdMgr.CLOSE_NATIVE_AD, this.show, this)
        console.log(' CMgr.helper.getBannerWitch() ', CMgr.helper.getBannerWitch())
        this.show();
    }

    onDestroy() {
        GEvent.instance().off(InsertAdMgr.CLOSE_NATIVE_AD, this.show, this)
        GEvent.instance().off(InsertAdMgr.OPEN_NATIVE_AD, this.hide, this)
    }

    show() {
        if (!CMgr.helper.isVersion()) {
            return;
        }
        console.log(' OVNativeAdC.isBannerState() == ', InsertAdMgr.isBannerState())
        if (InsertAdMgr.isBannerState()) {
            console.log(' CMgr.helper.getBannerWitch() ', CMgr.helper.getBannerWitch())
            if (CMgr.helper.getBannerWitch() == 0) {
                SDKManager.getChannel().showBanner(0, SDKDir.BOTTOM_MID)
            } else {
                OVNativeAdC.instance().showBanner()
                SDKManager.getChannel().hideBanner()
            }
        }

    }

    hide() {

        SDKManager.getChannel().hideBanner(0)
        OVNativeAdC.instance().hideBanner();

    }

}