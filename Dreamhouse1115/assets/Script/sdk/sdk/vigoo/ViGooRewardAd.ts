
import { ResultState, ResultCallback } from "../SDKConfig";
import BaseRewardAd from "../base/BaseRewardAd";


export default class ViGooRewardAd extends BaseRewardAd {


    open(callback: ResultCallback) {
        this.callback = callback;
        this.show();
    }

    create() {

    }

    show() {
        console.log(' ViGoo show ')
        this.sdk.ShowExcitationVideoAdv((ret: any) => {
            // ret.type = ‘1’表示播放失败
            console.log(' ViGoo show ret ', ret)
            console.log(' ViGoo show ret.type ', ret.type)
            const type = ret.type;
            switch (type) {
                case '1':
                    console.log('广告异常')
                    if (this.callback) {
                        this.callback(ResultState.NO)
                        this.callback = null;
                    }
                    break;
                case '2':
                    console.log('播放跳过')
                    if (this.callback) {
                        this.callback(ResultState.NO)
                        this.callback = null;
                    }
                    break;
                case '3':
                    console.log('播放结束')
                    if (this.callback) {
                        this.callback(ResultState.YES)
                        this.callback = null;
                    }
                    break;
                default:
                    if (this.callback) {
                        this.callback(ResultState.NO)
                        this.callback = null;
                    }
                    break;
            }
        });
    }
}