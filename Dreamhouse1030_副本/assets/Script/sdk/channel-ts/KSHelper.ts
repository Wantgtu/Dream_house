import BaseHelper from "./BaseHelper";
import SDKManager from "../sdk/SDKManager";
import SDKEvent from "../sdk/tools/SDKEvent";
import { GEvent } from "../../cfw/event";
import SoundMgr from "../../logic/sound/model/SoundMgr";
import ChannelEvent from "./ChannelEvent";
import ChannelUtils from "./ChannelUtils";
import { ResultCallback } from "../sdk/SDKConfig";
import lc_sdk from "../lib/lc_sdk";
//appid 1112099563
//umeng 61f3cc8ae014255fcb0de31f
export default class KSHelper extends BaseHelper {
    protected sdk: lc_sdk;
    protected zsConfig = {
        zs_version: '1.0',
        zs_switch: 0,//误触总开关(1-开 0-关)
        zs_banner_city: 0,
        zs_native_click_switch: 1,
        zs_full_screen_gap_time: 0,
        zs_process_time: 0,//游戏自动弹导出流程时间间隔开关（配置多少就多少秒弹一次）
        zs_game_star_jump_switch: 0,//首页导出位开关 
        zs_banner_game_time: 30,//游戏页banner刷新开关（配置什么数就多少秒刷新一次
        zs_text_message: 30,//返回0不展示好友假消息，返回其它数，比如30，则每30秒展示一次
        zs_banner_time: 2,//全屏导出页banner展示时长（返回多少就展示几秒）
        zs_click_award_prompt: 0,//再次狂点提示界面开关（1开0关）
        zs_click_award_num: 1,//狂点成功可获得1个星星的奖励
        zs_begin_click_switch: 0,//开局砸金蛋开关(1开 0关）
        zs_start_video_switch: 0,//开局看视频开关（1开 0关）
        zs_begin_click__since: 3,//开局砸金蛋用户第几次进入游戏时出现
        zs_banner_vertical_enable: 0,//banner文字误触文字上移开关（0关，1开）
        zs_banner_system: '',//banner文字误触系统屏蔽（android/ios）返回值为ios,则所有ios系统用户体验正常版本游戏，无任何误触

    }
    constructor() {
        super();
        // this.sdk = window['zs'].sdk
        this.setVersion('0.0')
        this.sdk = new lc_sdk();
        SDKEvent.instance().on(SDKEvent.REWARD_AD_CLOSE, this.rewardClose, this)
        SDKEvent.instance().on(SDKEvent.REWARD_AD_OPEN, this.rewardOpen, this)
        SDKManager.getChannel().getSDK().onShow(() => {
            console.log('VivoChannel  onShow ')
            GEvent.instance().emit(GEvent.EVENT_SHOW)

        })

        SDKManager.getChannel().getSDK().onHide(() => {
            console.log('VivoChannel  onHide ')
            GEvent.instance().emit(GEvent.EVENT_HIDE)

        })
        let zsSdk = this.sdk
        zsSdk.initSdkByConf({ channel: "ks", appId: "ks689613694818931931", secret: "" });
        this.login()
        this.loadConfig()
    }
    login(isInit: boolean = true) {
        let zsSdk = this.sdk
        zsSdk.login((openid) => {
            console.log(' msg ', openid)
            // this.openID = openid
            // if (isInit) {
            //     zsSdk.init(this.openID)
            // }
        }, (err) => {
            console.log('login error ', err)
            setTimeout(() => {
                this.login(isInit)
            }, 3000);
        })
    }
    loadConfig() {
        let zsSdk = this.sdk
        zsSdk.loadCfg((result) => {
            this.zsConfig = typeof (result) == 'string' ? JSON.parse(result) : result;
            // this.zsConfig.zs_switch = 1;
            if (this.zsConfig.zs_click_award_num > 0) {
                // if (User.instance().checkLoginNum()) {
                //     this.curRewardNum.setValue(this.zsConfig.zs_click_award_num)
                // }
            }
            ChannelEvent.instance().emit(ChannelEvent.LOAD_CONFIG)
            console.log('result type ', typeof (result))
            console.log('loadConfig result === ', result)
        }, (err) => {
            console.log(' err === ', err)
            setTimeout(() => {
                this.loadConfig()
            }, 3000);
        });
    }

    getAddress() {
        return '北京市 房山区 良乡凯旋大街 建设路18号-D15052'
    }

    rewardOpen() {
        console.log('rewardOpen ')
        SoundMgr.instance().rewardOpen()
    }

    rewardClose() {
        SoundMgr.instance().rewardClose()
    }

    isVersion() {
        return ChannelUtils.compareVersion(this.verson, this.zsConfig.zs_version) == 1
    }
    isSwtichOpen() {
        return this.zsConfig.zs_switch == 1
    }

    isOpen() {
        return this.isVersion() && this.isSwtichOpen();
    }
    openMoreGameView(index: number, rx: number, ry: number) {
        SDKManager.getChannel().showAppBoxAd(index)
    }

    showCustomAd(index: number, rx: number, ry: number) {
        SDKManager.getChannel().showBlockAd(index, rx, ry)
    }

    hideCustomAd(index: number) {
        SDKManager.getChannel().hideBlockAd(index)
    }

    hasMoreGame() {
        return false;
    }

    hasAgreement() {
        return false;
    }

    hasSinglePrivicy() {
        return false;
    }

    hasNormalShare() {
        return true
    }

    showShare(site: number, callback: ResultCallback, videoPath?: string) {
        SDKManager.getChannel().showShare(0, callback, videoPath)
    }

    sheduleGame() {
        if(this.isVersion()){
            this.showAd2();
        }


    }
    getzs_full_screen_gap_time() {
        if (this.zsConfig.zs_full_screen_gap_time) {
            return this.zsConfig.zs_full_screen_gap_time
        }
        return 0;
    }
    showAd2() {
        let num = this.getzs_full_screen_gap_time();
        if (num > 0) {
            setTimeout(() => {
                console.log(' showAd num ',num)
                this.showInsertAd(0)
                this.showAd2();
            }, num * 1000);
        }

    }
}