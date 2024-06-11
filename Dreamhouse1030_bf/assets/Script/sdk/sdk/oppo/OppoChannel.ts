import BaseChannel from "../base/BaseChannel";
import { ResultCallback, ResultState, ADName } from "../SDKConfig";
import OppoRewardAd from "./OppoRewardAd";
import OppoBannerAd from "./OppoBannerAd";
import OppoInsertAd from "./OppoInsertAd";
import OppoNativeAd from "./OppoNativeAd";
import OppoScreenshot from "./OppoScreenshot";
import OppoFileSystem from "./OppoFileSystem";
import BaseSubPackage from "../base/BaseSubPackage";
import GamePortalAd from "./GamePortalAd";
import SDKHelper from "../SDKHelper";


export default class OppoChannel extends BaseChannel {
    hasAd(name: string) {
        let cfg = this.cfg;
        const version = this.sdk.getSystemInfoSync().platformVersionCode
        //console.log('VivoChannel hasAd version ', version)
        let bannerCfg = cfg[name]
        if (!bannerCfg) {
            return -1
        }
        let bVersion = bannerCfg[ADName.version]
        if (!bVersion) {
            return 0
        }
        return version >= bVersion
    }

    init() {
        let cfg = this.cfg;
        console.log('OppoChannel  constructor ')
        this.sdk.onShow(() => {
            console.log('OppoChannel  onShow ')

        })

        this.sdk.onHide(() => {
            console.log('OppoChannel  onHide ')

        })

        // this.bannerAd = new WXBanner()
        if (this.hasAd(ADName.reward)) {
            let adCfg = cfg[ADName.reward]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.rewardAd.push(new OppoRewardAd(this, adId))
                }
            }
        }
        // console.log(' this.sdk.createBannerAd ', this.sdk.createBannerAd)
        if (this.hasAd(ADName.banner)) {
            let adCfg = cfg[ADName.banner]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.bannerAd.push(new OppoBannerAd(this, adId))
                }
            }
        } else {
            console.warn(' 没有banner广告')
        }

        // if (this.hasAd(ADName.insert)) {
        //     let adCfg = cfg[ADName.insert]
        //     let list = adCfg[ADName.adUnitIdList]
        //     if (list) {
        //         for (let index = 0; index < list.length; index++) {
        //             const adId = list[index];
        //             this.insertAd.push(new OppoInsertAd(this, adId))
        //         }
        //     }
        // }
        if (this.hasAd(ADName.native)) {
            let adCfg = cfg[ADName.native]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                this.nativeAd = new OppoNativeAd(this, list)
            }
        }
        // console.log(' this.sdk.GamePortalAd ', this.sdk.createGamePortalAd)
        if (this.hasAd(ADName.portal)) {
            let adCfg = cfg[ADName.portal]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.appBoxAd.push(new GamePortalAd(this, adId))
                }
            }
        }

        console.log('OppoChannel  constructor  222222')
        this.subPackage = new BaseSubPackage(this)

        this.screenshot = new OppoScreenshot(this)

        this.fileSystem = new OppoFileSystem(this)
    }

    hasMoreGame() {
        return this.hasAppBox()
    }

    showToast(title: string) {
        this.sdk.showToast({ title: title })
    }

    vibrateShort() {
        this.sdk.vibrateShort({
            success: function (res: any) { },
            fail: function (res: any) { },
            complete: function (res: any) { }
        })
    }

    canInstallShortcut(func: ResultCallback) {
        this.sdk.hasShortcutInstalled({
            success: function (res: any) {
                // 判断图标未存在时，创建图标
                console.log('canInstallShortcut res  ', res)
                if (res == false) {
                    func(ResultState.YES)
                } else {
                    func(ResultState.NO)
                }
            },
            fail: function (err: any) {
                func(ResultState.NO)
            },
            complete: function () {
                // func(false)
            }
        })
    }



    installShortcut(result: ResultCallback) {
        this.sdk.installShortcut({
            success: function (param: any) {
                // 执行用户创建图标奖励
                console.log(' 安装成功 ', param)
                result(ResultState.YES)
            },
            fail: function (err: any) {
                console.log(' 安装失败 ', err)
                result(ResultState.NO)
            },
            complete: function () {
                // result(false)
            }
        })

    }

    setLoadingProgress(progress: number) {
        this.sdk.setLoadingProgress({
            progress: progress
        });
    }

    loadingComplete() {
        this.sdk.loadingComplete({
            complete: function (res: any) { }
        });
    }

    navigateToMiniGame(appID: string) {
        this.sdk.navigateToMiniGame({
            pkgName: appID,
            success: function () { },
            fail: function (res: any) {
                // console.log(JSON.stringify(res))
            }
        })
    }

    previewImage(_tempFilePath: string) {
        this.sdk.previewImage({
            urls: [_tempFilePath],
            success: (res: any) => {
                console.log('Preview image success.');
                // self.label = '';
            }
        });
    }

    exitApplication() {
        this.sdk.exitApplication({
            success: function () {
                console.log('退出成功')
            },
            fail: function () {
                console.log('退出失败')
            }
        })
    }

    request(url: string, func: Function) {
        SDKHelper.sendHttpRequest(url, '', (msg: string, data) => {
            func(msg, data)
        })
    }
}