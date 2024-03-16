import QQChannel from "./QQChannel";
import BaseBannerAd from "../base/BaseBannerAd";
import { SDKState, SDKDir, ResultCallback, ADName } from "../SDKConfig";
import QQBannerAd from "./QQBannerAd";

export default class QQChannel2 extends QQChannel {


    // protected list: BaseBannerAd[] = []


    protected pos: number = 0;

    protected curBanner: number = 0;

    protected max: number = 3;

    protected logicState: SDKState = SDKState.open;

    private add() {
        // this.bannerAd.push()
        let list = this.cfg[ADName.banner]
        let adId = list[this.pos++]
        let banner = new QQBannerAd(this, adId)
        this.bannerAd.push(banner)
        if (this.pos >= this.max) {
            this.pos = 0;
        }
    }

    refreshBanner() {
        if (this.curBanner >= 0 && this.bannerAd.length > this.curBanner) {
            this.bannerAd[this.curBanner].setVisible(false)
        }
        if (this.bannerAd.length <= 5) {
            this.add()
        }
        this.clear();

        if (this.logicState == SDKState.open) {
            this.showBanner()
        }

    }

    private clear() {

        let d = []
        for (let i = 0; i < this.bannerAd.length; i++) {
            const element = this.bannerAd[i];
            if (element.isError()) {
                d.push(element)
            }
        }
        if (this.bannerAd.length > 5) {
            for (let i = 0; i < this.bannerAd.length; i++) {
                const element = this.bannerAd[i];
                if (element.getAliveTime() > 30 || element.getShowTime() > 5 || element.isError()) {
                    d.push(element)
                }
            }
        }
        if (d.length > 0) {
            while (d.length > 0) {
                let e = d.shift();
                let idx = this.bannerAd.indexOf(e)
                if (idx >= 0) {
                    this.bannerAd[idx].close()
                    this.bannerAd[idx].destroy()
                    this.bannerAd.splice(idx, 1)
                }
            }
        }



    }

    hideBanners() {
        for (let index = 0; index < this.bannerAd.length; index++) {
            const element = this.bannerAd[index];
            element.hide()
        }
    }

    getIndex() {
        let i = -1;
        let showTime = 0;
        console.log('getIndex this.list.length ', this.bannerAd.length)
        for (let index = 0; index < this.bannerAd.length; index++) {
            const element = this.bannerAd[index];
            let ttime = element.getShowTime();
            console.log('getAliveTime   ', element.getAliveTime(), 'ttime   ', ttime)
            if (i == -1) {
                i = index;
                showTime = ttime
            } else {
                if (ttime < showTime) {
                    i = index;
                    showTime = ttime;
                }
            }
        }
        return i;
    }

    showBanner(state: number = 0, dir: SDKDir = SDKDir.BOTTOM_MID, func?: ResultCallback) {
        let i = this.getIndex()
        console.log('showBanner i ', i, this.curBanner)
        this.hideBanners()
        this.curBanner = i
        this.logicState = state
        if (i >= 0) {
            super.showBanner(i, dir, func)
        } else {
            console.warn('showBanner i < 0')
        }

        // this.list[0].show();
    }

    setLogicState(s: SDKState) {
        this.logicState = s;
    }

    showBannerByXY(state: number = 0, x: number, y: number, func?: ResultCallback) {
        let i = this.getIndex()
        this.hideBanners()
        console.log('showBannerByXY i ', i)
        this.curBanner = i;
        this.logicState = state
        if (i >= 0) {
            super.showBannerByXY(i, x, y, func)
        } else {
            console.warn('showBannerByXY i < 0')
        }
    }

    hideBanner(state: number = 0) {
        this.logicState = SDKState.close;
        this.hideBanners()
        // console.log(' QQChannel2 hideBanner this.curBanner ', this.curBanner)
        // if (this.curBanner >= 0) {
        //     super.hideBanner(this.curBanner)
        //     // this.bannerAd.splice(this.curBanner, 1)
        //     // this.curBanner = -1;
        // }
        // this.list[0].hide();
    }
}