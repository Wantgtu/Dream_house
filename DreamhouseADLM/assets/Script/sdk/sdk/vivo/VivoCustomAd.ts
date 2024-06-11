
import { FunctionType, SDKDir, ResultCallback, ResultState } from "../SDKConfig";
import BaseCustomAd from "../base/BaseCustomAd";
export default class VivoCustomAd extends BaseCustomAd {



    create() {
        this.customAd = this.sdk.createCustomAd({
            posId: this.adUnitID,
            style: this.getStyle(),
        });
        this.customAd.onError(this.getFunc(FunctionType.onError));
        this.customAd.onClose(this.getFunc(FunctionType.onClose));
        this.customAd.onLoad(this.getFunc(FunctionType.onLoad));
        this.customAd.onHide(this.getFunc(FunctionType.onHide));
    }

    getSize() {
        let size = this.channel.getVisibleSize()
        // let r = size.height > size.width
        var defaultSize = (size.height / size.width) ? { height: 1280, width: 720 } : { width: 1280, height: 720 }
        let width = 720 * ((size.height / size.width) > (defaultSize.height / defaultSize.width) ? size.width / defaultSize.width : size.height / defaultSize.height);
        return width;
    }
    getStyle() {
        let r = 720 / 525;
        let sys = this.sdk.getSystemInfoSync()
        this.width = this.getSize();
        this.height = this.width / r;
        console.log(' r ', r, ' sys.screenWidth  ', sys.screenWidth, ' width ', this.width, ' height ', this.height)
        let size = this.channel.getVisibleSize()
        switch (this._dir) {
            case SDKDir.MID:
                return {
                    left: (size.width - this.width) / 2 * this.channel.getClientScaleX(),
                    top: (size.height - this.height) / 2 * this.channel.getClientScaleY()
                }
            case SDKDir.BOTTOM_MID:
                return {
                }
            default:
                return {
                }

        }

    }
    open(func: ResultCallback) {
        this.callback = func;
        this.destroy()
        this.create();
        this.show();
    }

    show() {
        if (this.customAd) {
            this.customAd.show().then(() => {
                console.log('原生模板广告展示完成');
                if (this.callback) {
                    this.callback(ResultState.YES)
                    this.callback = null;
                }
            }).catch((err) => {
                console.log('原生模板广告展示失败', JSON.stringify(err));
                if (this.callback) {
                    this.callback(ResultState.NO)
                    this.callback = null;
                }
            })

        }
    }

    onError(err: any) {
        console.log("原生模板广告加载失败", err);
        if (this.callback) {
            this.callback(ResultState.NO)
            this.callback = null;
        }
    }

    destroy() {
        if (this.customAd) {
            this.customAd.offError(this.getFunc(FunctionType.onError));
            this.customAd.offClose(this.getFunc(FunctionType.onClose));
            this.customAd.offLoad(this.getFunc(FunctionType.onLoad));
            this.customAd.offHide(this.getFunc(FunctionType.onHide));
            this.customAd.destroy();
        }
    }

    close() {
        if (this.customAd) {
            this.customAd.hide()
        }
    }
}