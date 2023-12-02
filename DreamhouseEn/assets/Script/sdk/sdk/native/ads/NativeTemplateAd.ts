import NativeAd from "./NativeAd";
import SDKEvent from "../../tools/SDKEvent";
import JsNativeBridge from "../JsNativeBridge";
import NativeName from "../NativeName";
let CLASS_NAME = 'sdk/bridge/TemplateAdBridge'
export default class NativeTemplateAd extends NativeAd {

    constructor() {
        super();
        SDKEvent.instance().on(NativeName.templateAdCallback, this.templateAdCallback, this)
    }

    templateAdCallback(id: string, result: number) {
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

    show() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.show, this.getAdUnitId())
    }

    load() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.load, this.getAdUnitId())
    }

    destroy() {
        SDKEvent.instance().off(NativeName.templateAdCallback, this.templateAdCallback, this)
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.destroy, this.getAdUnitId())
    }

}