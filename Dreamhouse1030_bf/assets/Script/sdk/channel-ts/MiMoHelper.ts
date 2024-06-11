import BaseHelper from "./BaseHelper";
import SDKManager from "../sdk/SDKManager";
import { ResultState, SDKState, ResultCallback, SDKDir } from "../sdk/SDKConfig";
import ChannelEvent from "./ChannelEvent";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";
import BoxPopC from "../../logic/boxpop/BoxPopC";
import LuckySpinC from "../../logic/luckyspin/LuckySpinC";
import LoginC from "../../logic/login/LoginC";
import zs_xm_sdk from "../lib/zs_xm_sdk";
import Utils from "../../cfw/tools/Utils";
import DailyTaskMgr from "../../logic/dailytask/model/DailyTaskMgr";
import { DailyTaskID, ItemID } from "../../config/Config";
import EngineHelper from "../../engine/EngineHelper";
import BagManager from "../../logic/public/bag/BagManager";
import ChannelUtils from "./ChannelUtils";
import TipC from "../../logic/public/tip/TipC";
export default class MiMoHelper extends BaseHelper {
    protected sdk: any;
    protected openID: string = ''
    protected zsConfig = {
        zs_version: '1.0',
        zs_switch: 0,//误触总开关(1-开 0-关)
        zs_banner_city: 0,
        zs_full_screen_gap_num: 1,
        zs_full_screen_gap_time: 20,
        zs_native_close_num: [1, 3, 5],
        zs_native_fake_time: 30,//打开游戏后隔X秒拉取原生广告但不展示（假曝光）
        zs_native_click_switch: 1,//为1时点击跳转广告，为0时点击关闭广告
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
        this.sdk = new zs_xm_sdk();

        let zsSdk = this.sdk
        zsSdk.initSdkByConf({ channel: "xm", appId: "2882303761520139307", secret: "==" });
        this.login()
        this.loadConfig()
    }
    login(isInit: boolean = true) {
        let zsSdk = this.sdk
        zsSdk.login((openid) => {
            console.log(' msg ', openid)
            this.openID = openid
            if (isInit) {
                zsSdk.init(this.openID)
            }
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
            let config = typeof (result) == 'string' ? JSON.parse(result) : result;
            this.zsConfig = config.data;
            // this.zsConfig.zs_switch = 1;
            if (this.zsConfig.zs_click_award_num > 0) {
                // if (User.instance().checkLoginNum()) {
                //     this.curRewardNum.setValue(this.zsConfig.zs_click_award_num)
                // }
            }
            ChannelEvent.instance().emit(ChannelEvent.LOAD_CONFIG)
            // console.log('result type ', typeof (this.zsConfig ))
            console.log('loadConfig result === ', '' + this.zsConfig)
            // this.zsConfig.zs_version = '1.0'
            // this.zsConfig.zs_switch = 1;
            // this.zsConfig.zs_native_fake_time = 30;
            // this.zsConfig.zs_full_screen_gap_time = 20;
        }, (err) => {
            console.log(' err === ', err)
            setTimeout(() => {
                this.loadConfig()
            }, 3000);
        });
    }

    showRewardAd(site: number, callback: ResultCallback) {
        SDKManager.getChannel().showRewardAd(this.getAdIndex(), (r: number) => {
            callback(r)
            if (r) {
                DailyTaskMgr.instance().updateTaskCount(DailyTaskID.AD)

                if (!this.canMultyAd()) {
                    BagManager.instance().updateItemNum(ItemID.SCRATCH_CARD, 1, EngineHelper.getMidPos())
                }

            }else{
                TipC.instance().showToast('拉取广告失败')
            }
        })
    }
    rewardOpen() {
        // AudioMgr.instance().stopMusic()
    }

    rewardClose() {
        // AudioMgr.instance().playMusic(SoundID.LKT_Gameplay_Soundtrack)
    }

    getAdIndex() {
        return Utils.random(0, 2)
        // return 0;
    }

    showFuncInsertAd(site: number) {
        if (!this.isVersion()) {
            return;
        }
        SDKManager.getChannel().showInsertAd(this.getAdIndex())
    }

