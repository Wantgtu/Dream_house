
import { FunctionType, SDKState, ADName } from "../SDKConfig";
import BaseCustomAd from "../base/BaseCustomAd";
import SDKHelper from "../SDKHelper";
import SDKEventID from "../third/SDKEventID";
// import SDKEventID from "../../third/SDKEventID";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class WXCustomAd extends BaseCustomAd {



    isOk() {
        // console.log('WXCustomAd isOk  this.state ', this.state)
        return !SDKHelper.isNull(this.customAd) && this.state != SDKState.loading && this.state != SDKState.loadFail
    }



    open() {
        // console.log('WXCustomAd this.state ', this.state, this.adUnitID)
        this.preload(SDKState.open)
        this.show()
    }

    load() {

        this.destroy();
        this.create()

    }

    updateSize() {
        let winSize = this.sdk.getSystemInfoSync();
        let left = winSize.windowWidth * this.rx;
        let top = winSize.windowHeight * this.ry;
        this.customAd.style.left = left;
        this.customAd.style.top = top;
    }

    getStyle() {

        let winSize = this.sdk.getSystemInfoSync();
        let left = winSize.windowWidth * this.rx;
        let top = winSize.windowHeight * this.ry;
        // let left = 0
        // let top = 0;
        return {
            left: left,
            top: top,
        }
    }

    create() {
        if (!this.customAd) {
            this.setState(SDKState.loading)
            this.customAd = this.sdk.createCustomAd({
                adUnitId: this.adUnitID,
                adIntervals: 30,
                style: this.getStyle(),
            })
            this.customAd.onLoad(this.getFunc(FunctionType.onLoad));
            this.customAd.onError(this.getFunc(FunctionType.onError));
            // this.instance.onHide(this.getFunc(FunctionType.onHide));
            this.customAd.onClose(this.getFunc(FunctionType.onClose));
        }
    }

    show() {

        if (this.customAd) {
            // this.setState(SDKState.open)
            this.customAd.show();
        } else {
            this.load()
            this.show()
        }
    }

    onClose() {
        // console.log('WXCustomAd onClose')
    }

    onError(err: any) {
        // console.log('WXCustomAd onError ', err)
        this.setState(SDKState.loadFail)
        // this.channel.showToast('广告拉取失败')
        if (err && err.errCode)
            this.channel.trackEvent(SDKEventID.custom_ad_error, { code: err.errCode })
    }

    onHide() {
        // console.log('WXCustomAd onHide')
    }

    onLoad() {
        // console.log('WXCustomAd onLoad ')
        this.setState(SDKState.loadSucess)
    }

    close() {
        this.hide();
    }

    hide() {


        if (this.customAd) {
            // console.log(' CustomAd hide', this.isShow())
            // if (this.isShow()) {
            if (this.customAd.hide)
                this.customAd.hide();
        }
    }

    isShow() {
        if (this.customAd) {
            return this.customAd.isShow()
        }
        return false;
    }

    destroy() {
        if (this.customAd) {
            this.customAd.offLoad(this.getFunc(FunctionType.onLoad))
            this.customAd.offError(this.getFunc(FunctionType.onError))
            // this.instance.offHide(this.getFunc(FunctionType.onHide))
            this.customAd.offClose(this.getFunc(FunctionType.onClose))
            this.customAd.destroy();
            this.customAd = null;
        }
    }
}
