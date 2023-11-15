import SDKFileSystemManager from "../base/SDKFileSystemManager";
import { ResultCallback, ResultState, DataCallback, FileEncoding } from "../SDKConfig";

export default class OppoFileSystem extends SDKFileSystemManager {

    init() {
        this.fs = this.sdk.getFileSystemManager();
        this.sysPath = this.sdk['env'].USER_DATA_PATH
    }

    writeFile(fileName: string, data: any, encoding: string, callback: ResultCallback) {
        let filePath = this.sysPath + fileName;
        if (encoding == FileEncoding.BINARY) {
            let ua: DataView = data;
            data = ua.buffer;
        }
        this.fs.writeFile({
            filePath: filePath,  //写入的文件路径
            data: data,  //写入的文本
            encoding: encoding,  //字符编码格式
            success: function () { //成功回调
                console.log(' writeFile ok')
                callback(ResultState.YES)
            },
            fail: function () {  //失败回调
                console.log(' writeFile fail')
                callback(ResultState.NO)
            },
            complete: function () {  //完成回调
                console.log(' writeFile complete')
            }
        })
    }

    readFile(fileName: string, encoding: string, callback: DataCallback) {
        let filePath = this.sysPath + fileName;
        this.fs.readFile({
            filePath: filePath,  //写入的文件路径
            encoding: encoding,  //字符编码格式
            success: function (res: any) { //成功回调
                console.log(' readFile ok')
                if (encoding == FileEncoding.BINARY) {
                    let ints: Uint8Array = new Uint8Array(res.data)
                    callback(ResultState.YES, ints)
                } else {
                    callback(ResultState.YES, res.data)
                }
            },
            fail: function () {  //失败回调
                console.log(' readFile fail')
                callback(ResultState.NO, null)
            },
            complete: function () {  //完成回调
                console.log(' writeFile complete')
            }
        })
    }

    writeFileSync(fileName: string, data: any, encoding: string, append?: any) {
        let filePath = this.sysPath + fileName;
        console.log('writeFileSync  filePath ', filePath, ' encoding ', encoding)
        if (encoding == FileEncoding.BINARY) {
            let ua: DataView = data;
            data = ua.buffer;
        }
        let result = this.fs.writeFileSync(filePath, data, encoding);
        console.log(' result ', result)
        return result;
    }

    readFileSync(fileName: string, encoding: string) {
        let filePath = this.sysPath + fileName;
        console.log('readFileSync  filePath ', filePath)
        return this.fs.readFileSync(filePath, encoding)
    }
}
