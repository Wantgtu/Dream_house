import SDKFileSystemManager from "../base/SDKFileSystemManager";
import { ResultCallback, ResultState, DataCallback, FileEncoding } from "../SDKConfig";
import BaseChannel from "../base/BaseChannel";

export default class CocosFileSystem extends SDKFileSystemManager {

    protected fs: any;
    protected sys_path: string = ''
    protected rt: any;
    init() {
        this.rt = window['loadRuntime']();
        this.fs = this.rt.getFileSystemManager();
        this.sys_path = this.rt.env.USER_DATA_PATH + '/'
        console.log(" sys_path ", this.sys_path)
    }



    writeFile(fileName: string, data: any, encoding: string, callback: ResultCallback) {
        let filePath = this.sys_path + fileName;
        console.log('CocosFileSystem writeFile  ', filePath)
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

    outlog(buffer: any) {
        for (const key in buffer) {
            if (buffer.hasOwnProperty(key)) {
                const element = buffer[key];
                console.log(' key222 ', key)
                console.log(' value 222', element)

            }
        }
    }

    readFile(fileName: string, encoding: String, callback: DataCallback) {
        let filePath = this.sys_path + fileName;
        console.log('CocosFileSystem readFile  ', filePath)
        let self = this;
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
        let filePath = this.sys_path + fileName;
        console.log('writeFileSync  filePath ', filePath, ' encoding ', encoding)
        let result = this.fs.writeFileSync(filePath, data, encoding);
        console.log(' result ', result)
        return result;
    }

    readFileSync(fileName: string, encoding: string) {
        let filePath = this.sys_path + fileName;
        console.log('readFileSync  filePath ', filePath)
        return this.fs.readFileSync(filePath, encoding)
    }
}