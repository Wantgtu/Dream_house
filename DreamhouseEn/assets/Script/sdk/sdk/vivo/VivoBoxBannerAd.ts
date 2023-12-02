import BaseAd from "../base/BaseAd";
import { FunctionType, SDKState } from "../SDKConfig";

/**
 * https://minigame.vivo.com.cn/documents/#/api/ad/box-ad?id=boxbannerad-qgcreateboxbanneradobject
 * 横幅广告
 */
export default class VivoBoxBannerAd extends BaseAd {

    protected boxBannerAd: any = null;
    open(func: Function) {
        this.callback = func;
        this.destroy();
        this.create();
        this.show();
    }

    create() {
        if (this.sdk.createBoxBannerAd) {
            this.boxBannerAd = this.sdk.createBoxBannerAd({
                posId: this.adUnitID,
                marginBottom: 100
            })
            this.boxBannerAd.onError(this.getFunc(FunctionType.onError))
            this.boxBannerAd.onClose(this.getFunc(FunctionType.onClose))
            // 广告数据加载成功后展示
            // this.boxBannerAd.show().then(function () { console.log('show success') })
        } else {
            console.log('暂不支持互推盒子相关 API')
        }
    }

    onClose() {
        if (this.callback) {
            this.callback(SDKState.close)
        }
    }

    show() {
        if (this.boxBannerAd) {
            this.boxBannerAd.show().then(() => {
                console.log('show success')
                if (this.callback) {
                    this.callback(SDKState.loadSucess)
                }
            });
        }
    }

    onError(err) {
        console.log("盒子横幅广告加载失败", err)
        this.channel.showToast('Box AD loading failed!')
        if (this.callback) {
            this.callback(SDKState.loadFail)
        }
    }

    hide() {
        this.destroy();
    }

    destroy() {
        if (this.boxBannerAd != null) {
            this.boxBannerAd.destroy()
            this.boxBannerAd = null;
        }
    }
}