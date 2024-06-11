import BaseAd from "./BaseAd";
import { ResultCallback, ResultState, NativeAdCallback, DataCallback, SDKDir, SDKState, ADDir, getChannel } from "../SDKConfig";
import { BaseShare } from "./BaseShare";
import BaseLogin from "./BaseLogin";
import BaseSubPackage from "./BaseSubPackage";
import BaseScrennshot from "./BaseScreenshot";
import BaseRecorder from "./BaseRecorder";
import SDKHelper from "../SDKHelper";
import SDKFileSystemManager from "./SDKFileSystemManager";
import BaseSDK from "./BaseSDK";
import BaseBannerAd from "./BaseBannerAd";
import BaseRewardAd from "./BaseRewardAd";
import BaseInsertAd from "./BaseInsertAd";
import BaseNativeAd from "./BaseNativeAd";
import BaseCustomAd from "./BaseCustomAd";
import BaseBlockAd from "./BaseBlockAd";
import SDKEvent from "../tools/SDKEvent";

export default class BaseChannel extends BaseSDK {


    //激励视频
    protected rewardAd: BaseRewardAd[] = [];
    //banner广告实例
    protected bannerAd: BaseBannerAd[] = [];
    //插屏广告
    protected insertAd: BaseInsertAd[] = [];
    //分享实例
    protected share: BaseShare = null;
    //小游戏分包
    protected subPackage: BaseSubPackage = null;
    //原生广告
    protected nativeAd: BaseNativeAd;
    //盒子广告
    protected appBoxAd: BaseAd[] = [];

    //盒子广告
    protected boxPortalAd: BaseAd[] = [];
    //qq积木广告
    protected blockAd: BaseBlockAd[] = []
    //登陆
    protected loginMgr: BaseLogin = null;
    //录屏功能
    protected recorder: BaseRecorder = null;
    //截屏功能
    protected screenshot: BaseScrennshot = null;

    protected fileSystem: SDKFileSystemManager;

    protected selfRender: BaseAd[] = [];

    //微信模板广告
    protected customAd: BaseCustomAd[] = [];

    protected event: SDKEvent;

    protected visibleSize: any;

    protected clientScaleX: number = 1;

    protected clientScaleY: number = 1;

    setClientScaleX(x: number) {
        this.clientScaleX = x;
    }

    setClientScaleY(n: number) {
        this.clientScaleY = n;
    }

    getClientScaleY() {
        return this.clientScaleY
    }

    getClientScaleX() {
        return this.clientScaleX
    }

    setVisibleSize(s: any) {
        this.visibleSize = s;
    }

    getVisibleSize() {
        return this.visibleSize;
    }


    //渠道配置数据
    protected cfg: any;

    constructor(data: any) {
        super(getChannel())
        this.cfg = data
        this.init();
    }


    get channelID() {
        return this.cfg.name;
    }

    hasBoxPortalAd() {
        return this.boxPortalAd.length > 0
    }

    showBoxPortalAd(index: number) {
        if (this.boxPortalAd[index]) {
            this.boxPortalAd[index].open();
        }
    }

    trackEvent(eventID: string, param?: any) {
        if (this.event) {
            this.event.trackEvent(eventID, param)
        }
    }

    exitApplication() {

    }

    init() {

    }


    saveTextureData(data: any, flag: boolean = false, callback?: Function) {
        if (this.screenshot) {
            this.screenshot.saveFile(data, flag, callback)
        } else {
            callback(null)
        }
    }

    hasBlockAd(index: number) {
        return this.blockAd.length > index
    }

    showBlockAd(index: number, rx: number, ry: number, count: number = 1, dir: string = ADDir.landscape) {
        console.log('this.hasBlockAd(index)', this.hasBlockAd(index))
        if (this.hasBlockAd(index)) {
            this.blockAd[index].setCount(count)
            this.blockAd[index].setDir(dir)
            this.blockAd[index].setPosition(rx, ry)
            this.blockAd[index].open()
        }
    }

    hideBlockAd(index: number) {
        if (this.blockAd[index]) {
            this.blockAd[index].close()
        }
    }

    hasCustomAd() {
        return this.customAd.length > 0
    }