    showBannerAd(index: number, dir: SDKDir) {
        if (!this.isVersion()) {
            return;
        }
        SDKManager.getChannel().showBanner(index, dir)
    }

    showInsertAd(site: number) {
        if (!this.isVersion()) {
            return;
        }
        this.adCount++;
        let num: any = this.getNativeCloseNum();
        console.log('NativeTest MiMoHelper showInsertAd num ', num, 'this.adCount ', this.adCount)
        let close_num = 0;
        if (num == -1) {
            close_num = 1;
        } else if (num == 0) {
            close_num = 0
        } else {
            console.log('NativeTest num.indexOf(this.count) >= 0 ', num.indexOf(this.adCount) >= 0)
            if (num.indexOf(this.adCount) >= 0) {
                close_num = 1
            }
        }
        SDKManager.getChannel().showSelfRender({
            index: this.getAdIndex(),
            click_switch: this.getzs_native_click_switch(),
            close_num: close_num,
            callback: (s: number) => {
                if (s == ResultState.NO) {
                    this.showFuncInsertAd(site)
                }
            }
        })
    }

    hasLight() {
        return true;
    }


    isSwtichOpen() {
        return false;
    }

    getzs_video_box() {
        return 5;
    }

    getzs_box_switch() {
        return false;
    }

    getzs_box_show_delay() {
        return 1000;
    }

    isVersion() {
        return ChannelUtils.compareVersion(this.verson, this.zsConfig.zs_version) == 1
    }

    getEmail() {
        return ''
    }

    getAppName() {
        return '蛋糕消消乐'
    }
    getCompany() {
        return '长沙指色网络科技有限公司'
    }
    hasAgreement() {
        return false;
    }

    hasInstallApp() {
        return false;
    }

    getzs_native_show_delay() {
        return 1000
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

    canMultyAd() {
        return true;
    }

    getzs_full_screen_gap_num() {
        if (this.zsConfig.zs_full_screen_gap_num) {
            return this.zsConfig.zs_full_screen_gap_num;
        }
        return 0;
    }

    getzs_native_click_switch() {
        if (this.zsConfig.zs_native_click_switch) {
            return this.zsConfig.zs_native_click_switch
        }
        return 0;
    }

    protected count: number = 0;
    protected adCount: number = 0;
    intoGame() {

        let num = this.getzs_full_screen_gap_num();
        console.log('intoGame num ', num, '  this.count ', this.count)
        if (num > 0) {
            this.count++;
            if (this.count % (num + 1) == 0) {
                this.showInsertAd(this.getAdIndex());
            }
        }
    }

    getzs_full_screen_gap_time() {
        if (this.zsConfig.zs_full_screen_gap_time) {
            return this.zsConfig.zs_full_screen_gap_time
        }
        return 0;
    }

    getzs_native_fake_time() {
        if (this.zsConfig.zs_native_fake_time) {
            return this.zsConfig.zs_native_fake_time
        }
        return 0;
    }

    sheduleGame() {
        this.showAd();
        this.showAd2();

    }

    showAd2() {
        let num = this.getzs_full_screen_gap_time();
        if (num > 0) {
            setTimeout(() => {
                console.log(' showAd num ', num)
                this.showInsertAd(this.getAdIndex())
                this.showAd2();
            }, num * 1000);
        }

    }

    private showAd() {
        let time = this.getzs_native_fake_time();
        if (time > 0) {
            setTimeout(() => {
                console.log(' showAd time ', time)
                SDKManager.getChannel().loadSelfRender({ index: this.getAdIndex(), logicState: SDKState.close });
                this.showAd();
            }, time * 1000);
        }
    }

    leaveGame() {
        if (GameEventAdapter.instance().isOpen()) {
            return;
        }
        BoxPopC.instance().intoLayer();
    }

    firstIntoLobby() {
        if (GameEventAdapter.instance().isOpen()) {
            return;
        }
        LuckySpinC.instance().intoLayer();
    }

    startGame() {
        LoginC.instance().intoLayer()
    }

    getNativeCloseNum(): any {
        if (this.zsConfig.zs_native_close_num) {
            return this.zsConfig.zs_native_close_num
        }
        return 0;
    }
}