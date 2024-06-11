import ToastModel from "./ToastModel";

export default class TipModel extends ToastModel {


    callback: (r: number) => void;
    leftStr: string;
    rightStr: string;
    isShowAd: boolean = false;
    constructor(t: string, func: (r: number) => void, isShowAd: boolean) {
        super(t)
        this.isShowAd = isShowAd;
        this.callback = func;
    }

}
