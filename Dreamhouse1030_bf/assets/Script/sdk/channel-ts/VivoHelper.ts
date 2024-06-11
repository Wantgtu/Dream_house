

import BaseHelper from "./BaseHelper";
import ChannelEvent from "./ChannelEvent";
import ChannelUtils from "./ChannelUtils";
import SDKEvent from "../sdk/tools/SDKEvent";
import SoundMgr from "../../logic/sound/model/SoundMgr";
import SDKManager from "../sdk/SDKManager";
import { SDKDir } from "../sdk/SDKConfig";
import Utils from "../../cfw/tools/Utils";
import InsertAdMgr from "../comp/InsertAdMgr";
import lc_sdk from "../lib/lc_sdk";
export default class VivoHelper extends BaseHelper {
    protected zsConfig = {
        zs_version: '0.0',//控制审核时是否开启
        zs_switch: 0,//误触总开关(1-开 0-关) 不受version影响
        zs_banner_city: 0,
        zs_banner_system: '',
        zs_box_show_delay: 0,
        zs_native_click_switch: 0,
        zs_native_slide_switch: 0,
        zs_banner_native_switch: 0,//0 banner  1 左图右文
        zs_native_close_num: 0,
        zs_start_native_switch: 0,
        zs_banner_native_time: 0,
        zs_native_change_switch: 0,
        zs_video_box: 0,
        zs_box_switch: 0,
        zs_native_show_delay: 0,//延时X秒展示
        zs_native_touch_switch: 0,//为1时，关闭按钮尺寸为40*40，实际可点击范围为32*32；为0时点击范围为40*40
        zs_native_next_limit: 0,//插屏原生广告页面，原生卡片和“查看广告”按钮中间新增一个“下一步”按钮（如上图），按钮是否展示接入开关zs_native_next_limit
        zs_native_limit: 0,//游戏进行页面每隔30s弹出一次插屏式原生广告
        zs_native_gap_time: 0//游戏过程中间隔X秒弹出激励视频弹窗，同时展 示嵌入式原生，
    }

    protected sdk: lc_sdk
    // protected adCount: number = 0;
    // protected bannerRandom: number = 0;
    protected nativeRandom: number = 0;
    constructor() {
        super();
        this.sdk = new lc_sdk();
        this.setVersion('15.0')
        this.sdk.initSdkByConf({ channel: "vivo", appId: "105497513", secret: "01522670216d9d0c6efac98489cdcd34" });
        this.login()
        this.loadConfig()
        SDKEvent.instance().on(SDKEvent.REWARD_AD_CLOSE, this.rewardClose, this)
        SDKEvent.instance().on(SDKEvent.REWARD_AD_OPEN, this.rewardOpen, this)
    }

    rewardOpen() {
        console.log('rewardOpen ')
        SoundMgr.instance().rewardOpen()
    }

    rewardClose() {
        SoundMgr.instance().rewardClose()
    }

    getzs_start_native_switch() {
        if (this.zsConfig.zs_start_native_switch) {
            return this.zsConfig.zs_start_native_switch
        }
        return 0;
    }

    getzs_native_show_delay() {
        if (this.zsConfig.zs_native_show_delay) {
            return this.zsConfig.zs_native_show_delay
        }
        return 0;
    }

    getNativeBannerRefreshTime() {
        if (this.zsConfig.zs_banner_native_time) {
            return this.zsConfig.zs_banner_native_time
        }
        return 30;
    }
    getBannerWitch() {
        if (this.zsConfig.zs_banner_native_switch) {
            return this.zsConfig.zs_banner_native_switch
        }
        return 0;
    }
    getNativeCloseNum() {
        if (!this.isVersion()) {
            return 0;
        }
        if (this.zsConfig.zs_native_close_num) {
            return this.zsConfig.zs_native_close_num
        }
        return 0;
    }
    hasNativeNextLimit() {
        if (!this.isVersion()) {
            return false;
        }
        if (this.zsConfig.zs_native_next_limit) {
            return this.zsConfig.zs_native_next_limit == 1
        }
        return false
    }
    getNativeSlide() {
        if (!this.isVersion()) {
            return false;
        }
        if (this.zsConfig.zs_native_slide_switch) {
            return this.zsConfig.zs_native_slide_switch == 1
        }
        return false;
    }
    hasNativeTouchSwitch() {
        if (!this.isVersion()) {
            return false;
        }
        if (this.zsConfig.zs_native_touch_switch) {
            return this.zsConfig.zs_native_touch_switch == 1
        }
        return false;
    }

