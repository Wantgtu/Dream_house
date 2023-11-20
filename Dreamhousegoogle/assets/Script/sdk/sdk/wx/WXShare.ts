import { BaseShare } from "../base/BaseShare";

import { ResultCallback, SDKState, ResultState, ADName } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";
/**
 * auth 游子陈
 */
export default class WXShare extends BaseShare {
    //由于微信无法得到分享结果，所以以时间来判断是否成功。
    protected time: number = 0;

    protected callback: ResultCallback;

    constructor(channel: BaseChannel, cfg: any[]) {
        super(channel, cfg);

        this.sdk.showShareMenu({
            withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
        });

        this.sdk.updateShareMenu({
            withShareTicket: true
        })

        this.sdk.onShareAppMessage(() => {
            // 用户点击了“转发”按钮
            return this.getData(0)
        })
        this.sdk.onShow(() => {
            this.backGame()
        })
    }


    share(index: number, func?: ResultCallback) {
        this.callback = func;
        let data = this.getData(index)
        this.sdk.shareAppMessage(data)
        this.state = SDKState.open;
        this.time = Date.now();
    }

    shareWithUrl(index: number, url: string, func?: ResultCallback) {
        this.callback = func;
        let data = this.getData(index)
        data[ADName.imageUrl] = url;
        this.sdk.shareAppMessage(data)
        this.state = SDKState.open;
        this.time = Date.now();
    }

    protected getData(index: number): any {
        let data = this.data[index]
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
