import BaseChannel from "../base/BaseChannel";
import { ResultCallback, ResultState, ADName } from "../SDKConfig";
import VivoRewardAd from "./VivoRewardAd";
import VivoBannerAd from "./VivoBannerAd";
import VivoInsertAd from "./VIvoInsertAd";
import VivoNativeAd from "./VivoNativeAd";
import VivoFileSystem from "./VivoFileSystem";
import VivoScreenshot from "./VivoScreenshot";
import BaseSubPackage from "../base/BaseSubPackage";
import VivoBoxBannerAd from "./VivoBoxBannerAd";
import VivoCustomAd from "./VivoCustomAd";
import VivoBoxPortalAd from "./VivoBoxPortalAd";
export default class VivoChannel extends BaseChannel {
    hasAd(name: string) {
        let cfg = this.cfg;
        const version = this.sdk.getSystemInfoSync().platformVersionCode
        console.log('VivoChannel hasAd version ', version, name)
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

        this.sdk.onShow(() => {
            console.log('VivoChannel  onShow ')

        })

        this.sdk.onHide(() => {
            console.log('VivoChannel  onHide ')

        })

        // console.log('qg ', window["qg"])
        if (this.hasAd(ADName.reward)) {
            let adCfg = cfg[ADName.reward]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.rewardAd.push(new VivoRewardAd(this, adId))
                }
            }
        }

        if (this.hasAd(ADName.banner)) {
            let adCfg = cfg[ADName.banner]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.bannerAd.push(new VivoBannerAd(this, adId))
                }
            }
        }


        if (this.hasAd(ADName.insert)) {
            let adCfg = cfg[ADName.insert]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.insertAd.push(new VivoInsertAd(this, adId))
                }
            }
        }

        if (this.hasAd(ADName.native)) {
            let adCfg = cfg[ADName.native]
            let list = adCfg[ADName.adUnitIdList]

            this.nativeAd = new VivoNativeAd(this, list)
        }

        if (this.hasAd(ADName.BoxBanner)) {
            let adCfg = cfg[ADName.BoxBanner]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.appBoxAd.push(new VivoBoxBannerAd(this, adId))
                }
            }
        }
        if (this.hasAd(ADName.BoxPortal)) {
            let adCfg = cfg[ADName.BoxPortal]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.boxPortalAd.push(new VivoBoxPortalAd(this, adId))
                }
            }
        }
        if (this.hasAd(ADName.customAd)) {
            let adCfg = cfg[ADName.customAd]
            let list = adCfg[ADName.adUnitIdList]
            if (list) {
                for (let index = 0; index < list.length; index++) {
                    const adId = list[index];
                    this.customAd.push(new VivoCustomAd(this, adId))
                }
            }
        }

        this.fileSystem = new VivoFileSystem(this)

        this.screenshot = new VivoScreenshot(this)

        this.subPackage = new BaseSubPackage(this)
    }

    showToast(title: string) {
        this.sdk.showToast({
            message: title
        })
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
                console.log('canInstallShortcut res ', res)
                if (res == false) {
                    func(ResultState.YES)
                } else {
                    func(ResultState.NO)
                }
            },
            fail: function (err: any) {
                console.log('canInstallShortcut err ', err)
                func(ResultState.NO)
            },
            complete: function () {
                console.log('canInstallShortcut complete ')
                // func(false)
            }
        })
    }

    previewImage(_tempFilePath: string) {
        this.sdk.previewImage({
            uris: [_tempFilePath],
            success: (res: any) => {
                console.log('Preview image success.');
                // self.label = '';
            }
        });
    }


    installShortcut(result: ResultCallback) {
        this.sdk.installShortcut({
            success: function () {
                // 执行用户创建图标奖励
                console.log(' 安装成功 ')
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



    navigateToMiniProgram(appID: string) {
        this.sdk.navigateToMiniGame({
            pkgName: appID,
            success: function () { },
            fail: function (res: any) {
                // console.log(JSON.stringify(res))
            }
        })
    }

    exitApplication() {
        this.sdk.exitApplication();
    }

    showCustomAd(index: number, rx: number, ry: number, func?: Function) {
        if (this.customAd[index]) {
            this.customAd[index].open();
        }
    }

    /**
 * 分享
 * @param site 
 * @param callback 
 */
    showShare(site: number, callback: ResultCallback, videoPath?: string) {
        if (this.hasShare()) {
            this.sdk.share({
                success: (data) => {
                    console.log('showShare success data ', data)
                    callback(ResultState.YES)
                },
                fail: (res: any) => {
                    console.log('showShare fail ', res)
                    callback(ResultState.NO)
                },
                cancel: () => {
                    console.log('showShare cancel res ')
                    callback(ResultState.NO)
                }
            })
        } else {
            callback(ResultState.NO)
        }
    }

    hasShare() {
        // const version = this.sdk.getSystemInfoSync().platformVersionCode
        // return version >= 1056;
        return false
    }
}