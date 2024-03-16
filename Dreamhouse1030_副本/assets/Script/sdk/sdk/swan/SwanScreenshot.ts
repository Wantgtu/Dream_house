import BaseScrennshot from "../base/BaseScreenshot";


export default class SwanScreenshot extends BaseScrennshot {


    showImage(_tempFilePath: string) {
        this.channel.previewImage(_tempFilePath)
    }

    createImage() {
        console.log(' createImage ')
        let canvas = this.getCanvas()
        let data = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            // destination file sizes
            destWidth: canvas.width,
            destHeight: canvas.height,
            fileType: 'png',
            quality: 1
        }
        return data;
    }

    saveFile(data: any, show: boolean, callBack?: Function) {
        console.log(' saveFile data ', data, show)
        let canvas = this.getCanvas()
        if (canvas.toTempFilePathSync) {

            let _tempFilePath = canvas.toTempFilePathSync(data);
            console.log(' _tempFilePath ', _tempFilePath)
            this.sdk.saveImageToPhotosAlbum({
                filePath: _tempFilePath,
                success: (res: any) => {
                    console.log(`Capture file success!${_tempFilePath}`, res);
                    // self.label = '图片加载完成，等待本地预览';

                    if (show) {
                        this.showImage(_tempFilePath)
                    }
                },
            })


        }


    }

}
