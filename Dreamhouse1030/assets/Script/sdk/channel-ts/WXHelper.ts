

import ZSGameItemModel from "./ZSGameItemModel";
import BaseHelper from "./BaseHelper";
import GameItemModel from "./GameItemModel";
import ChannelEvent from "./ChannelEvent";
import ChannelUtils from "./ChannelUtils";
import SDKEvent from "../sdk/tools/SDKEvent";
import { GEvent } from "../../cfw/event";
import SDKManager from "../sdk/SDKManager";
import SoundMgr from "../../logic/sound/model/SoundMgr";
import MoreGameC from "../moregame/MoreGameC";
import lc_sdk from "../lib/lc_sdk";
// import SoundMgr from "../../script/sound/model/SoundMgr";

//umeng 61e7ff65e014255fcbf74ce3
export default class WXHelper extends BaseHelper {


    protected openID: string = ''

    protected clickMap: Map<string, GameItemModel[]> = new Map()

    protected sdk: lc_sdk;
    protected zsConfig = {
        zs_version: '1.0',
        zs_switch: 0,//误触总开关(1-开 0-关)
        zs_banner_city: 0,
        zs_native_click_switch: 1,
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
        zsSdk.initSdkByConf({ channel: "wx", appId: "wx5c9a857b04bbd820", secret: "05a5facc4c566d5ac23ed9a7563646d2"});
        this.login()
        this.loadConfig()
    }

    rewardOpen() {
        console.log('rewardOpen ')
        SoundMgr.instance().rewardOpen()
    }

    rewardClose() {
        SoundMgr.instance().rewardClose()
    }

    getProcessTime() {
        return this.zsConfig.zs_process_time;
    }

    firstExport() {
        return this.isSwtichOpen() && this.zsConfig.zs_game_star_jump_switch == 1
    }

    getBannerRefreshTime() {
        return this.zsConfig.zs_banner_game_time
    }

    getFriendDuration() {
        if (typeof (this.zsConfig.zs_text_message) == 'string') {
            return parseInt(this.zsConfig.zs_text_message)
        }
        return this.zsConfig.zs_text_message
    }

    hasFriend() {
        return true;
    }

    getBannerDelayTime() {
        return this.zsConfig.zs_banner_time;
    }


    hasCrazyClick() {
        return true;
    }


