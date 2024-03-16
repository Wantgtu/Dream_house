import BaseScrennshot from "../base/BaseScreenshot";

export default class OppoScreenshot extends BaseScrennshot {
    showImage(_tempFilePath: string) {
        this.channel.previewImage(_tempFilePath)
    }

    createImage(texture: any) {
        console.log(' createImage ')
        let canvas = this.getCanvas()
        let width = texture.width;
        let height = texture.height;
        let bytes = new Uint8Array(width * height * 4);
        texture.readPixels(bytes);
        let data = {
            data: bytes,
            width: canvas.width,
            height: canvas.height,
            fileType: 'png',
            reverse: true,
        }
        return data;
    }

    saveFile(data: any, show: boolean, callBack?: Function) {

        if (this.sdk.saveImageTempSync) {
            // https://cdofs.oppomobile.com/cdo-activity/static/201810/26/quickgame/documentation/media/image.html?h=saveImageToPhotosAlbum
            let _tempFilePath = this.sdk.saveImageTempSync(data)
            console.log('_tempFilePath ', _tempFilePath)
            this.sdk.saveImageToPhotosAlbum({
                filePath: _tempFilePath,
                success: () => {
                    console.log(`save success` + _tempFilePath)
                    if (show) {
                        this.showImage(_tempFilePath)
                    }
                },
                fail: function (data: any, code: any) {
                    console.log(`handling fail, code = ${code}`)
                }
            })
        }

    }
}