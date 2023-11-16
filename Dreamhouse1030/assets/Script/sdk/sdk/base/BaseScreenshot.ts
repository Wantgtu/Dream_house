
import BaseChannel from "./BaseChannel";

export default class BaseScrennshot {
    protected channel: BaseChannel;
    protected sdk: any
    constructor(channel: BaseChannel) {
        this.channel = channel;
        this.sdk = this.channel.getSDK()
    }

    capture(texture: any, show: boolean = true) {
        // create the capture
        // setTimeout(() => {
        // console.log(' CaptureOppo capture ')

        // console.log(' CaptureOppo createCanvas ', canvas)
        // let img = this.createImg();
        // console.log(' CaptureOppo capture img ',img)
        this.saveFile(this.createImage(texture), show);
        // }, 1000);
    }


    getCanvas(): any {
        return null;
    }

    showImage(img: any) {

    }

    createImage(texture: any) {

    }

    saveFile(data: any, show: boolean, callBack?: Function) {

    }

}