    getzs_native_gap_time() {
        if (this.zsConfig.zs_native_gap_time) {
            return this.zsConfig.zs_native_gap_time
        }
        return 0;
    }

    hasNativeAd() {
        return true;
    }

    hasNativeLimit() {
        if (!this.isVersion()) {
            return false;
        }
        if (this.zsConfig.zs_native_limit) {
            return this.zsConfig.zs_native_limit == 1
        }
        return false;
    }

    loadConfig() {
        // let zsSdk = window['zs'].sdk
        this.sdk.loadCfg((result) => {
            this.zsConfig = typeof (result) == 'string' ? JSON.parse(result) : result;
            console.log('result type ', typeof (result))
            console.log(' result === ', result)
            //test
            // this.zsConfig.zs_version = '1.0'
            // this.zsConfig.zs_native_limit = 1;
            // this.zsConfig.zs_banner_native_switch = 0;
            // this.zsConfig.zs_native_close_num = 1;
            // this.zsConfig.zs_native_touch_switch = 1;
            // this.zsConfig.zs_native_show_delay = 0.1;

            ChannelEvent.instance().emit(ChannelEvent.LOAD_CONFIG)
        }, (err) => {
            console.log(' err === ', err)
            setTimeout(() => {
                this.loadConfig()
            }, 3000);
        });
    }

    isJumpSwitchOpen() {
        return true
    }
    login(isInit: boolean = true) {
        this.sdk.login((openid) => {
            console.log(' msg ', openid)
        }, (err) => {
            console.log('login error ', err)
            setTimeout(() => {
                this.login(isInit)
            }, 3000);
        })
    }
    isOpenNativeErrorClick() {
        return this.isVersion() && this.zsConfig.zs_native_click_switch == 1
    }

    isVersion() {
        return ChannelUtils.compareVersion(this.verson, this.zsConfig.zs_version) == 1
    }

    isErrorClickOpen() {
        return this.isSwtichOpen() && this.isSystemOpen() && this.zsConfig.zs_banner_city == 1
    }

    isSwtichOpen() {
        return this.zsConfig.zs_switch == 1 && this.isVersion();
    }

    isSystemOpen() {
        if (this.zsConfig.zs_banner_system == "") {
            return true;
        }
        return this.getOS() != this.zsConfig.zs_banner_system
    }
    getBannerRefreshTime() {
        return 30
    }
    hasLoginBanner() {
        return true;
    }
    getProcessTime() {
        return 0
    }

    firstExport() {
        return false;
    }

    hasEgg() {
        return false;
    }

    hasDiamonView() {
        return false;
    }

    marketHasType(type: number) {
        if (type == 4) {
            return SDKManager.getChannel().hasShare();
        }
        // if (type == 2 || type == 3) {
        //     return false
        // }
        return true;
    }
    showInsertAd(site: number) {
        // if (User.instance().getLeftTime() >= 300) {
        console.log('showInsertAd this.hasNativeLimit() ', this.hasNativeLimit())
        if (this.hasNativeLimit()) {
            SDKManager.getChannel().showInsertAd(site)
            // InsertAdMgr.setBannerState(false)
        }

        // }
    }

