
import BaseInsertAd from "../base/BaseInsertAd";
import { FunctionType } from "../SDKConfig";


export default class TTInsertAd extends BaseInsertAd {


  onClose() {
    console.log(' 插屏广告关闭')
  }

  create() {
    if (!this.insertAd) {
      this.insertAd = this.sdk.createInterstitialAd({
        adUnitId: this.adUnitID
      });
      if (this.insertAd) {
        this.insertAd.onLoad(this.getFunc(FunctionType.onLoad))
        this.insertAd.onError(this.getFunc(FunctionType.onError))
      }

    }

  }

}
