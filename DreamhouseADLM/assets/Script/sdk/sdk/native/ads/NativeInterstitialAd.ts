import NativeAd from "./NativeAd";
import SDKEvent from "../../tools/SDKEvent";
import JsNativeBridge from "../JsNativeBridge";
import NativeName from "../NativeName";
let CLASS_NAME = 'sdk/bridge/InsertAdBridge'
export default class NativeInterstitialAd extends NativeAd {

    constructor() {
        super();
        SDKEvent.instance().on(NativeName.insertAdCallback, this.insertAdCallback, this)
    }

    insertAdCallback(id: string, result: number) {
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

    show() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.show, this.getAdUnitId())
    }

    load() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.load, this.getAdUnitId())
    }

    destroy() {
        SDKEvent.instance().off(NativeName.insertAdCallback, this.insertAdCallback, this)
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.destroy, this.getAdUnitId())
    }

}