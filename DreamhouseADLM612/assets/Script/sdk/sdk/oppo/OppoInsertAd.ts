
import BaseInsertAd from "../base/BaseInsertAd";

/**
 * https://open.oppomobile.com/wiki/doc#id=10538
 */
export default class OppoInsertAd extends BaseInsertAd {

    protected insertAd: any;

    create() {
        console.log(' show insert ad ')
        if (!this.insertAd) {
            this.insertAd = this.sdk.createInsertAd({
                adUnitId: this.adUnitID
            });
            this.insertAd.onLoad(this.onLoad.bind(this))
            this.insertAd.onError(this.onError.bind(this))
        }
    }


}
