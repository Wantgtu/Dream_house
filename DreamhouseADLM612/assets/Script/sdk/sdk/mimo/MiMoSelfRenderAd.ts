import BaseAd from "../base/BaseAd";
import { FunctionType, ResultCallback, ResultState, SDKState } from "../SDKConfig";
import NativeSelftRenderAd from "../native/ads/NativeSelftRenderAd";


export default class MiMoSelfRenderAd extends BaseAd {

    protected instance: NativeSelftRenderAd;
    protected click_switch:number = 0;
    protected close_num:number = 0;
    open(param: { callback: ResultCallback, click_switch: number,close_num:number }) {
        this.callback = param.callback;
        this.click_switch = param.click_switch;
        this.close_num = param.close_num;
        this.destroy();
        this.create();
        this.load();
    }
    create(): void {
        if (!this.instance) {
            this.instance = this.sdk.createSelfRenderAd({
                adUnitId: this.adUnitID,
                click_switch:this.click_switch,
                close_num: this.close_num

            })
            this.instance.onLoad(this.getFunc(FunctionType.onLoad))
            this.instance.onError(this.getFunc(FunctionType.onError))
        }
    }

    load(ls:SDKState = SDKState.open) {
        this.logicState = ls;
        if (this.instance) {
            this.instance.load();
        }


    }

    onLoad() {
        if(this.logicState == SDKState.open){
            this.instance.show();
        }
        if (this.callback) {
            this.callback(ResultState.YES);
            this.callback = null;
        }
    }

    onError() {
        if (this.callback) {
            this.callback(ResultState.NO);
            this.callback = null;
        }
    }

    destroy() {
        if (this.instance) {
            this.instance.destroy();
            this.instance = null;
        }

    }

}