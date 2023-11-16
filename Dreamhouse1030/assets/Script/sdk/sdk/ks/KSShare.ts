import { BaseShare } from "../base/BaseShare";
import { ResultCallback, ResultState } from "../SDKConfig";


export default class KSShare extends BaseShare {

    protected getData(site: number): any {
        let data = this.data[site]
        return data;
    }
    share(index: number, func?: ResultCallback, videoPath?: string): void {
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
    }

}