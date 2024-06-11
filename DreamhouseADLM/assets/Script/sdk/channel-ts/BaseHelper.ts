import GameItemModel from "./GameItemModel";
import BaseChannel from "../sdk/base/BaseChannel";
import { ResultCallback, SDKDir } from "../sdk/SDKConfig";
import SDKManager from "../sdk/SDKManager";
import DailyTaskMgr from "../../logic/dailytask/model/DailyTaskMgr";
import { DailyTaskID, ItemID } from "../../config/Config";
import { DIR } from "../../cfw/tools/Define";
import Debug from "../../cfw/tools/Debug";
import BagManager from "../../logic/public/bag/BagManager";
import EngineHelper from "../../engine/EngineHelper";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";
import LuckySpinC from "../../logic/luckyspin/LuckySpinC";
import BoxPopC from "../../logic/boxpop/BoxPopC";
import LobbyC from "../../logic/lobby/LobbyC";
let osMap = {
    'Android': 'android',
    "iOS": 'ios'
}
export default class BaseHelper {
    protected verson: string = '1.0'

    protected adData: GameItemModel[] = [];
    // protected c: BaseChannel;


    constructor() {
        Debug.isDebug = false
    }

    // set channel(c: BaseChannel) {
    //     this.c = c;
    // }

    // get channel() {
    //     return this.c;
    // }

    isF399() {
        return false;
    }

    trackEvent(eventID: string, param?: any) {
        SDKManager.getChannel().trackEvent(eventID, param)
    }
    hasEmail() {
        return true;
    }

    getVersion() {
        return this.verson;
    }

    marketHasType(type: number) {
        if (type == 4) {
            return SDKManager.getChannel().hasShare();
        }
        return true;
    }

    showShare(site: number, callback: ResultCallback, videoPath?: string) {
        SDKManager.getChannel().showShare(site, callback, videoPath)
    }

    showFuncInsertAd(site: number) {
        SDKManager.getChannel().showInsertAd(site)
    }
    showInsertAd(site: number) {
        SDKManager.getChannel().showInsertAd(site)
    }
    showRewardAd(site: number, callback: ResultCallback) {
        SDKManager.getChannel().showRewardAd(site, (r: number) => {
            callback(r)
            if (r) {
                DailyTaskMgr.instance().updateTaskCount(DailyTaskID.AD)

                if (!this.canMultyAd()) {
                    BagManager.instance().updateItemNum(ItemID.SCRATCH_CARD, 1, EngineHelper.getMidPos())
                }

            }
        })
    }
    getBoxResult() {
        return 0;
    }

    isOpen() {
        return false;
    }

    getBannerTime() {

        return 30;
    }


    getAddress() {
        return ''
    }
    getClickParent(): any[] {
        return [0.4, 0.7];
    }
    getClickBack() {

        return 10;
    }
    getClickAdd() {

        return 15;
    }

    updateClickNum() {

    }

    hideCustomAd(index: number) {
        SDKManager.getChannel().hideCustomAd(index)
    }

    showCustomAd(index: number, rx: number, ry: number) {
        SDKManager.getChannel().showCustomAd(index, rx, ry)
    }
    getEmail() {
        return '135024930@qq.com'
    }

    hasAgreement() {
        return false;
    }

    getAppName() {
        return '梦幻别院'
    }

    getCompany() {
        return '北京旺兔航天科技有限公司'
    }
    getClickResult() {
        return 0;
    }

    setVersion(v: string) {
        this.verson = v;
    }


    hasNativeNextLimit() {
        return false
    }

    hasFriend() {
        return false;
    }

    getFriendDuration() {
        return 0
    }

    hasEgg() {
        return false;
    }

    loadConfig() {

    }

    hasNativeAd() {
        return false;
    }

    login(param?: any) {

    }
    getProcessTime() {
        return 0
    }

    getBannerRefreshTime() {
        return 30
    }
    isShowAgain() {
        return false;
    }

