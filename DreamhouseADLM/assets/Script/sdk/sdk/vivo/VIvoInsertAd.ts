
import BaseInsertAd from "../base/BaseInsertAd";
/**
 * https://minigame.vivo.com.cn/documents/#/api/da/interstitial-da
 * 插屏广告实例不能复用，每次需要重新加载时要重新create
 */
export default class VivoInsertAd extends BaseInsertAd {


    open() {
        this.destroy();
        this.create()
        this.show();
    }


    create() {

        console.log(' create insert ad ')
        if (!this.insertAd) {
            this.insertAd = this.sdk.createInterstitialAd({
                posId: this.adUnitID
            });
            this.insertAd.onLoad(this.onLoad.bind(this))
            this.insertAd.onError(this.onError.bind(this))
        }




    }


}