



import BaseHelper from "./BaseHelper";
import ChannelEvent from "./ChannelEvent";
import ChannelUtils from "./ChannelUtils";
import SDKEvent from "../sdk/tools/SDKEvent";
import SoundMgr from "../../logic/sound/model/SoundMgr";
import SDKManager from "../sdk/SDKManager";
import OVNativeAdC from "../nativeAd/OVNativeAdC";
import { SDKDir } from "../sdk/SDKConfig";
import InsertAdMgr from "../comp/InsertAdMgr";
import lc_sdk from "../lib/lc_sdk";
export default class OppoHelper extends BaseHelper {


    protected zsConfig = {
        zs_version: '1.0',
        zs_jump_switch: 1,//是否显示格子广告
        zs_switch: 0,//误触总开关(1-开 0-关)
        zs_banner_city: 0,
        zs_banner_system: '',
        zs_start_turntable: 1,
        // zs_onemin_show_ad_switch: 0,
        zs_native_btn_text: '查看广告',
        zs_native_gap_time: 30,//游戏过程中间隔X秒弹出激励视频弹窗，同时展 示嵌入式原生，
        zs_banner_native_time: 30,//banner型原生每x秒刷新一次，接入开关zs_banner_native_time（单位：秒）ok
        zs_native_click_switch: 0,
        zs_banner_native_switch: 0,//为1时展示原生，为0时展示banner
        zs_native_touch_switch: 0,//为1时，关闭按钮尺寸为40*40，实际可点击范围为32*32；为0时点击范围为40*40
        zs_native_next_limit: 0,//插屏原生广告页面，原生卡片和“查看广告”按钮中间新增一个“下一步”按钮（如上图），按钮是否展示接入开关zs_native_next_limit
        zs_native_close_num: 0,//
        zs_native_show_delay: 0,//毫秒
        zs_native_limit: 1,//游戏进行页面每隔30s弹出一次插屏式原生广告
        zs_jump_time: 0,//原生关闭按钮接入延迟开关 单位毫秒
        zs_native_slide_switch: 0,//开启时滑动屏幕过程中碰到广告区域也直接进入广告，关闭时正常点击进入
        zs_onemin_show_ad_switch: 1//1 不展示，0 展示
    }

