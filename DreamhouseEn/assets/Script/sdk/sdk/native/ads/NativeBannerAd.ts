import NativeAd from "./NativeAd";
import SdkEventList from "../../tools/SdkEventList";
import SDKEvent from "../../tools/SDKEvent";
import JsNativeBridge from "../JsNativeBridge";
import NativeName from "../NativeName";
let CLASS_NAME = 'sdk/bridge/BannerAdBridge'
export default class NativeBannerAd extends NativeAd {

    protected resizeListener: SdkEventList = new SdkEventList()

    layout: number = 0;
    width: number = 0;
    height: number = 0;

    constructor() {
        super();
        SDKEvent.instance().on(NativeName.bannerAdCallback, this.bannerAdCallback, this)
        SDKEvent.instance().on(NativeName.bannerResize, this.bannerResize, this)
    }

    bannerResize(ad: string, size) {
        if (ad == this.getAdUnitId())
            this.emitLoad(size)
    }

    bannerAdCallback(ad: string, result: number) {
        console.log('NativeTest bannerAdCallback result ', result)
        if (ad == this.getAdUnitId()) {
            if (result == 1) {
                this.emitLoad(null)
            } else {
                this.emitError('fail to load')
            }
        }

    }

    create(data: any) {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.create, JSON.stringify(data))
    }

    load() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.load, this.getAdUnitId())
    }

    hide() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.hide, this.getAdUnitId())
    }

    show() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.show, this.getAdUnitId())
    }

    destroy() {
        SDKEvent.instance().off(NativeName.bannerAdCallback, this.bannerAdCallback, this)
        SDKEvent.instance().off(NativeName.bannerResize, this.bannerResize, this)
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.destroy, this.getAdUnitId())

    }

    onResize(func: Function) {
        this.resizeListener.on(func)
    }

    offResize(func: Function) {
        this.resizeListener.off(func)
    }


    emitResize(data) {
        this.resizeListener.emit(data)
    }

}