    openCustomAd(index: number) {
        if (this.hasCustomAd()) {
            if (this.customAd[index]) {
                this.customAd[index].show()
            }
        }
    }

    isCustomAdOk(index: number) {
        if (this.customAd[index]) {
            return this.customAd[index].isOk()
        }
        return false;
    }

    showCustomAd(index: number, rx: number = 0, ry: number = 0, func?: ResultCallback) {
        if (this.hasCustomAd()) {
            if (this.customAd[index]) {
                this.customAd[index].setRx(rx)
                this.customAd[index].setRy(ry)
                this.customAd[index].open(func)
            }
        }
    }

    hideCustomAd(index: number = 0) {
        console.log(' customAd count ', this.customAd.length, index)
        if (this.customAd[index]) {
            this.customAd[index].close()
        }
    }

    destroyCustomAd(index: number = 0) {
        if (this.hasCustomAd()) {
            this.customAd[index].destroy()
        }
    }

    loadCustomAd(index: number = 0, func?: ResultCallback) {
        if (this.hasCustomAd()) {
            this.customAd[index].setCallback(func)
            this.customAd[index].preload(SDKState.close)
        }
    }

    // getID() {
    //     return this.channelID;
    // }

    hasFileSystem() {
        return this.fileSystem != null;
    }

    /**
     * 
     * @param filePath 
     * @param data 
     * @param encoding 
     * @param param 
     */
    writeFileSync(filePath: string, data: any, encoding: string, param?: any): boolean {
        if (this.hasFileSystem()) {
            return this.fileSystem.writeFileSync(filePath, data, encoding, param)
        }
        return false;
    }


    /**
     * 
     * @param filePath 
     * @param encoding 
     */
    readFileSync(filePath: string, encoding: string): any {
        if (this.hasFileSystem()) {
            return this.fileSystem.readFileSync(filePath, encoding)
        }
        return null;
    }

    readFile(filePath: string, encoding: string, callback: DataCallback) {
        if (this.hasFileSystem()) {
            this.fileSystem.readFile(filePath, encoding, callback)
        } else {
            callback(ResultState.NO, null)
        }
    }

    writeFile(filePath: string, data: any, encoding: string, callback: ResultCallback) {
        if (this.hasFileSystem()) {
            this.fileSystem.writeFile(filePath, data, encoding, callback)
        } else {
            callback(ResultState.NO)
        }

    }

    hasParam(name: string) {
        let param = this.cfg[name]
        if (param == undefined || param == null) {
            return false;
        }
        if (Array.isArray(param)) {
            return param.length > 0
        }
        return true;
    }


    getParamValue(adName: string) {
        return this.cfg[adName]
    }


    getBannerAd() {
        return this.bannerAd;
    }

    // getBannerByIndex(index: number) {
    //     if (this.bannerAd.length > index) {
    //         return this.bannerAd[index]
    //     }
    // }