    protected sdk: lc_sdk;
    constructor() {
        super();
        this.sdk = new lc_sdk();
        this.setVersion('15.0')
        this.sdk.initSdkByConf({ channel: "oppo", appId: "30738473", secret: "A6aEDBdD3d78dD385a0A159814609b81" });
        this.login()
        this.loadConfig();
        // if (this.zsConfig.zs_onemin_show_ad_switch == 1) {
        //     setTimeout(() => {
        //         this.zsConfig.zs_onemin_show_ad_switch = 0;
        //     }, 60000);
        // }
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
    isSwtichOpen() {
        // console.log('this.zsConfig.zs_switch == 1', this.zsConfig)
        // console.log('this.zsConfig.zs_switch == 1', this.zsConfig.zs_switch)
        return this.zsConfig.zs_switch == 1
    }


    login(isInit: boolean = true) {
        // let zsSdk = window['zs'].sdk
        this.sdk.login((openid) => {
            // console.log(' msg ', openid)
            this.sdk.init(openid)
        }, (err) => {
            // console.log('login error ', err)
            setTimeout(() => {
                this.login(isInit)
            }, 3000);
        })
    }

    getzs_native_btn_text() {
        if (this.zsConfig.zs_native_btn_text) {
            return this.zsConfig.zs_native_btn_text
        }
        return ''
    }
    loadConfig() {
        // let zsSdk = window['zs'].sdk
        this.sdk.loadCfg((result) => {
            this.zsConfig = typeof (result) == 'string' ? JSON.parse(result) : result;

            console.log('result type ', typeof (result))
            console.log(' result === ', this.zsConfig)

            //test ------------------
            // this.zsConfig.zs_version = '1.0'
            // this.zsConfig.zs_jump_switch = 1;
            // this.zsConfig.zs_switch = 1;
            // this.zsConfig.zs_native_limit = 1;
            // this.zsConfig.zs_jump_time = 3000;
            // this.zsConfig.zs_banner_native_switch = 1;
            // this.zsConfig.zs_native_close_num = 1;

            if (this.zsConfig.zs_onemin_show_ad_switch == 1) {
                setTimeout(() => {
                    this.zsConfig.zs_onemin_show_ad_switch = 0;
                }, 60000);
            }
            ChannelEvent.instance().emit(ChannelEvent.LOAD_CONFIG)
        }, (err) => {
            console.log(' err === ', err)
            setTimeout(() => {
                this.loadConfig()
            }, 3000);
        });
    }
    hasEmail() {
        return false;
    }
    getzs_native_gap_time() {
        if (this.zsConfig.zs_native_gap_time) {
            return this.zsConfig.zs_native_gap_time
        }
        return 0;
    }
    getBannerWitch() {
        if (this.zsConfig.zs_banner_native_switch) {
            return this.zsConfig.zs_banner_native_switch
        }
        return 0;
    }
    hasNativeTouchSwitch() {
        return this.zsConfig.zs_native_touch_switch == 1
    }
    getNativeBannerRefreshTime() {
        if (this.zsConfig.zs_banner_native_time) {
            return this.zsConfig.zs_banner_native_time
        }
        return 30;
    }
    getNativeCloseNum() {
        if (this.zsConfig.zs_native_close_num) {
            return this.zsConfig.zs_native_close_num
        }
        return 0;
    }

    isVersion() {
        let version = ChannelUtils.compareVersion(this.verson, this.zsConfig.zs_version) == 1;
        // console.log(' isVersion ', version)
        return this.isSwtichOpen() && version
    }

    isJumpSwitchOpen() {
        return this.isVersion() && this.zsConfig.zs_jump_switch == 1
    }

    hasNativeLimit() {
        // console.log(' this.zsConfig.zs_native_limit == 1 ', this.zsConfig.zs_native_limit == 1)
        return this.isVersion() && this.zsConfig.zs_native_limit == 1 && this.noOneMinAdLimit()
    }

    noOneMinAdLimit() {
        // console.log(' this.zsConfig.zs_onemin_show_ad_switch == 0', this.zsConfig.zs_onemin_show_ad_switch == 0)
        return this.zsConfig.zs_onemin_show_ad_switch == 0;
    }

    getJumpTime() {
        if (this.zsConfig.zs_jump_time) {
            return this.zsConfig.zs_jump_time;
        }
        return 0
    }

    hasAgreement() {
        return true;
    }
    isOpenNativeErrorClick() {
        return this.isVersion() && this.zsConfig.zs_native_click_switch == 1
    }

    getNativeSlide() {
        if (this.zsConfig.zs_native_slide_switch) {
            return this.zsConfig.zs_native_slide_switch == 1
        }
        return false;
    }

    hasMoreGame() {
        // SDKManager.getChannel().showBoxPortalAd(0)
        return true
    }
    openMoreGameView(index: number, rx: number, ry: number) {
        SDKManager.getChannel().showAppBoxAd(index)
    }

    showFuncInsertAd(site: number) {
        OVNativeAdC.instance().intoLayer(true)
        InsertAdMgr.setBannerState(false)
    }
    showInsertAd(site: number) {
        OVNativeAdC.instance().intoLayer(true)
        InsertAdMgr.setBannerState(false)
    }

    hideFuncInsertAd() {
        InsertAdMgr.setBannerState(true)
    }

    showBannerAd(index: number) {
        if (!this.noOneMinAdLimit()) {
            return;
        }
        if (this.getBannerWitch() == 0) {
            SDKManager.getChannel().showBanner(index, SDKDir.BOTTOM_MID)
        } else {
            OVNativeAdC.instance().showBanner()
            SDKManager.getChannel().hideBanner()
        }
    }

    hideBannerAd(index: number) {
        if (!this.noOneMinAdLimit()) {
            return;
        }
        if (this.getBannerWitch() == 0) {
            SDKManager.getChannel().hideBanner(index)
        } else {
            OVNativeAdC.instance().hideBanner();
        }


    }
    hasInstallApp() {
        return true;
    }

    getzs_native_show_delay() {
        if (this.zsConfig.zs_native_show_delay) {
            return this.zsConfig.zs_native_show_delay
        }
        return 0;
    }
}