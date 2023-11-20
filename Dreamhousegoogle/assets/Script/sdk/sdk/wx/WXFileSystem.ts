import SDKFileSystemManager from "../base/SDKFileSystemManager";
import { ResultState, ResultCallback, DataCallback, FileEncoding } from "../SDKConfig";
export default class WXFileSystem extends SDKFileSystemManager {


    init() {

        this.fs = this.sdk.getFileSystemManager();
        this.sysPath = this.sdk['env'].USER_DATA_PATH
    }




    writeFile(fileName: string, data: any, encoding: string, callback: ResultCallback) {
        let filePath = this.sysPath + '/' + fileName;
        console.log('writeFile filePath ', filePath)
        this.fs.writeFile({
            filePath: filePath,  //写入的文件路径
            data: data,  //写入的文本
            encoding: encoding,  //字符编码格式
            success: function () { //成功回调
                console.log(' writeFile ok')
                callback(ResultState.YES)
            },
            fail: function (err: any) {  //失败回调
                console.log(' writeFile fail ', err)
                callback(ResultState.NO)
            },
            complete: function () {  //完成回调
                console.log(' writeFile complete')
            }
        })
    }

    readFile(fileName: string, encoding: string, callback: DataCallback) {
        let filePath = this.sysPath + '/' + fileName;
        console.log('readFile filePath ', filePath)
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
            fail: function (err: any) {  //失败回调
                console.log(' readFile fail', err)
                callback(ResultState.NO, null)
            },
            complete: function () {  //完成回调
                console.log(' writeFile complete')
            }
        })
    }
    writeFileSync(fileName: string, data: string | ArrayBuffer, encoding: string) {
        let filePath = this.sysPath + '/' + fileName;
        let result = this.fs.writeFileSync(filePath, data, encoding)
        return result
    }

    readFileSync(fileName: string, encoding: string) {
        let filePath = this.sysPath + '/' + fileName;
        return this.fs.readFileSync(filePath, encoding)
    }


}
