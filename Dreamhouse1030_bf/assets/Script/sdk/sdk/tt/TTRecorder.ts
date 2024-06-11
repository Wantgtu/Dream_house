import BaseRecorder from "../base/BaseRecorder";
import { SDKState, ResultCallback, ResultState } from "../SDKConfig";

/**
 * https://microapp.bytedance.com/dev/cn/mini-game/develop/open-capacity/video-camera/request-method
 */
export default class TTRecorder extends BaseRecorder {

    protected isSave: boolean = true;

    protected callback: (r: number) => void = null;
    protected time: number = 0;
    init() {
        this.recorder = this.sdk.getGameRecorderManager();
        this.changeState(SDKState.close)
        this.recorder.onStart(res => {
            console.log('录屏开始', res);
            this.changeState(SDKState.start)
            // do somethine;
        })
        this.recorder.onStop(res => {
            // console.log(res.videoPath);
            // do somethine;

            console.log('录屏结束', res);
            this.clipVideo(res, [15, 0], (r: any, s: number) => {
                if (r) {
                    // if (this.isSave) {
                    this.videoPath = r.videoPath
                    // }
                } else {
                    this.videoPath = null;
                    this.c.showToast("录屏时间太短")
                }
                if (this.callback) {
                    this.callback(s);
                    this.callback = null;
                }
                this.changeState(SDKState.close)
            })
            this.changeState(SDKState.stop)
        })

        this.recorder.onResume(() => {
            console.log('TTRecorder onResume');
        })
        this.recorder.onPause(() => {
            console.log('TTRecorder onPuase');
        })

        this.recorder.onError((res) => {
            console.log('TTRecorder onPuase');
            this.c.showToast("录屏失败")
            this.videoPath = null;
            if (this.callback) {
                this.callback(0);
                this.callback = null;
            }
            this.changeState(SDKState.close)
        })
    }


    clipVideo(res, timeRange, func: (r: any, s: number) => void) {
        this.recorder.clipVideo({
            path: res.videoPath,
            timeRange: timeRange,
            success: (r) => {
                console.log('录屏成功 地址为： ' + r.videoPath);
                func(r, 1)
            },
            fail: () => {
                console.log('录屏失败 地址为： ');
                func(null, 0)
            },
            complete: () => {
                // func(null, 2)
            }
        })
    }


    recordClip(func) {
        this.recorder.recordClip({
            timeRange: [30, 0],
            success: (r) => {
                console.log(r.index)  // 裁剪唯一索引

                func(r)
            }
        })
    }

    start() {

        console.log(' ttRecoter start ', this.state == SDKState.start)
        if (this.state == SDKState.start) {
            return;
        }
        this.time = Date.now();
        // this.changeState(ItemState.GOT)
        this.recorder.start({
            duration: 30,
        })
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
        let t = Date.now();
        let dis = t - this.time;
        if (Math.floor(dis / 1000) <= 3) {
            callback(0)
            return;
        }
        // if (!this.isOpen()) {
        //     console.log('stop  this.isClose() ', this.isClose(), this.videoPath)
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



    publish(func: ResultCallback) {
        let data = this.data;
        console.log(' share data ', data, this.videoPath)
        // let videoPath = this.channel.getRecorder().getVideoPath();
        data.extra.videoPath = this.videoPath;
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
