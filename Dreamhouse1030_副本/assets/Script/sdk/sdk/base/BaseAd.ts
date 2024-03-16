import { SDKState, FunctionType, ResultCallback } from "../SDKConfig";
import BaseChannel from "./BaseChannel";
/**
 * 所有广告的父类
 * 
 */
export default abstract class BaseAd {
    //广告状态
    protected state: SDKState = SDKState.loading;
    //当前使用的广告ID
    protected adUnitID: string = ''
    //游戏逻辑状态
    protected logicState: SDKState = SDKState.open

    protected sdk: any;

    protected callback: any;

    protected channel: BaseChannel;
    protected funcMap: Function[] = []


    //创建时的时间戳
    protected initTime: number = 0;
    //开始展示的时间戳
    protected startTime: number = 0;
    //展示时长 毫秒
    protected showLong: number = 0
    //是否发生错误。
    protected error: boolean = false;

    constructor(channel: BaseChannel, id: string) {
        this.channel = channel;
        this.adUnitID = id;
        this.logicState = SDKState.close;
        this.state = SDKState.loadFail;
        this.sdk = channel.getSDK();
        this.funcMap[FunctionType.onLoad] = this.onLoad.bind(this)
        this.funcMap[FunctionType.onError] = this.onError.bind(this)
        this.funcMap[FunctionType.onClose] = this.onClose.bind(this)
        this.funcMap[FunctionType.onResize] = this.onResize.bind(this)
        this.funcMap[FunctionType.onHide] = this.onHide.bind(this)
        this.funcMap[FunctionType.onShow] = this.onShow.bind(this)
    }

    onShow() {

    }


    isState(s: number) {
        return this.state == s
    }




    isError() {
        return this.error;
    }
    getShowTime() {
        return this.showLong / 1000;
    }

    getAliveTime() {
        if (this.initTime == 0) {
            return 0;
        }
        let dis = (Date.now() - this.initTime) / 1000;
        return dis;
    }
    getInstance(): any {
        return null;
    }
    getFunc(t: FunctionType) {
        if (!this.funcMap[t]) {
            console.error(' get Func  t ', t)
        }
        return this.funcMap[t]
    }
    setFunc(type: FunctionType, func: Function) {
        this.funcMap[type] = func;
    }
    init() {

    }
    onHide() {

    }
    onResize(data: any) {

    }
    onLoad(param?: any) {

    }
    onError(err: any) {

    }

    onClose(res?: any) {

    }

    setState(s: SDKState): void {
        this.state = s;
    }

    getState(): SDKState {
        return this.state;
    }


    open(callback?: any): void {
        console.warn(' BaseAd open ==  ')
    }

    open2(index: number, callback?: Function): void {

    }

    abstract create(): void

    createTime() {
        this.initTime = Date.now()
    }

    close(): void {

    }


    protected visible: boolean = true;

    isVisible() {
        return this.visible;
    }
    setVisible(f: boolean) {
        this.visible = f;
        if (!f) {
            let dis = Date.now() - this.startTime;
            this.showLong += dis;
        } else {
            this.startTime = Date.now()
        }
    }

    hide() {

    }

    load(func?: any) {

    }

    setCallback(func: ResultCallback) {
        this.callback = func;
    }


    show() {

    }

    destroy() {

    }

    isOk() {
        return false
    }

}