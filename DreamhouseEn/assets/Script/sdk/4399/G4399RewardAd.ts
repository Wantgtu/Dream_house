import BaseRewardAd from "../sdk/base/BaseRewardAd";
import { ResultCallback, ResultState } from "../sdk/SDKConfig";

export default class G4399RewardAd extends BaseRewardAd {

    protected remain: number = 0;

    protected canPlayAd: boolean = false;

    protected sdk: any;

    open(callback: ResultCallback) {
        this.callback = callback;
        let play = this.canPlay()
        console.log(' play ==========  ', play)
        this.show();

    }

    create() {

    }



    show() {
        let self = this;
        /**
         * 此callback回调函数的形式
         *
         * @param obj  广告状态
         */
        function callback(obj: any) {
            console.log('代码:' + obj.code + ',消息:' + obj.message)
            if (obj.code === 10000) {
                console.log('开始播放')
                self.pause();

            } else if (obj.code === 10001) {
                console.log('播放结束')

                if (self.callback) {
                    self.callback(ResultState.YES)
                    self.updateRemainCount();
                    self.callback = null;
                }
                self.resume()
            } else {
                console.log('广告异常')
                if (self.callback) {
                    self.callback(ResultState.NO)
                    self.callback = null;
                }

                self.resume()
            }


        }

        /**
         * 播放全屏广告
         * @param callback   播放广告时的广告状态回调函数
         */
        if (this.sdk) {

            this.sdk.playAd(callback)
        }



    }





    canPlay() {
        console.log("canPlay 是否可播放广告", this.canPlayAd, "剩余次数", this.remain)
        return this.canPlayAd && this.remain > 0
    }

    hasSDK() {
        return this.sdk != undefined && this.sdk != null;
    }

    updateRemainCount() {
        if (this.remain > 0) {
            this.remain--;
        }
    }


    init() {
        // console.log("window['h5api']", window['h5api'])
        let self = this;
        function callback(data: any) {
            console.log("loadConfig 是否可播放广告", data.canPlayAd, "剩余次数", data.remain)
            self.remain = data.remain;
            self.canPlayAd = data.canPlayAd;
        }
        // SDKHelper.addScript("https://cdn.h5wan.4399sj.com/h5mini-2.0/dist/static/js/api.js", 'headscript', (s: ResultState) => {
        // if (s == ResultState.YES) {


        // window['h5api'].checkAPI();
        if (this.sdk) {
            this.sdk.canPlayAd(callback)
        }

        // }

        // })

    }
}