
import BaseAd from "../base/BaseAd";
import { SDKState, FunctionType } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";

export default class QQAppBoxAd extends BaseAd {

    protected appBoxAd: any;

    constructor(c: BaseChannel, id: string) {
        super(c, id)
        this.preload(SDKState.close)
    }

    preload(s: SDKState) {
        this.logicState = s;
        console.log('QQAppBoxAd preload ====================')
        this.destroy()
        this.create()
        this.load()
    }

    open(call: Function) {
        this.callback = call;
        console.log('QQAppBoxAd open ')
        // this.destroy()

        if (this.state == SDKState.loadSucess) {
            this.show()
        } else {
            this.logicState = SDKState.open
            this.load()
        }


    }

    onClose() {
        console.log(' AppBox onClose ')
        this.setState(SDKState.close)
        if (this.callback) {
            this.callback()
        }
        this.load()
    }

    create() {
        if (!this.appBoxAd) {
            this.appBoxAd = this.sdk.createAppBox({ adUnitId: this.adUnitID })
            this.appBoxAd.onClose(this.getFunc(FunctionType.onClose))
        }
    }

    load() {

        console.log("QQAppBoxAd  load 1111")
        if (this.appBoxAd) {
            console.log("QQAppBoxAd  load ")
            this.appBoxAd.load().then(() => {
                console.log("QQAppBoxAd  load 2222 ")
                this.setState(SDKState.loadSucess)
                // this.show()
            }).catch((err: any) => {
                console.log("QQAppBoxAd  load err", err)
            })
        } else {
            console.log(' instance is null ')
        }
    }

    show() {
        console.log("QQAppBoxAd  show 1111")
        if (this.appBoxAd) {

            this.appBoxAd.show().then(() => {
                console.log("QQAppBoxAd  show ")
                // this.load()
            }).catch((err: any) => {
                console.log("QQAppBoxAd  show ", err)
                this.load()
            })
        }
    }

    destroy() {
        if (this.appBoxAd) {
            this.appBoxAd.destroy()
            this.appBoxAd = null;
        }
    }

}