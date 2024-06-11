import BaseChannel from "../base/BaseChannel";
import { ADName, SDKDir, ResultCallback, SDKState, ResultState } from "../SDKConfig";
import WXBannerAd from "./WXBannerAd";
import WXInsertAd from "./WXInsertAd";
import WXRewardAd from "./WXRewardAd";
import WXShare from "./WXShare";
import WXLogin from "./WXlogin";
import WXScreenshot from "./WXScreenshot";
import BaseSubPackage from "../base/BaseSubPackage";
import WXFileSystem from "./WXFileSystem";
import WXCustomAd from "./WXCustomAd";
import SDKHelper from "../SDKHelper";
import BannerIDMgr from "../tools/BannerIDMgr";
import UmaEvent from "../third/uma/UmaEvent";

export default class WXChannel extends BaseChannel {


    hasAd(name: string) {
        let cfg = this.cfg;
        const version = this.sdk.getSystemInfoSync().SDKVersion
        let bannerCfg = cfg[name]
        if (!bannerCfg) {
            return -1
        }
        let bVersion = bannerCfg[ADName.version]
        if (!bVersion) {
            return 0
        }
        return SDKHelper.compareVersion(version, bVersion) >= 0
    }


    init() {

        let cfg = this.cfg;

        if (this.hasAd(ADName.banner)) {
            let bannerCfg = cfg[ADName.banner]
            let list = bannerCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.bannerAd.push(new WXBannerAd(this, adId))
                }
            }
        }

        if (this.hasAd(ADName.insert)) {
            let bannerCfg = cfg[ADName.insert]
            let list = bannerCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.insertAd.push(new WXInsertAd(this, adId))
                }
            }
        }

        if (this.hasAd(ADName.reward)) {
            let bannerCfg = cfg[ADName.reward]
            let list = bannerCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.rewardAd.push(new WXRewardAd(this, adId))
                }
            }
        }
        if (this.hasAd(ADName.customAd)) {
            let bannerCfg = cfg[ADName.customAd]
            let list = bannerCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.customAd.push(new WXCustomAd(this, adId))
                }
            }
        }
        if (this.sdk.shareAppMessage) {
            this.share = new WXShare(this, cfg[ADName.share])
        }

        this.loginMgr = new WXLogin(this)

        this.screenshot = new WXScreenshot(this)

        this.subPackage = new BaseSubPackage(this)

        this.fileSystem = new WXFileSystem(this)

        this.event = new UmaEvent()

        this.checkForUpdate()
    }



    vibrateShort() {
        this.sdk.vibrateShort();
    }

    //展示网络图片
    previewImage(imgUrl: string) {
        this.sdk.previewImage({
            current: imgUrl, // 当前显示图片的http链接
            urls: [imgUrl] // 需要预览的图片http链接列表
        })
    }

    //跳转能力
    navigateToMiniProgram(appID: string) {
        this.sdk.navigateToMiniProgram({
            appId: appID,
            success: () => {

            }
        })
    }
    showToast(title: string) {
        this.sdk.showToast({ title: title })
    }

    postMessage(msg: any) {
        let context = this.sdk.getOpenDataContext()
        if (context) {
            msg.channelID = this.cfg.name;
            context.postMessage(msg)
        }
    }

    checkForUpdate() {

        const updateManager = this.sdk.getUpdateManager()
        if (!updateManager) {
            return
        }
        updateManager.onCheckForUpdate(function (res: any) {
            // 请求完新版本信息的回调
            // console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(() => {
            this.sdk.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: (res: any) => {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(() => {
            // 新版本下载失败
            this.showToast('新版本下载失败,下次启动继续...')
        })

    }
    hasAppBox() {
        return true
    }

    showAppBoxAd(index: number = 0, func?: Function) {
        if (this.hasAppBox()) {
            let rx = 0.01
            let ry = 0.25;
            this.showCustomAd(2, rx, ry)
        }
    }



    // getBannerByIndex(index: number) {
    //     let site = BannerIDMgr.instance().getIndex(index)
    //     if (this.bannerAd[site]) {
    //         return this.bannerAd[site]
    //     }
    // }


    /**
     * 显示banner广告
     * @param index 广告位索引
     */
    showBanner(index: number, d: SDKDir = SDKDir.BOTTOM_MID, func?: ResultCallback) {
        this.destroyBanner(index)
        BannerIDMgr.instance().setIndex(index)
        let site = BannerIDMgr.instance().getIndex(index)
        console.log('showBanner index  ', index, 'site', site)
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].setDir(d)
            this.bannerAd[site].updateSize()
            this.bannerAd[site].open(func)
        }
    }

    isBannerOk(index: number) {
        let site = BannerIDMgr.instance().getIndex(index)
        console.log('isBannerOk index  ', index, 'site', site)
        if (this.hasBanner() && this.bannerAd[site]) {

            return this.bannerAd[site].isOk()
        }
        return false;
    }

    showBannerByXYWH(index: number, x: number, y: number, w: number, h: number, func?: ResultCallback) {
        this.destroyBanner(index)
        BannerIDMgr.instance().setIndex(index)
        let site = BannerIDMgr.instance().getIndex(index)
        console.log('showBannerByXYWH index  ', index, 'site', site)
        if (this.hasBanner() && this.bannerAd[site]) {

            this.bannerAd[site].setDir(SDKDir.XY)
            this.bannerAd[site].setPosition(x, y)
            this.bannerAd[site].setContentSize(w, h)
            this.bannerAd[site].updateSize()
            this.bannerAd[site].open(func)
        }
    }

    showBannerByXY(index: number, x: number, y: number, func?: ResultCallback) {
        this.destroyBanner(index)
        BannerIDMgr.instance().setIndex(index)
        let site = BannerIDMgr.instance().getIndex(index)
        console.log('showBannerByXY index  ', index, 'site', site)
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].setDir(SDKDir.XY)
            this.bannerAd[site].setPosition(x, y)
            this.bannerAd[site].updateSize()
            this.bannerAd[site].open(func)
        }
    }

    preloadBannerByXY(index: number, x: number, y: number, func?: ResultCallback) {
        this.destroyBanner(index)
        BannerIDMgr.instance().setIndex(index)
        let site = BannerIDMgr.instance().getIndex(index)
        console.log('preloadBannerByXY index  ', index, 'site', site)
        if (this.bannerAd[site]) {
            this.bannerAd[site].setDir(SDKDir.XY)
            this.bannerAd[site].setPosition(x, y)
            this.bannerAd[site].updateSize()
            this.bannerAd[site].preload(SDKState.close)
        }
    }

    openBanner(index: number) {
        let site = BannerIDMgr.instance().getIndex(index)
        console.log('openBanner index  ', index, 'site', site)

        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].show()
        }
    }
    //隐藏banner广告
    hideBanner(index: number = 0) {
        let site = BannerIDMgr.instance().getIndex(index)
        console.log('hideBanner index  ', index, 'site', site)

        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].close()
        } else {
            // console.log('hideBanner error ', site, this.bannerAd.length)
        }
    }

    /**
     * 索引不变，重新拉取
     * @param index 
     * @param state 
     */
    loadBanner(index: number = 0, state?: number) {
        let site = BannerIDMgr.instance().getIndex(index)
        console.log('loadBanner index  ', index, 'site', site)
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].preload(state)
        }
    }

    destroyBanner(index: number) {
        let site = BannerIDMgr.instance().getIndex(index)
        console.log('destroyBanner index  ', index, 'site', site)
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].destroy()
        }
    }

    // createBanner(index: number = 0) {
    //     let site = BannerIDMgr.instance().getIndex(index)
    //     if (this.hasBanner() && this.bannerAd[site]) {
    //         this.bannerAd[site].destroy();
    //         this.bannerAd[site].create();
    //         return this.bannerAd[site].getInstance()
    //     }
    // }

   //展示激励视频广告
   showRewardAd(site: number, callback: ResultCallback) {
        console.log('tt showRewardAd ', site, this.rewardAd.length)
        if (this.rewardAd.length > 0) {
            site = this.getRandom(0, this.rewardAd.length -1);
        }
        if (this.hasRewardAd() && this.rewardAd[site]) {
            // console.log('showRewardAd 22222 ')
            this.rewardAd[site].open(callback)
        } else {
            callback(ResultState.YES)
        }
    }
}
