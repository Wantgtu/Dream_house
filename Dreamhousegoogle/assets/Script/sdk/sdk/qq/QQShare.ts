import { BaseShare } from "../base/BaseShare";
import { ResultCallback, ADName, SDKState, ResultState } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";

export default class QQShare extends BaseShare {

    protected time: number = 0;
    constructor(channel:BaseChannel, cfg: any[]) {
        super(channel, cfg);
        this.sdk.showShareMenu({
            withShareTicket: true,
        });

        this.sdk.updateShareMenu({
            withShareTicket: true
        })
        this.sdk.onShow(() => {
            this.backGame()
        })
        this.sdk.onShareAppMessage(() => {
            // 用户点击了“转发”按钮
            return this.getData(0)
        })
    }



    share(site: number, func?: ResultCallback) {
        this.callback = func;
        this.sdk.shareAppMessage(this.getData(site))
        this.state = SDKState.open;
        this.time = Date.now();
    }

    protected getData(site: number): any {
        let data = this.data[site]
        return data;
    }



    protected backGame() {

        if (this.state == SDKState.open) {
            this.state = SDKState.close;
            if (this.callback) {
                let disTime = Date.now() - this.time
                if (disTime >= 3000) {
                    this.callback(ResultState.YES);
                } else {
                    this.callback(ResultState.NO);
                }
                this.callback = null;
            }
        }
    }


}
