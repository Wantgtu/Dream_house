import BaseRecorder from "../base/BaseRecorder";
import { SDKState, ResultCallback, ResultState } from "../SDKConfig";

/**
 * https://microapp.bytedance.com/dev/cn/mini-game/develop/open-capacity/video-camera/request-method
 */
export default class KSRecorder extends BaseRecorder {

    protected isSave: boolean = true;

    protected callback: (r: number) => void = null;
    // protected time: number = 0;
    protected timeID: number = 0;
    init() {
        this.recorder = this.sdk.getGameRecorder();
        this.changeState(SDKState.close)
        this.recorder.on('start', (res) => {
            console.log('录屏开始', res);
            this.changeState(SDKState.start)
        })
        this.recorder.on('stop', (res) => {
            this.videoPath = res.videoID;
            console.log(`videoID is ${res.videoID}`)
            console.log('录屏结束', res);
            this.changeState(SDKState.stop)
            this.changeState(SDKState.close)
            if (this.callback) {
                this.callback(1);
                this.callback = null;
            }

            // this.changeState(SDKState.stop)
        })

        this.recorder.on('resume', () => {
            console.log('TTRecorder onResume');
        })
        this.recorder.on('pause', () => {
            console.log('TTRecorder onPuase');
        })

        this.recorder.on('error', (res) => {
            console.log('TTRecorder onPuase');
            this.c.showToast("Screen recording failure")
            this.videoPath = null;
            this.changeState(SDKState.close)
            if (this.callback) {
                this.callback(0);
                this.callback = null;
            }

        })
    }

    start(time: number = 30) {

        console.log(' ttRecoter start ', this.state == SDKState.start)
        if (this.state == SDKState.start) {
            return;
        }
        // this.time = Date.now();
        // this.changeState(ItemState.GOT)
        this.recorder.start()
        this.timeID = setTimeout(() => {
            console.log(' chang')
            this.recorder.stop();
            this.timeID = 0;
        }, time * 1000);
    }


    stop(isSave: boolean = true, callback: (r: number) => void) {
        if (this.state != SDKState.start) {
            if (this.videoPath) {
                callback(1)
            } else {
                callback(0)
            }
            return;
        }
        if (this.timeID > 0) {
            clearTimeout(this.timeID)
        }
        // let t = Date.now();
        // let dis = t - this.time;
        // if (Math.floor(dis / 1000) <= 3) {
        //     callback(0)
        //     return;
        // }
        this.callback = callback;
        this.changeState(SDKState.loading)
        this.isSave = isSave;
        this.recorder.stop();
        console.log(' ttRecoter stop ')
    }

    pause() {
        this.recorder.pause();
    }

    resume() {
        this.recorder.resume();
    }

    publish(callback: ResultCallback) {
        let data = this.data;
        data.video = this.videoPath;
        data.callback = (error) => {
            if (error != null && error != undefined) {
                console.log("分享录屏失败: " + JSON.stringify(error));
                callback(ResultState.NO)
            } else {
                console.log("分享录屏成功");
                callback(ResultState.YES)
            }

        }
        this.recorder.publishVideo(
            data
        );
    }

}
