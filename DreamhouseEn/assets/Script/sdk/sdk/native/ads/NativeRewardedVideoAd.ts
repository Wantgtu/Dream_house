import NativeAd from "./NativeAd";
import SdkEventList from "../../tools/SdkEventList";
import SDKEvent from "../../tools/SDKEvent";
import JsNativeBridge from "../JsNativeBridge";
import NativeName from "../NativeName";
let CLASS_NAME = 'org/cocos2dx/javascript/AppActivity'
export default class NativeRewardedVideoAd extends NativeAd {

    protected closeListener: SdkEventList = new SdkEventList()

    constructor() {
        super();
        SDKEvent.instance().on(NativeName.rewardAdCallback, this.rewardAdCallback, this)
        SDKEvent.instance().on(NativeName.rewardAdClose, this.rewardAdClose, this)
    }

    create(data) {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.create, data)
    }


    load() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.load, this.getAdUnitId())
    }

    show() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.show, this.getAdUnitId())
    }

    destroy() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.destroy, this.getAdUnitId())
        SDKEvent.instance().off(NativeName.rewardAdCallback, this.rewardAdCallback, this)
        SDKEvent.instance().off(NativeName.rewardAdClose, this.rewardAdClose, this)
    }

    onClose(func: Function) {
        this.closeListener.on(func)
    }
    offClose(func: Function) {
        this.closeListener.off(func)
    }

    emitClose(data) {
        this.closeListener.emit(data)
    }

    rewardAdCallback(ad: string, result: number) {
        if (ad == this.getAdUnitId()) {
            console.log(' rewardAdCallback result ',result)
            if (result == 1) {
                this.emitLoad(null)
            } else {
                this.emitError('fail to load')
            }
        }

    }


    rewardAdClose(ad: string, result: number) {
        if (ad == this.getAdUnitId()) {
            this.emitClose({ isEnded: result })
        }

    }
}