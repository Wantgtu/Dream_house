import NativeAd from "./NativeAd";
import SDKEvent from "../../tools/SDKEvent";
import JsNativeBridge from "../JsNativeBridge";
import NativeName from "../NativeName";
let CLASS_NAME = 'sdk/bridge/SelfRenderAdBridge'
export default class NativeSelftRenderAd extends NativeAd {
    constructor() {
        super();
        SDKEvent.instance().on(NativeName.selfRenderAdCallback, this.selfRenderAdCallback, this)
    }
    selfRenderAdCallback(id: string, result: number) {
        if (id == this.getAdUnitId()) {
            if (result == 1) {
                this.emitLoad(null)
            } else {
                this.emitError('fail to load')
            }
        }
    }
    create(data) {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.create, JSON.stringify(data))
    }

    load() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.load, this.getAdUnitId())
    }

    show() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.show, this.getAdUnitId())
    }
    
    destroy() {
        SDKEvent.instance().off(NativeName.selfRenderAdCallback, this.selfRenderAdCallback, this)
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.destroy, this.getAdUnitId())
    }
}