    isShowAgain() {
        return this.zsConfig.zs_click_award_prompt == 1
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

    getRewardNum() {
        return this.zsConfig.zs_click_award_num
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

    isVersion() {
        return ChannelUtils.compareVersion(this.verson, this.zsConfig.zs_version) == 1
    }
    isSwtichOpen() {
        return this.zsConfig.zs_switch == 1
    }

    isOpen() {
        return this.isVersion() && this.isSwtichOpen();
    }

    isOpenNativeErrorClick() {
        return ChannelUtils.compareVersion(this.verson, this.zsConfig.zs_version) == 1 && this.zsConfig.zs_native_click_switch == 1
    }


    isSystemOpen() {
        if (this.zsConfig.zs_banner_system == "") {
            return true;
        }
        return this.getOS() != this.zsConfig.zs_banner_system
    }




    isErrorClickOpen() {
        return this.isSwtichOpen() && this.isSystemOpen() && this.zsConfig.zs_banner_city == 1
    }


    isStartErrorClick() {
        return this.isErrorClickOpen() && this.zsConfig.zs_start_video_switch == 1;
    }

    isBannerErrorClick() {
        return this.isErrorClickOpen() && this.zsConfig.zs_banner_vertical_enable == 1;
    }

    hasEgg() {

        return false;


    }
    hasAgreement() {
        return false;
    }
    loadAd() {
        console.log(' loadAd start')
        let zsSdk = this.sdk
        zsSdk.loadAd((res) => {
            if (res && res.promotion) {
                console.log(' res.promotion ', res.promotion)
                this.adData.length = 0;
                for (let index = 0; index < res.promotion.length; index++) {
                    const element = res.promotion[index];
                    let game = new ZSGameItemModel(element);
                    this.adData.push(game)
                }
                for (let index = 0; index < this.adData.length; index++) {
                    const game = this.adData[index];
                    this.setAdClickParam(game)
                }
                this.sortAdData()
            } else {
                setTimeout(() => {
                    this.loadAd()
                }, 3000);
            }

            // console.log(' loadAd data is ', res)

        })
    }


    hideCustomAd(index: number) {
        SDKManager.getChannel().hideCustomAd(index)
    }

    setAdClickParam(game: GameItemModel) {
        if (!game) {
            return;
        }
        let gameName = game.getGameName()
        let list: GameItemModel[] = this.clickMap.get(gameName)
        if (list == undefined || list.length <= 0) {
            list = []
            this.clickMap.set(gameName, list)
            for (let j = 0; j < this.adData.length; j++) {
                const element = this.adData[j];
                list.push(element)
            }
            // console.log('setAdClickParam length  ',list.length ,' gameName ',gameName)
        }

    }

    getAdData() {

        return this.adData
    }

    refresh() {

    }

    sortAdData() {
        // this.adData.sort((a: GameItemModel, b: GameItemModel) => {
        //     return b.getPriority() - a.getPriority()
        // })
        ChannelEvent.instance().emit(ChannelEvent.LOAD_EXPORT_DATA)
    }

    changeData(m: GameItemModel) {
        if (!m) {
            return;
        }
        let oldIndex = this.adData.indexOf(m)
        console.log(' oldIndex ', oldIndex)
        if (oldIndex >= 0) {
            let item = this.adData.splice(oldIndex, 1)
            let newIndex = ChannelUtils.random(0, this.adData.length)
            if (oldIndex == newIndex) {
                for (let index = 0; index < 10; index++) {
                    newIndex = ChannelUtils.random(0, this.adData.length)
                    if (oldIndex != newIndex) {
                        break;
                    }
                }
            }
            console.log(' newIndex ', newIndex, ' this.adData.length ', this.adData.length)
            this.adData.splice(newIndex, 0, item[0])
            ChannelEvent.instance().emit(ChannelEvent.LOAD_EXPORT_DATA)
        }


    }

    toOtherGame(model: GameItemModel, success?: Function, fail?: Function, complete?: Function) {
        if (this.openID && model) {
            let zsSdk = this.sdk
            let data = model.getData();
            zsSdk.navigate2Mini(data, this.openID, success, fail, complete)
        }
    }

    navigate2Mini(model: GameItemModel, success?: Function, fail?: Function, complete?: Function) {
        if (this.openID && model) {
            let zsSdk = this.sdk
            let gameName = model.getGameName();
            let list = this.clickMap.get(gameName)
            if (list && list.length > 0) {
                let index = list.indexOf(model)
                if (index >= 0) {//存在这个游戏
                    let data = model.getData();
                    zsSdk.navigate2Mini(data, this.openID, success, fail, complete)
                    list.splice(index, 1)
                } else {
                    //随机一个位置
                    let index = ChannelUtils.random(0, list.length)
                    let game = list[index]
                    let data = game.getData();
                    zsSdk.navigate2Mini(data, this.openID, success, fail, complete)
                    list.splice(index, 1)
                }
                // console.log('navigate2Mini length  ',list.length ,' gameName ',gameName)
                if (list.length <= 0) {
                    this.setAdClickParam(model)
                } else {

                }
            } else {
                this.setAdClickParam(model)
            }
            this.changeData(model)
        }
    }

    //是否弹出开始游戏后的砸蛋界面
    isOpenStartEgg() {
        // let loginCount = User.instance().getLoginCount();
        let loginCount = 3;
        return this.isErrorClickOpen() && this.zsConfig.zs_begin_click_switch == 1 &&
            loginCount >= this.zsConfig.zs_begin_click__since;
    }

    hasBigExport() {
        return true;
    }

    hasDiamonView() {
        return true;
    }
    hasMoreGame() {
        return true;
    }

    openMoreGameView(index: number, rx: number, ry: number) {
        MoreGameC.instance().intoLayer()
    }

    hasNormalShare() {
        return true
    }
}
