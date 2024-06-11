

import BaseAd from "../base/BaseAd";
import { SDKState, ADDir, FunctionType } from "../SDKConfig";
import BaseBlockAd from "../base/BaseBlockAd";


/**
 * 积木广告
 */
export default class QQBlockAd extends BaseBlockAd {


    preload(s: SDKState) {
        this.logicState = s;
        this.setState(SDKState.loading)
        this.destroy()
        this.create()
    }



    open(callback?: Function) {
        this.callback = callback;
        this.logicState = SDKState.open;
        console.log('QQBlockAd  open state ', this.state)
        if (this.state == SDKState.loadSucess) {
            this.show()
        } else {
            this.preload(SDKState.open)

        }
    }
    onResize(size: any) {

        let winSize = this.sdk.getSystemInfoSync();

        // console.log('QQBlockAd onResize  ', size, ' winSize ', winSize)
        console.log(size.width, size.height);
        if (size.width != 0 && size.height != 0) {
            this.updateSize()
        }
    }

    updateSize() {

        let winSize = this.sdk.getSystemInfoSync();
        console.log('QQBlockAd updateSize ', this._x, this._y)
        let left = winSize.windowWidth * this._x;
        let top = winSize.windowHeight * this._y;
        this.blackAd.style.left = left;
        this.blackAd.style.top = top// = this.getStyle()
    }

    getStyle() {
        let winSize = this.sdk.getSystemInfoSync();
        let left = winSize.windowWidth * this._x;
        let top = winSize.windowHeight * this._y;

        return {
            left: left,
            top: top
        }
    }

    onError(err: any) {
        console.log('QQBlockAd onError  ', err)
        this.setState(SDKState.loadFail)
    }

    onLoad() {
        console.log('QQBlockAd onLoad  ')

        this.setState(SDKState.loadSucess)
        if (this.logicState == SDKState.open) {
            this.show();
            this.logicState = SDKState.close
        }
    }

    create() {
        if (!this.blackAd) {
            this.blackAd = this.sdk.createBlockAd({
                adUnitId: this.adUnitID,
                style: this.getStyle(),
                size: this.count,
                orientation: this._dir,
            })
            this.blackAd.onResize(this.getFunc(FunctionType.onResize))
            this.blackAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.blackAd.onError(this.getFunc(FunctionType.onError))
        }
    }

    show() {
        this.setState(SDKState.open)
        if (this.blackAd) {
            this.blackAd.show()
        }


    }

    close() {
        console.log(' 积木广告 close  ok ', this.state)
        this.logicState = SDKState.close;

        this.hide()


    }

    hide() {

        if (this.blackAd) {
            console.log(' blckad hide ')
            this.blackAd.hide()
        }
    }

    destroy() {
        if (this.blackAd) {
            this.blackAd.destroy()
            this.blackAd = null;
        }
    }
}