import SDKHelper from "../SDKHelper";

export default class BaseNativeAdItemModel {

    protected data: any
    init(data: any) {
        this.data = data;
    }
    getID() {
        return this.data.adId
    }

    getTitle(): string {
        return ''
    }

    getIcon() {
        let list = this.getIconList();
        if (list && list.length > 0) {
            return list[0]
        }
        return null;
    }

    getRandomImage() {
        console.log(' this.imgUrlList.length ', this.data.imgUrlList.length)
        if (this.data.imgUrlList.length > 0) {
            return this.data.imgUrlList[SDKHelper.random(0, this.data.imgUrlList.length)]
        }
        return this.getIcon()
    }

    getRandomIcon() {
        console.log(' this.data.icon ', this.data.icon)
        if (this.data.icon) {
            return this.data.icon
        }
        return this.getRandomImage()
    }


    getDesc() {
        return this.data.desc;
    }

    getIconList(): string {
        return this.data.icon;
    }

    getImgList(): string[] {
        return this.data.imgUrlList;
    }

    getButtonText() {

    }

    getShowImageList(): string[] {
        return []
    }
}