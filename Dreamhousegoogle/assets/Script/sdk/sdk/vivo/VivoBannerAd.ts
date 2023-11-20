
import BaseBannerAd from "../base/BaseBannerAd";


/**
 * https://minigame.vivo.com.cn/documents/#/api/da/banner-da
 * banner广告实例不能复用，每次需要重新加载时要重新create
1、如果先调用createBannerAd()后 不能立马调用hide()方法，要等Ad创建成功后，在某个需要的场景下调hide()

2、如果有场景需要再次展示广告，如果广告被关闭了或者调了close()，必须重新创建才能展示出来，此时show()无效

3、广告调试时，会有可能因为填充率不足而展示不出来，具体请查看教程中的错误码信息

4、Banner广告创建间隔不得少于10s

banner广告实例不能复用，每次需要重新加载时要重新create

广告对象长时间不用会被回收，需要重新创建
 */
export default class VivoBannerAd extends BaseBannerAd {


    getStyle() {
        return {
        }
    }


    load(): void {
        //vivo的banner，没有load方法。
    }

    updateSize(){
        
    }

    create() {

        if (!this.bannerAd) {
            this.bannerAd = this.sdk.createBannerAd({
                posId: this.adUnitID,
                style: this.getStyle(),
                adIntervals:30
            })
            this.bannerAd.onLoad(this.onLoad.bind(this))
            this.bannerAd.onError(this.onError.bind(this))
            this.bannerAd.onSize(this.onResize.bind(this))
        }


    }
}