import { SDKState, ResultCallback } from "../SDKConfig";
import BaseChannel from "./BaseChannel";
import SdkEventList from "../tools/SdkEventList";



export default class BaseRecorder extends SdkEventList {


    protected recorder: any;

    protected videoPath: string = null;

    protected state: SDKState = SDKState.close

    protected c: BaseChannel;
    protected sdk: any;
    protected data: any;
    constructor(c: BaseChannel, cfg: any) {
        super()
        this.c = c
        this.sdk = c.getSDK()
        this.data = cfg;
        this.init();
    }
    init() {

    }
    start(obj?: any) { }
    pause() { }
    resume() { }
    stop(isSave: boolean = true, callback: (r: number) => void) {

    }
    //记录精彩的视频片段
    recordClip(object: any) { }

    changeState(s: SDKState) {
        this.state = s;
        this.emit(this.state)
    }

    getVideoPath() {
        return this.videoPath;
    }

    clear() {
        this.videoPath = null;
    }

    isOpen() {
        return this.state == SDKState.open;
    }

    isClose() {
        return this.state == SDKState.close;
    }

    getState() {
        return this.state;
    }

    publish(callback: ResultCallback) { }

}
