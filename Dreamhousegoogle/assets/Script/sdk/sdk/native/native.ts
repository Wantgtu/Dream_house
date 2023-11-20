
import SDKEvent from "../tools/SDKEvent";
import NativeSelftRenderAd from "./ads/NativeSelftRenderAd";
import NativeNativeAd from "./ads/NativeNativeAd";
import NativeBannerAd from "./ads/NativeBannerAd";
import NativeRewardedVideoAd from "./ads/NativeRewardedVideoAd";
import NativeTemplateAd from "./ads/NativeTemplateAd";
import NativeInterstitialAd from "./ads/NativeInterstitialAd";
import NativeName from "./NativeName";
import NativeSystem from "./NativeSystem";
import NativeAgreement from "./NativeAgreement";
let $$ = '$$'
export default class Native {


    static createSelfRenderAd(data) {
        let ad = new NativeSelftRenderAd();
        ad.data = data;
        ad.create(data)
        return ad;
    }

    static createNativeAd(data): NativeNativeAd {
        let ad = new NativeNativeAd();
        ad.data = data;
        ad.create(data)
        return ad;
    }

    static createBannerAd(data) {
        let ad = new NativeBannerAd();
        ad.data = data;
        ad.create(data)
        return ad;
    }

    static createRewardedVideoAd(data) {
        console.log('NativeTest createRewardedVideoAd data ', data)
        let ad = new NativeRewardedVideoAd();
        ad.data = data;
        ad.create(data)
        return ad;
    }

    static createInterstitialAd(data) {
        let ad = new NativeInterstitialAd()
        ad.data = data;
        ad.create(data)
        return ad;
    }
    static createTemplateAd(data) {
        let ad = new NativeTemplateAd()
        ad.data = data;
        ad.create(data)
        return ad;
    }
    static getSystemInfoSync() {
        return {
            width: 300,
            height: 200,
        }
    }

    //java call functions 
    static bannerAdCallback(param: string) {
        console.log('NativeTest bannerAdCallback param', param)
        let list = param.split($$);
        let id = list[0]
        let result = parseInt(list[1])
        SDKEvent.instance().emit(NativeName.bannerAdCallback, id, result);
    }


    static bannerResize(param: string) {
        console.log('NativeTest bannerResize param', param)
        let list = param.split($$);
        let id = list[0]
        let size = list[1]
        SDKEvent.instance().emit(NativeName.bannerResize, id, size);
    }



    static insertAdCallback(param: string) {
        let list = param.split($$);
        let id = list[0]
        let result = parseInt(list[1])
        SDKEvent.instance().emit(NativeName.insertAdCallback, id, result);

    }

    static rewardAdCallback(param: string) {
        console.log('NativeTest rewardAdCallback param', param)
        let list = param.split($$);
        let id = list[0]
        let result = parseInt(list[1])
        console.log('NativeTest rewardAdCallback result ', id, result)
        SDKEvent.instance().emit(NativeName.rewardAdCallback, id, result);
    }


    static rewardAdClose(param: string) {
        console.log('NativeTest rewardAdClose param', param)
        let list = param.split($$);
        let id = list[0]
        let result = parseInt(list[1])
        console.log('NativeTest rewardAdClose result ', id, result)
        SDKEvent.instance().emit(NativeName.rewardAdClose, id, result);
    }

    static templateAdCallback(param: string) {
        console.log('NativeTest templateAdCallback param', param)
        let list = param.split($$);
        let id = list[0]
        let result = parseInt(list[1])
        console.log('NativeTest templateAdCallback result ', id, result)
        SDKEvent.instance().emit(NativeName.templateAdCallback, id, result);
    }
    static selfRenderAdCallback(param: string) {
        console.log('NativeTest selfRenderAdCallback param', param)
        let list = param.split($$);
        let id = list[0]
        let result = parseInt(list[1])
        console.log('NativeTest selfRenderAdCallback result ', id, result)
        SDKEvent.instance().emit(NativeName.selfRenderAdCallback, id, result);
    }

    static login(param: any) {
        NativeSystem.login(param)
    }

    static loginCallback(data: any) {
        NativeSystem.loginCallback(data)
    }

    static showUserAgreement(param: any) {
        NativeAgreement.showUserAgreement(param)
    }

    static userAgreementCallback(result: number) {
        NativeAgreement.userAgreementCallback(result)
    }

    static exitApplication(param:any) {
        NativeSystem.exitApp(param)
    }

    static exitMiniProgram(param:any){
        NativeSystem.exitApp(param)
    }

    static initAd(){
        NativeSystem.initAd()
    }
}
window['native'] = Native
