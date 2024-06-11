
import SDKManager from "../sdk/SDKManager";
import CMgr from "../channel-ts/CMgr";
import { BaseController } from "../../cfw/mvc";
import { GEvent } from "../../cfw/event";
import UIManager from "../../cfw/ui";
import { UIIndex } from "../../config/UIConfig";
import { ModuleManager } from "../../cfw/module";
import { ModuleID } from "../../config/ModuleConfig";
import ViewManager from "../../cfw/tools/ViewManager";

export default class OVNativeAdC extends BaseController {

    // static CLOSE_NATIVE: string = 'CLOSE_NATIVE'

    // static OPEN_NATIVE_AD: string = 'OPEN_NATIVE_AD'

    // static CLOSE_NATIVE_AD: string = 'CLOSE_NATIVE_AD'

    static FORCE_CLOSE: boolean = false;

    // protected static hideBannerCount: number = 0;


    // static isBannerState() {
    //     return this.hideBannerCount <= 0
    // }

    // static setBannerState(f: boolean) {
    //     if (!f) {
    //         this.hideBannerCount++;
    //         GEvent.instance().emit(OVNativeAdC.OPEN_NATIVE_AD)
    //     } else {
    //         this.hideBannerCount--;
    //         if (this.hideBannerCount <= 0) {
    //             this.hideBannerCount = 0;
    //             GEvent.instance().emit(OVNativeAdC.CLOSE_NATIVE_AD)
    //         }
    //     }
    // }

    intoLayer(isLimit: boolean = false) {


        if (isLimit) {

            if (!CMgr.helper.hasNativeLimit()) {
                console.log(' CMgr.helper.hasNativeLimit() ', CMgr.helper.hasNativeLimit())
                return;
            }
        }

        if (!SDKManager.getChannel().hasNativeAd()) {
            console.log('OVNativeAdC 没有广告  ')
            return;
        }
        // let flag = UIManager.instance().hasView('NativeAdView', UIIndex.AD_LAYER)

        // if (flag) {
        //     console.log('OVNativeAdC intoLayer  ', flag)
        //     return;
        // }
        if (!CMgr.helper.isVersion()) {
            return;
        }
        ViewManager.pushUIView({
            path: 'prefabs/NativeAdView',
            uiIndex: UIIndex.AD_LAYER,
            moduleID: ModuleID.nativeAd,
            model: null,
            controller: this,
        })
        // this.pushView('prefabs/NativeAdView', null, ModuleManager.getLoader(ModuleID.nativeAd), UIIndex.AD_LAYER)
    }

    showBanner() {
        if (!SDKManager.getChannel().hasNativeAd()) {
            console.log('OVNativeAdC showBanner 没有广告  ')
            return;
        }
        if (!CMgr.helper.isVersion()) {
            return;
        }
        // let flag = UIManager.instance().hasView('NativeBannerAdView', UIIndex.AD_LAYER)

        // if (flag) {
        //     console.log('OVNativeAdC intoLayer  ', flag)
        //     return;
        // }
        ViewManager.pushUIView({
            path: 'prefabs/NativeBannerAdView',
            uiIndex: UIIndex.AD_LAYER,
            moduleID: ModuleID.nativeAd,
            model: null,
            controller: this,
        })
        // this.pushView('prefabs/NativeBannerAdView', null, ModuleManager.getLoader(ModuleID.nativeAd), UIIndex.AD_LAYER)
    }

    hideBanner() {
        if (!CMgr.helper.isVersion()) {
            return;
        }
        if (!SDKManager.getChannel().hasNativeAd()) {
            console.log('OVNativeAdC showBanner 没有广告  ')
            return;
        }
        UIManager.instance().removeView('NativeBannerAdView', UIIndex.AD_LAYER)
    }

}
