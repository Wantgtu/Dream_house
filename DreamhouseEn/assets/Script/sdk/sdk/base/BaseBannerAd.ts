import BaseAd from "./BaseAd";
import { SDKState, SDKDir, ResultCallback, ResultState, ADName } from "../SDKConfig";
import SDKHelper from "../SDKHelper";
import SDKEventID from "../third/SDKEventID";
import JsNativeBridge from "../native/JsNativeBridge";

let CLASS_NAME = 'org/cocos2dx/javascript/AppActivity';

(<any>window).bannerAdCallback = function () {
    console.log("js bannerAdCallback...........");
    if (window["bannerAd"].callback) {
        window["bannerAd"].callback(ResultState.YES)
        window["bannerAd"].callback = null;
    }
};

export default class BaseBannerAd extends BaseAd {
    protected bannerAd: any

    protected height: number = 100;
    protected width: number = 300;

    //节点坐上角的坐标
    protected _x: number = 0;
    protected _y: number = 0;
    protected _dir: SDKDir = SDKDir.BOTTOM_MID;

    // init() {
    //     super.init();
    //     this._x = 0;
    //     this._y = 0;
    //     this._dir = SDKDir.BOTTOM_MID
    //     this.width = 128
    //     this.height = 100;
    // }
    getInstance(): any {
        return this.bannerAd;
    }
    setDir(dir: SDKDir) {
        this._dir = dir;
    }
    /**
     * 
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     */
    setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    setContentSize(w: number, h: number) {
        this.width = w;
        this.height = h;
    }

    create(): void {

    }



    preload(s: SDKState = this.logicState) {
        this.logicState = s;
        // console.log(' preload logitState ', this.logicState)
        // if (this.state != SDKState.loadSucess) {
        this.destroy();
        this.create();
        this.load();
        // }

    }

    open(func: ResultCallback): void {
        this.callback = func;
        console.log(' BaseBannerAd open state ', this.state)
        window["bannerAd"] = this;

        const adUnitId = this.channel.getParamValue(ADName.banner);
        console.log(adUnitId);
        JsNativeBridge.callStaticMethod(CLASS_NAME, "createBannerAd", adUnitId[0]);
    }

    getStyle(): any {
        let winSize = this.sdk.getSystemInfoSync();
        // console.log('SGBannerAd  getStyle ', this.width, this.height, this._dir)
        // console.log('SGBannerAd winSize  ', winSize)
        let x = 0
        let y = 0
        switch (this._dir) {
            case SDKDir.BOTTOM_MID:
                x = (winSize.windowWidth - this.width) / 2
                y = winSize.windowHeight - this.height;
                break;
            case SDKDir.UP_MID:
                x = (winSize.windowWidth - this.width) / 2
                y = 0
                break;
            case SDKDir.MID:
                x = (winSize.windowWidth - this.width) / 2
                y = (winSize.windowHeight - this.height) / 2;
                break;
            case SDKDir.RIGHT_MID:
                x = (winSize.windowWidth - this.width)
                y = (winSize.windowHeight - this.height) / 2;
                break;
            case SDKDir.LEFT_TOP:
                x = 0
                y = 0
                break;
            case SDKDir.BOTTOM_LEFT:
                x = 0
                y = winSize.windowHeight - this.height;
                break;
            case SDKDir.XY:
                x = this._x * winSize.windowWidth;
                y = this._y * winSize.windowHeight;
                break;
            case SDKDir.WHITE:
                x = -this.width + 1
                y = -this.height + 1

                break;
        }
        // console.log('SGBannerAd getStyle x  ', x, 'y ', y, this._dir, this.width, this.height)
        return {
            left: x,
            top: y,
            width: this.width,
            height: this.height,
        }
    }


    onError(err: any) {
        // console.log('banner onError', err)
        this.setState(SDKState.loadFail)
        if (this.callback) {
            this.callback(SDKState.loadFail)
            this.callback = null;
        }
        this.error = true;
        if (err && err.errCode)
            this.channel.trackEvent(SDKEventID.banner_event, { code: err.errCode })

    }
    onLoad(): void {
        this.setState(SDKState.loadSucess)
        console.log('NativeTest banner onLoad this.logicState', this.logicState)
        if (this.callback) {
            this.callback(SDKState.loadSucess)
            this.callback = null;
        }
        if (this.logicState == SDKState.open) {
            this.show();

        } else {

        }
    }

    onResize(data: any) {
        // console.log(' banner onResize ', data)
        this.width = data.width;
        this.height = data.height;
        this.updateSize()
    }

    updateSize() {
        let winSize = this.sdk.getSystemInfoSync();
        if (this.width != 0 && this.height != 0 && this.bannerAd) {
            switch (this._dir) {
                case SDKDir.BOTTOM_LEFT:
                    this.bannerAd.style.top = (winSize.windowHeight - this.height);
                    // this.bannerAd.style.left = (winSize.windowWidth - this.width) / 2;
                    this.bannerAd.style.left = 0;
                    break;
                case SDKDir.BOTTOM_MID:
                    this.bannerAd.style.top = (winSize.windowHeight - this.height);
                    this.bannerAd.style.left = (winSize.windowWidth - this.width) / 2;
                    break;
                case SDKDir.RIGHT_MID:
                    this.bannerAd.style.top = (winSize.windowHeight - this.height) / 2;
                    this.bannerAd.style.left = winSize.windowWidth - this.width;
                    break;
                case SDKDir.MID:
                    this.bannerAd.style.top = (winSize.windowHeight - this.height) / 2;
                    this.bannerAd.style.left = (winSize.windowWidth - this.width) / 2;
                    break;
                case SDKDir.TOP_MID:
                    this.bannerAd.style.top = 0;
                    this.bannerAd.style.left = (winSize.windowWidth - this.width) / 2;
                    break;
                case SDKDir.XY:
                    this.bannerAd.style.top = this._y * winSize.windowHeight;
                    this.bannerAd.style.left = this._x * winSize.windowWidth;
                    break;
            }

        }
    }
    isOk() {
        // console.log('Banner isOk  this.state ', this.state)
        return !SDKHelper.isNull(this.bannerAd) && this.state != SDKState.loading && this.state != SDKState.loadFail
    }
    show(): void {
        this.logicState = SDKState.open;
        if (this.bannerAd) {
            // this.setState(SDKState.open)
            this.bannerAd.show()
            if (this.callback) {
                this.callback(SDKState.open)
                this.callback = null;
            }
        }
    }

    hide(): void {
        console.log("Banner hide 。。。")
        if (this.bannerAd) {
            // this.setState(SDKState.close)
            this.bannerAd.hide();
            if (this.isVisible()) {
                this.setVisible(false)
            }
        }
        JsNativeBridge.callStaticMethod(CLASS_NAME, "hideBannerAd", "");
    }

    close(): void {
        this.logicState = SDKState.close
        this.hide()
    }

    load(): void {
        if (this.bannerAd) {
            // this.setState(SDKState.loading)
            this.bannerAd.load()
        }
    }

    destroy(): void {
        if (this.bannerAd) {
            this.state = SDKState.close
            this.bannerAd.destroy();
            this.bannerAd = null;
        }
    }
}