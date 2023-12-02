import { ResultCallback, SDKState } from "../SDKConfig";
import BaseChannel from "./BaseChannel";


export abstract class BaseShare {

    protected state: SDKState = SDKState.close;

    protected callback: ResultCallback = null

    protected channel: BaseChannel;

    protected data: any[];

    protected sdk: any;

    constructor(channel: BaseChannel, cfg: any[]) {
        this.channel = channel;
        this.data = cfg;
        this.sdk = channel.getSDK();
    }
    /**
     * 
     * @param title  分享标题
     * @param func 分享回调函数
     * @param videoPath 是否分享录屏 
     */
    abstract share(index: number, func?: ResultCallback, videoPath?: string): void

    shareWithUrl(index: number, url: string, func?: ResultCallback) {

    }

    getShareInfo(shareTicket: string, func: (result: any) => void) {
        if (shareTicket) {
            this.sdk.getShareInfo({
                shareTicket: shareTicket,
                success: (res: any) => {
                    func(res)
                },
                fail: () => {

                }
            });
        }

    }


}
