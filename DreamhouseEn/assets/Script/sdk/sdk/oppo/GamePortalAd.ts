import BaseAd from "../base/BaseAd";
import { SDKState } from "../SDKConfig";

export default class GamePortalAd extends BaseAd {
    protected gamePortalAd: any
    open(func: Function) {
        this.callback = func;
        this.create()
        this.load()
    }


    create() {

        if (!this.gamePortalAd) {
            this.gamePortalAd = this.sdk.createGamePortalAd({
                adUnitId: this.adUnitID
            })
            this.gamePortalAd.onLoad(this.onLoad.bind(this))
            this.gamePortalAd.onClose(this.onClose.bind(this))
            this.gamePortalAd.onError(this.onError.bind(this))
        }

    }

    load() {
        this.gamePortalAd.load().then(() => {
        }).catch((error: any) => {
            // console.log('load fail with:' + error.errCode + ',' + error.errMsg)
            this.channel.showToast('Load too frequently')
        })
    }

    show() {
        this.gamePortalAd.show().then(function () {
            // console.log('show success')
            if (this.callback) {
                this.callback(SDKState.loadSucess)
            }
        }).catch(function (error) {
            console.log('show fail with:' + error.errCode + ',' + error.errMsg)
        })
    }

    onError(err: any) {
        // console.log(err)
        if (this.callback) {
            this.callback(SDKState.loadFail)
        }
    }


    onLoad() {
        // console.log('load success')
        this.show();
    }

    onClose() {
        if (this.callback) {
            this.callback(SDKState.close)
        }

        // console.log('互推盒子九宫格广告关闭')
    }

    destroy(): void {
        if (this.gamePortalAd) {
            this.gamePortalAd.destroy().then(function () {
                // console.log('destroy success')
            }).catch(function (error: any) {
                console.log('destroy fail with:' + error.errCode + ',' + error.errMsg)
            })
            this.gamePortalAd = null;
        }
    }
}