    hideInsertAd(index: number) {
        console.log('hideInsertAd this.hasNativeLimit() ', this.hasNativeLimit())
        if (this.hasNativeLimit()) {
            // InsertAdMgr.setBannerState(true)
        }

    }
    showFuncInsertAd(site: number) {
        // if (User.instance().getLeftTime() >= 300) {
        // SDKManager.getChannel().showInsertAd(site)
        // OVNativeAdC.instance().intoLayer(true)
        if (!this.isVersion()) {
            return;
        }
        // this.adCount++;

        let time = this.getzs_native_gap_time();
        console.log('showFuncInsertAd time ', time)
        if (time) {
            let num = this.getzs_native_change_switch();
            console.log('showFuncInsertAd getzs_native_change_switch num ', num)
            if (num == 0) {
                // SDKManager.getChannel().showInsertAd(site)
                SDKManager.getChannel().showCustomAd(1, 0, 0, (r) => {
                    if (r) {
                        InsertAdMgr.setBannerState(false)
                    }
                })
            } else if (num == 1) {
                SDKManager.getChannel().showCustomAdByDir(0, SDKDir.MID, 0, (r: number) => {
                    if (r) {
                        InsertAdMgr.setBannerState(false)
                    }
                })
            } else if (num == 2) {
                this.nativeRandom = Utils.random(0, 100)
                if (this.nativeRandom <= 50) {
                    SDKManager.getChannel().showCustomAdByDir(0, SDKDir.MID, 0, (r: number) => {
                        if (r) {
                            InsertAdMgr.setBannerState(false)
                        }
                    })
                } else {
                    SDKManager.getChannel().showCustomAd(1, 0, 0, (r) => {
                        if (r) {
                            InsertAdMgr.setBannerState(false)
                        }
                    })
                }
            }
        }



        // }
    }
    getzs_video_box() {
        if (this.zsConfig.zs_video_box) {
            return this.zsConfig.zs_video_box
        }
        return 0
    }
    getzs_native_change_switch() {
        if (this.zsConfig.zs_native_change_switch) {
            return this.zsConfig.zs_native_change_switch;
        }
        return 0;
    }

    hideFuncInsertAd(index: number) {
        if (!this.isVersion()) {
            return;
        }
        // this.adCount--;
        InsertAdMgr.setBannerState(true)
        let time = this.getzs_native_gap_time();
        if (time > 0) {
            let num = this.getzs_native_change_switch();
            if (num == 0) {
                SDKManager.getChannel().hideCustomAd(1)
            } else if (num == 1) {
                SDKManager.getChannel().hideCustomAd(0)
            } else if (num == 2) {
                // let random = Utils.random(0, 100)
                if (this.nativeRandom <= 50) {
                    SDKManager.getChannel().hideCustomAd(0)
                } else {
                    SDKManager.getChannel().hideCustomAd(1)
                }
            }
        }

    }

    showBannerAd(index: number) {

        SDKManager.getChannel().showBanner(0, SDKDir.BOTTOM_MID, (r: number) => {
            if (r) {
                // this.adCount++;
            }
        })

    }
    hideCustomAd(index: number) {

    }

    showCustomAd(index: number, rx: number, ry: number) {

    }
    hideBannerAd(index: number) {

        SDKManager.getChannel().hideBanner(0)


    }

    hasAgreement() {
        return true;
    }

    getAppName() {
        return '蛋糕消消乐'
    }
    hasMoreGame() {
        SDKManager.getChannel().showBoxPortalAd(0)
        return false
    }
    openMoreGameView(index: number, rx: number, ry: number) {

    }

    getzs_box_switch() {
        if (!this.isVersion()) {
            return false
        }
        if (this.zsConfig.zs_box_switch) {
            return this.zsConfig.zs_box_switch == 1
        }
        return false;
    }

    getzs_box_show_delay() {
        if (this.zsConfig.zs_box_show_delay) {
            return this.zsConfig.zs_box_show_delay
        }
        return 0;
    }

    hasInstallApp() {
        return true;
    }

    canMultyAd() {
        return false;
    }
}