    getRewardNum() {
        return 1;
    }


    isVersion() {
        return false
    }

    isOpenNativeErrorClick() {
        return false
    }

    isSwtichOpen() {
        return false
    }

    isSystemOpen() {
        return false
    }

    getBannerDelayTime() {
        return 2
    }

    getOS() {
        // return osMap[cc.sys.os]
        return ''
    }

    isErrorClickOpen() {
        return false
    }

    isStartErrorClick() {
        return false
    }

    isBannerErrorClick() {
        return false
    }


    loadAd() {

    }

    setAdClickParam(game: GameItemModel) {


    }

    getAdData() {

        return this.adData
    }

    refresh() {

    }

    hasCrazyClick() {
        return false;
    }

    sortAdData() {

    }

    changeData(m: GameItemModel) {


    }

    toOtherGame(model: GameItemModel, success?: Function, fail?: Function, complete?: Function) {

    }

    navigate2Mini(model: GameItemModel, success?: Function, fail?: Function, complete?: Function) {

    }

    //是否弹出开始游戏后的砸蛋界面
    isOpenStartEgg() {
        // let loginCount = User.instance().getLoginCount();
        return false;
    }



    firstExport() {
        return false;
    }
    hasSinglePrivicy() {
        return true;
    }
    hasNativeLimit() {
        return false;
    }

    hasBigExport() {
        return false;
    }

    hasLoginBanner() {
        return false;
    }

    hasDiamonView() {
        return false;
    }

    hasNativeTouchSwitch() {
        return false;
    }

    cantUseImageDataURL() {
        return false;
    }

    getNativeCloseNum() {
        return 0;
    }

    getNativeBannerRefreshTime() {
        return 30;
    }

    getJumpTime() {
        return 0
    }

    getBannerWitch() {
        return 0;
    }

    getNativeSlide() {
        return false;
    }

    hasBanner() {
        return false;
    }

    getzs_native_gap_time() {
        return 0;
    }

    getAdSprite() {
        return 'texture/gift_sprite/gift_sprite_1024x1024_A_01_4'
    }

    getzs_native_show_delay() {

        return 0;
    }

    getzs_start_native_switch() {
        return 0;
    }

    isJumpSwitchOpen() {
        return false
    }

    getzs_native_btn_text() {
        return ''
    }

    noOneMinAdLimit() {
        return false
    }

    hasMoreGame() {
        return false;
    }

    openMoreGameView(index: number = 0, rx: number = 0, ry: number = 0) {

    }

    getzs_box_switch() {
        return false;
    }

    getzs_box_show_delay() {
        return 0;
    }

    getzs_video_box() {
        return 0
    }

    getzs_start_turntable() {
        return false
    }

    getzs_native_change_switch() {
        return 0;
    }

    showBannerAd(index: number, dir: SDKDir) {
        SDKManager.getChannel().showBanner(index, dir)
    }

    hideBannerAd(index: number) {
        SDKManager.getChannel().hideBanner(index)
    }

    hideFuncInsertAd(index: number) {

    }

    hideInsertAd(index: number) {

    }

    hasNormalShare() {
        return false
    }

    getClick_award_video() {
        return 0;
    }

    getzs_banner_force_click() {
        return false
    }

    getzs_advert_change() {
        return 0;
    }

    hasInstallApp() {
        return false;
    }

    canMultyAd() {
        return true;
    }

    intoGame() {

    }

    getzs_native_click_switch() {
        return 0;
    }

    sheduleGame() {

    }

    leaveGame() {

    }

    firstIntoLobby() {

    }

    startGame() {
        LobbyC.instance().intoLayer()
    }

    hasOnline() {
        return false;
    }

    hasOffline() {
        return true;
    }

    hasDailyTask() {
        return false;
    }

    hasLuckySpin() {
        return true;
    }

    hasGiftSpecial() {
        return true;
    }

    hasSpecialtask() {
        return true;
    }
}
