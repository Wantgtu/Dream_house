import BaseAd from "./BaseAd";

import BaseNativeAdItemModel from "./BaseNativeAdItemModel";
import { NativeAdCallback, SDKState, ADName } from "../SDKConfig";
import BaseChannel from "./BaseChannel";

//相当于ov专属父类
export default abstract class BaseNativeAd extends BaseAd {
    protected nativeAd: any;
    protected adItems: BaseNativeAdItemModel[] = []
    protected adList: string[] = []

    constructor(c: BaseChannel, list: string[]) {
        super(c, '')
        this.adList = list;
    }

    protected callbackList: NativeAdCallback[] = []
    protected loadCount: number = 0;
    open2(index: number, callback: NativeAdCallback) {
        console.log(" BaseNativeAd open index ", index, 'this.adItems.length', this.adItems.length, 'state', this.state, ' this.adList.length', this.adList.length, 'this.loadCount', this.loadCount)
        if (this.adList.length - 1 >= index) {
            this.adUnitID = this.adList[index]
            this.callbackList.push(callback)
            if (this.adItems.length > 0) {
                this.call();
            }
            else {
                if (this.state == SDKState.loading) {
                    this.loadCount++;
                    if (this.loadCount >= 3) {
                        this.loadCount = 0;
                    } else {
                        return;
                    }
                }
            }
            this.preload()
        } else {
            console.warn('index  out of range ', index)
        }


    }

    preload() {
        this.state = SDKState.loading;
        this.create();
        this.load()
    }


    private call() {
        if (this.callbackList.length > 0) {
            while (this.callbackList.length > 0) {
                let callback = this.callbackList.shift();
                callback(this.adItems)
            }
        }

    }


    onLoad(res: any) {
        console.log('onLoad ', res.adList)

        this.setState(SDKState.loadSucess)
        if (res && res.adList) {
            this.adItems.length = 0;
            for (let index = 0; index < res.adList.length; index++) {
                const element = res.adList[index];
                let adItem = this.getItemModel()
                adItem.init(element)
                this.reportAdShow(adItem.getID())
                this.adItems.push(adItem)
            }
        }
        console.log(' this.callbackList.length  ', this.callbackList.length, this.adItems.length)
        this.call()
        this.preload()
        // this.adItems.length = 0;

        // if (this.callback) {
        //     this.callback(this.adItems)

        //     this.callback = null;
        // }
    }

    abstract getItemModel(): BaseNativeAdItemModel;



    getAdItems() {
        return this.adItems;
    }


    close() {
        // this.adItems.length = 0;
    }


    onError(err: any) {
        this.setState(SDKState.loadFail)
        console.log(' BaseNativeAd onError err ', err)
        this.call()
    }




    load() {
        console.log(" BaseNativeAd load")
        // this.adItems.length = 0;
        this.nativeAd.load();

    }



    reportAdClick(adId: string) {
        if (!this.nativeAd) {
            return
        }
        console.log('reportAdClick ', adId)
        this.nativeAd.reportAdClick({
            adId: adId
        })
    }

    reportAdShow(adId: string) {
        if (!this.nativeAd) {
            return
        }
        console.log('reportAdShow ', adId)
        this.nativeAd.reportAdShow({
            adId: adId
        })
    }

    destroy() {
        if (this.nativeAd) {
            this.nativeAd.destroy();
            this.nativeAd = null;
        }
    }


}
