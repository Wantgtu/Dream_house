/**
 * qq:https://q.qq.com/wiki/
 * tt:https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/start/introduction/
 * wx:https://developers.weixin.qq.com/minigame/dev/guide/
 * vivo:https://minigame.vivo.com.cn/documents/#/
 * swan:https://smartprogram.baidu.com/docs/introduction/enter_application/
 * oppo:https://activity-cdo.heytapimage.com/cdo-activity/static/201810/26/quickgame/documentation/#/README
 */


import BaseNativeAdItemModel from "./base/BaseNativeAdItemModel";

export type DataCallback = (result: ResultState, data: any) => void;
export type ResultCallback = (result: ResultState) => void
export type NativeAdCallback = (list: BaseNativeAdItemModel[]) => void;
//广告名称，对应SDKCOnfig中的key
export class ADName {
    static adUnitIdList: string = 'adUnitIdList'
    static version: string = 'version'
    static banner: string = 'banner'//bander 广告
    static blockAd: string = 'blockAd'//qq积木广告
    static reward: string = 'reward'//激励视频
    static insert: string = 'insert'//插屏广告
    static insertReward: string = 'insertReward'//插屏激励视频广告
    static native: string = 'native'//原生广告
    static portal: string = 'portal' //oppo 格子广告
    static BoxBanner: string = 'BoxBanner' //vivo 横幅广告
    static BoxPortal: string = 'BoxPortal'//vivo  格子广告
    static appbox: string = 'appbox'//盒子广告
    static gridAd: string = 'gridAd'//微信格子广告
    static shareTitle: string = 'shareTitle'//分享标题
    static shareImage: string = 'shareImage'//分享图片或者ID
    static imageUrlId: string = 'imageUrlId'
    static imageUrl: string = 'imageUrl'
    static appid: string = 'appid'
    static share: string = 'share'
    static launchOptionsConfig: string = 'launchOptionsConfig'
    static customAd: string = 'customAd'
    static loadingAd: string = 'loadingAd'
    static recorder: string = 'recorder'
    static selfrender = 'selfrender'
}
export class FileEncoding {
    static UTF8: string = 'utf8'
    static BINARY: string = 'binary'
}

//广告拉取失败是否使用分享
export let USE_SHARE: boolean = true;


export enum ResultState {
    NO,
    YES,
    PROGRESS,
}

export enum SDKDir {
    BOTTOM_MID,//屏幕下中，常用
    BOTTOM_LEFT,//屏幕下左
    TOP_MID,//屏幕上中
    RIGHT_MID,//屏幕右中
    LEFT_TOP,//屏幕左上
    UP_MID,//屏幕上中
    MID,//屏幕中间
    XY,//根据给定屏幕百分比设置广告位置
    NONE,
    WHITE,//白点，宽高为1的banner


}

export class ADDir {
    static vertical: string = 'vertical'
    static landscape: string = 'landscape'
}

/**
 * 广告状态
 * 
 */
export enum SDKState {
    loadFail,//加载失败
    loadSucess,//加载成功
    close,//关闭状态
    loading,//加载状态
    open,//播放状态
    start,//结束
    stop

}

/**
0	开发
1	微信
2	QQ
3	头条
4	OPPO
5	VIVO
6	百度
7   cocos play
8   穿山甲
9   google admob 
10  4399
11 快手融合sdk
 */
export class ChannelID {
    static DEV: any = 'dev'
    static WX: any = 'wx'
    static QQ: any = 'qq'
    static TT: any = 'tt'
    static OPPO: any = 'OPPO'
    static VIVO: any = 'vivo'
    static SWAN: any = 'swan'
    static COCOS: any = 'AdSDK'
    static CSJ: any = 'csj'
    static GOOGLE_ADMOB: any = 'google'
    static F399: any = 'h5api'
    static KWAI: any = 'kwai'
    static VIGOO: any = 'vigoo'
    static KS: string = 'ks'
    static MIMO: string = 'mimo'
}

let QG: any = 'qg'


export enum FunctionType {
    onLoad,
    onError,
    onClose,
    onResize,
    onHide,
    onRefresh,
    onShow
}
let CHANNEL_NAMES: string[] = ['ks', 'qq', 'tt', 'wx', 'qg', 'swan', 'h5api', 'AdSDK']
let SDK_NAMES: string[] = CHANNEL_NAMES.concat('native')// ['ks', 'qq', 'tt', 'wx', 'qg', 'swan', 'h5api', 'AdSDK', 'Native']
export function getChannel() {

    for (let index = 0; index < SDK_NAMES.length; index++) {
        const element: any = SDK_NAMES[index];
        if (window[element]) {
            return window[element]
        }
    }

    return null;
}

export function getChannelID(id?: string): string {
    for (let index = 0; index < CHANNEL_NAMES.length; index++) {
        let channel: any = CHANNEL_NAMES[index];
        const element: any = window[channel];
        if (element) {
            let qg: any = QG
            if (channel == qg) {
                let sys = element.getSystemInfoSync()
                console.log(' sys ', sys.brand)
                return sys.brand
            } else {
                return channel;
            }
        }
    }
    return id;
}