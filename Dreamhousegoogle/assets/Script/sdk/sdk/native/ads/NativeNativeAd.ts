import NativeAd from "./NativeAd";
import SDKEvent from "../../tools/SDKEvent";
import JsNativeBridge from "../JsNativeBridge";
import NativeName from "../NativeName";
let CLASS_NAME = ''
export default class NativeNativeAd extends NativeAd {
    constructor() {
        super();
        SDKEvent.instance().on(NativeName.nativeAdCallback, this.nativeAdCallback, this)
    }

    nativeAdCallback(id: string, result: number) {
        if (id == this.getAdUnitId()) {
            if (result == 1) {
                this.emitLoad(null)
            } else {
                this.emitError('加载失败')
            }
        }
    }
    create(data) {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.create, JSON.stringify(data))
    }

    reportAdShow(data) {
        JsNativeBridge.callStaticMethod(CLASS_NAME, "reportAdShow", JSON.stringify(data))
    }

    reportAdClick(data) {
        JsNativeBridge.callStaticMethod(CLASS_NAME, "reportAdClick", JSON.stringify(data))
    }

    load() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.load, this.getAdUnitId())
    }

    destroy() {
        SDKEvent.instance().off(NativeName.nativeAdCallback, this.nativeAdCallback, this)
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.destroy, this.getAdUnitId())
    }
}
