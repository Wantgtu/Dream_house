import BaseAd from "../base/BaseAd";
import { SDKState, FunctionType } from "../SDKConfig";
/**
 * 九宫格广告
 */
export default class VivoBoxPortalAd extends BaseAd {

    protected boxPortalAd;


    protected image: string = ''
    protected marginTop: number = 200;
    setImageUrl(image: string) {
        this.image = image;
    }

    setMarginTop(t: number) {
        this.marginTop = t;
    }

    open(func: Function) {
        this.callback = func;
        this.logicState = SDKState.open;
        this.destroy();
        this.create();
    }
    create() {
        if (this.sdk.createBoxPortalAd) {
            this.boxPortalAd = this.sdk.createBoxPortalAd({
                posId: this.adUnitID,
                image: this.image,
                marginTop: this.marginTop,
            })
            this.boxPortalAd.onError(this.getFunc(FunctionType.onError))
            this.boxPortalAd.onShow(this.getFunc(FunctionType.onShow))
            this.boxPortalAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.boxPortalAd.onClose(this.getFunc(FunctionType.onClose))
            // 广告数据加载成功后展示

        } else {
            console.log('暂不支持互推盒子相关 API')
        }
    }

    onLoad() {
        console.log('互推盒子九宫格广告加载成功', this.logicState == SDKState.open)
        // boxPortalAd.show()
        this.setState(SDKState.loadSucess)
        if (this.logicState == SDKState.open) {
            this.show();
        }
    }

    onError(err) {
        console.log("盒子九宫格广告加载失败", err)
        this.setState(SDKState.loadFail)
    }
    onShow() {

    }

    onClose() {
        console.log('close this.boxPortalAd.isDestroyed ', this.boxPortalAd.isDestroyed)
        if (this.boxPortalAd.isDestroyed) {
            return
        }
        this.setState(SDKState.close)
    }

    show() {
        if (this.boxPortalAd) {
            this.boxPortalAd.show().then(function () {
                console.log('show success')
            }).catch(function (error) {
                console.log('show fail with:' + error.errCode + ',' + error.errMsg)
            })
        }
    }

    hide() {
        this.logicState = SDKState.close
        if (this.boxPortalAd) {
            this.boxPortalAd.hide().then(function () {
                console.log('hide success')
            }).catch(function (error) {
                console.log('hide fail with:' + error.errCode + ',' + error.errMsg)
            })
        }
    }

    close() {
        if (this.boxPortalAd != null) {
            this.boxPortalAd.isDestroyed = true
            this.boxPortalAd.destroy()
        }
    }

    destroy() {
        if (this.boxPortalAd) {
            this.boxPortalAd.offError(this.getFunc(FunctionType.onError))
            this.boxPortalAd.offShow(this.getFunc(FunctionType.onShow))
            this.boxPortalAd.offLoad(this.getFunc(FunctionType.onLoad))
            this.boxPortalAd.offClose(this.getFunc(FunctionType.onClose))
            this.boxPortalAd.destroy().then(function () {
                console.log('destroy success')
            }).catch(function (error) {
                console.log('destroy fail with:' + error.errCode + ',' + error.errMsg)
            })
        }
    }
}