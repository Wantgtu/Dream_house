import BaseNativeAdItemModel from "../base/BaseNativeAdItemModel";


export default class OppoNativeAdItemModel extends BaseNativeAdItemModel {



    getShowImageList() {
        return this.getImgList()
    }
    getID() {
        return this.data.adId
    }

    getTitle() {
        return this.data.title;
    }

    getDesc() {
        return this.data.desc;
    }

    getIconList() {
        return this.data.iconUrlList;
    }

    getImgList() {
        return this.data.imgUrlList
    }

    getButtonText() {
        return this.data.clickBtnTxt;
    }






}
