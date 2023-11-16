import { BaseShare } from "../base/BaseShare";

import { ResultCallback, SDKState, ADName, ResultState } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";

export default class TTShare extends BaseShare {


    constructor(channel: BaseChannel, cfg: any[]) {
        super(channel, cfg);
        // GlobalEvent.instance().addEventListener(GlobalEvent.EVENT_SHOW, this.backGame, this)
        this.sdk.showShareMenu({
            success(res: any) {
                console.log("已成功显示转发按钮");
            },
            fail(err: any) {
                console.log("showShareMenu 调用失败", err.errMsg);
            },
            complete(res: any) {
                console.log("showShareMenu 调用完成");
            },
        });
        // this.sdk.updateShareMenu({
        //     withShareTicket: true
        // })
        this.sdk.onShareAppMessage(() => {

            let data = this.getData(0)
            data.success = () => {
                console.log('onShareAppMessage 分享成功');
            }
            data.fail = (e: any) => {
                console.log('分享失败', e);
            }
            console.log('data ', data)
            return data;
        })
    }
    protected getData(site: number): any {
        let data = this.data[site]
        return data;
    }



    share(index: number, func?: ResultCallback, videoPath?: string) {
        let data = this.data[index]
        console.log(' share data ', data, videoPath, 'index ', index)
        // let videoPath = this.channel.getRecorder().getVideoPath();
        if (videoPath && data.extra) {
            data.extra.videoPath = videoPath;
        }
        data.success = () => {
            console.log('分享成功');
            if (func) {
                func(ResultState.YES);
            }
            // this.shareSuccess();
        }
        data.fail = (e: any) => {
            console.log('分享失败');
            func(ResultState.NO);
            // ToastController.instance().showLayerByText("分享失败")
        }
        this.sdk.shareAppMessage(data)
        // console.log(' share data 222222', data)
    }

    getShareInfo(shareTicket: string, func: (result: any) => void) {
        if (shareTicket) {
            this.sdk.getShareInfo({
                shareTicket: shareTicket,
                success: () => {

                },
                fail: () => {

                }
            });
        }

    }


}