    /**
     * 是否有banner广告
     */
    hasBanner() {
        return this.bannerAd.length > 0
    }
    /**
     * 显示banner广告
     * @param site 广告位索引
     */
    showBanner(site: number, d: SDKDir = SDKDir.BOTTOM_MID, func?: ResultCallback) {
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].setDir(d)
            this.bannerAd[site].updateSize()
            this.bannerAd[site].open(func)
        }
    }

    isBannerOk(site: number) {
        if (this.hasBanner() && this.bannerAd[site]) {
            return this.bannerAd[site].isOk()
        }
        return false;
    }

    showBannerByXYWH(site: number, x: number, y: number, w: number, h: number, func?: ResultCallback) {
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].setDir(SDKDir.XY)
            this.bannerAd[site].setPosition(x, y)
            this.bannerAd[site].setContentSize(w, h)
            this.bannerAd[site].updateSize()
            this.bannerAd[site].open(func)
        }
    }

    showBannerByXY(site: number, x: number, y: number, func?: ResultCallback) {
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].setDir(SDKDir.XY)
            this.bannerAd[site].setPosition(x, y)
            this.bannerAd[site].updateSize()
            this.bannerAd[site].open(func)
        }
    }

    preloadBannerByXY(site: number, x: number, y: number, func?: ResultCallback) {
        if (this.bannerAd[site]) {
            this.bannerAd[site].setDir(SDKDir.XY)
            this.bannerAd[site].setPosition(x, y)
            this.bannerAd[site].updateSize()
            this.bannerAd[site].preload(SDKState.close)
        }
    }

    openBanner(site: number) {
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].show()
        }
    }
    //隐藏banner广告
    hideBanner(site: number = 0) {
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].close()
        } else {
            // console.log('hideBanner error ', site, this.bannerAd.length)
        }
    }

    loadBanner(site: number = 0, state?: number) {
        if (this.hasBanner() && this.bannerAd[site]) {
            this.bannerAd[site].preload(state)
        }
    }

    // createBanner(site: number = 0) {
    //     if (this.hasBanner() && this.bannerAd[site]) {
    //         this.bannerAd[site].destroy();
    //         this.bannerAd[site].create();
    //         return this.bannerAd[site].getInstance()
    //     }
    // }

    refreshBanner() {

    }

    /**
     * 是否有插屏广告
     */
    hasInsertAd() {
        return this.insertAd.length > 0
    }

    /**
     * 展示插屏广告
     */
    showInsertAd(site: number, func?: ResultCallback) {
        if (this.hasInsertAd()) {
            this.insertAd[site].open(func)
        }
    }

    closeInsertAd(site: number = 0) {

    }

    loadInsertAd(site: number = 0, func: ResultCallback) {
        if (this.hasInsertAd()) {
            this.insertAd[site].load(func)
        }
    }

    //是否有激励视频广告
    hasRewardAd() {
        return this.rewardAd.length > 0
    }

    isRewardAdState(site: number, s: number) {
        if (this.hasRewardAd() && this.rewardAd[site]) {
            return this.rewardAd[site].isState(s)
        }
        return false;
    }
    //展示激励视频广告
    showRewardAd(site: number, callback: ResultCallback) {
        // console.log(' showRewardAd ', site, this.rewardAd.length)
        if (this.hasRewardAd() && this.rewardAd[site]) {
            // console.log('showRewardAd 22222 ')
            this.rewardAd[site].open(callback)
        } else {
            callback(ResultState.YES)
        }
    }

    /**
    * 获取介于min与max之间的随机数，返回值大于等于min，小于等于max
    * @param min 最小值
    * @param max 最大值
    */
    public getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
    * 获取介于min与max之间的随机数，返回值大于等于min，小于max
    * @param min 最小值
    * @param max 最大值
    */
    public random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    loadRewardAd(site: number) {
        if (this.hasRewardAd() && this.rewardAd[site]) {
            this.rewardAd[site].reload(SDKState.close)
        }
    }

    //是否有分享能力
    hasShare() {
        return this.share != null;
    }

    /**
     * 分享
     * @param site 
     * @param callback 
     */
    showShare(site: number, callback: ResultCallback, videoPath?: string) {
        if (this.hasShare()) {
            this.share.share(site, callback, videoPath)
        } else {
            callback(ResultState.YES)
        }
    }
    shareWithUrl(site: number, url: string, callback?: ResultCallback) {
        if (this.hasShare()) {
            this.share.shareWithUrl(site, url, callback)
        } else {
            callback(ResultState.YES)
        }
    }


    //短震动
    vibrateShort() {

    }
    //展示网络图片
    previewImage(imgUrl: string) {

    }
    //跳转能力
    navigateToMiniProgram(appID: string) {

    }

    hasLogin() {
        return !SDKHelper.isNull(this.loginMgr)
    }

    /**
     * 登陆游戏
     * @param account 
     * @param func 
     */
    login(account: string, func: DataCallback) {
        if (this.hasLogin()) {
            this.loginMgr.login(account, func)
        } else {
            func(ResultState.YES, null)
        }
    }

    showUserAgreement(func: ResultCallback) {
        if (this.loginMgr) {
            this.loginMgr.showUserAgreement(func)
        } else {
            func(ResultState.YES)
        }
    }

    /**
     * 获取用户信息
     * @param withCredentials 
     * @param lang 
     * @param func 
     */
    getUserInfo(withCredentials: string, lang: string, func: DataCallback) {
        if (this.hasLogin()) {
            this.loginMgr.getUserInfo(withCredentials, lang, func)
        }
    }
    /**
     * 检查登陆状态
     * @param callback 
     */
    checkSession(callback: ResultCallback) {
        if (this.hasLogin()) {
            this.loginMgr.checkSession(callback)
        } else {
            callback(ResultState.YES)
        }
    }

    postMessage(msg: any) {

    }

    hasSubPackage() {
        return this.subPackage != null;
    }

    loadSubPackage(subNames: string, callback: DataCallback, onProgress?: (finished: number, total: number, item?: any) => void) {
        if (this.hasSubPackage()) {
            this.subPackage.loadSubpackage(subNames, callback, onProgress);
        } else {
            callback(ResultState.YES, null)
        }
    }

    hasScreenshot() {
        return this.screenshot != null;
    }

    showScreenshot(texture: any, isShow: boolean = false) {
        if (this.hasScreenshot()) {
            this.screenshot.capture(texture, isShow)
        }
    }


    getNativeAd() {
        return this.nativeAd;
    }


    hasNativeAd() {
        return this.nativeAd != undefined;
    }

    showNativeAd(index: number, callback: NativeAdCallback) {
        if (this.hasNativeAd()) {
            this.nativeAd.open2(index, callback)

        }
    }

    hideNativeAd() {
        if (this.hasNativeAd()) {
            this.nativeAd.close()
        }
    }

    reportAdClick(adId: string) {
        if (this.hasNativeAd()) {
            this.nativeAd.reportAdClick(adId)
        }
    }

    reportAdShow(adId: string) {
        if (this.hasNativeAd()) {
            this.nativeAd.reportAdShow(adId)
        }
    }

    hasRecorder() {
        return this.recorder != null;
    }

    recorderStart(obj?: any) {
        if (this.hasRecorder()) {
            this.recorder.start(obj)
        }
    }

    getRecorder() {
        return this.recorder;
    }


    recorderStop(isSave: boolean = true, callback: (r: number) => void) {
        if (this.hasRecorder()) {
            this.recorder.stop(isSave, callback)
        }
    }


    hasAppBox() {
        return this.appBoxAd.length > 0
    }

    showAppBoxAd(index: number = 0, func?: Function) {
        if (this.hasAppBox()) {
            this.appBoxAd[index].open(func)
        }
    }

    destroyAppBoxAd() {

    }


    showToast(title: string) {

    }
    canInstallShortcut(func: ResultCallback) {
        func(ResultState.NO)
    }

    /**
     * 安装图标到桌面
     * @param result 
     */
    installShortcut(result: ResultCallback) {
        result(ResultState.NO)
    }


    //创建更多游戏按钮
    createMoreGameButton(xr: number, yr: number, w: number, h: number) {

    }

    hideMoreGameButton() {

    }
    //显示更多游戏面板
    showMoreGameView() {

    }
    //是否有更多游戏
    hasMoreGame() {
        return false;
    }

    loadConfig() {

    }

    createCanvas() {

    }

    cantUseImageDataURL() {
        return true;
    }

    request(url: string, func: Function) {
        this.sdk.request({
            url: url, //仅为示例，并非真实的接口地址
            timeout: 15000,
            header: {
                'content-type': 'application/json', // 默认值
                'If-Modified-Since': '0'
            },
            success(res) {
                // console.log('request success', res.data)
                func(null, res.data)
            },
            fail(err) {
                // console.log('request err', err)
                func(' error ', err)
            }
        })
    }

    showCustomAdByDir(index: number, dir: SDKDir = SDKDir.MID, rIndex: number = 2, func?: ResultCallback) {
        if (this.customAd[index]) {
            this.customAd[index].setRIndex(rIndex)
            this.customAd[index].setDir(dir)
            this.customAd[index].open(func)
        }
    }


    showSelfRender(param: { index: number, click_switch: number, callback: ResultCallback, close_num: number }) {
        if (this.selfRender[param.index]) {
            this.selfRender[param.index].open(param)
        }
    }

    loadSelfRender(param: { index: number, logicState: SDKState }) {
        if (this.selfRender[param.index]) {
            this.selfRender[param.index].load(param.logicState)
        }
    }

    initAd(){
        
    }
}
