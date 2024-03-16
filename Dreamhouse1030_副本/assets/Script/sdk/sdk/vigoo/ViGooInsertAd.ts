
import BaseInsertAd from "../base/BaseInsertAd";

export default class ViGooInsertAd extends BaseInsertAd {

    open() {
        this.show();
    }


    create() {

    }

    show() {
        console.log(' ViGooInsertAd show ', this.adUnitID)
        this.sdk.ShowScreenVideo(this.adUnitID, (ret: any) => {
            // ret.type = ‘1’表示播放失败
            console.log(' ViGooInsertAd show  ret.type  ', ret.type)
            const type = ret.type;
            if (type == 1) {

            } else {

            }

        });
    }
}