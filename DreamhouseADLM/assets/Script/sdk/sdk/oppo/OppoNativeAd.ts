

import OppoNativeAdItemModel from './OppoNativeAdItemModel';
import { SDKState, FunctionType } from '../SDKConfig';
import BaseNativeAd from '../base/BaseNativeAd';
/**
 * https://open.oppomobile.com/wiki/doc#id=10539
 * 原生广告是 cp 通过封装好的接口获取广告数据，根据实际场景自由选择绘制和展示方式的广告，更加灵活。 
 * 需要注意的是，每个原生广告组件对象只有一次有效曝光，一次有效点击。 
 * 同一个 adUnitId，如果已经创建，并且未 destroy，会复用之前的对象。
 */
export default class OppoNativeAd extends BaseNativeAd {
    // protected loadFunc: Function;

    // protected errorFunc: Function;
    protected instances: { [key: string]: any } = []
    getItemModel() {
        return new OppoNativeAdItemModel()
    }

    create() {
        console.log(" OppoNativeAd create", this.adUnitID)
        this.nativeAd = this.instances[this.adUnitID]
        if (!this.nativeAd) {
            this.nativeAd = this.sdk.createNativeAd({
                adUnitId: this.adUnitID,
            });
            this.nativeAd.onLoad(this.getFunc(FunctionType.onLoad))
            this.nativeAd.onError(this.getFunc(FunctionType.onError))
            this.instances[this.adUnitID] = this.nativeAd
        }
    }
}