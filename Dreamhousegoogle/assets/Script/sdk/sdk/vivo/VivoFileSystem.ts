import SDKFileSystemManager from "../base/SDKFileSystemManager";
import { ResultState, DataCallback, ResultCallback, FileEncoding } from "../SDKConfig";

/**
 * https://minigame.vivo.com.cn/documents/#/api/data/file
 */
// let folderName = 
export default class VivoFileSystem extends SDKFileSystemManager {


    init() {
        this.sysPath = 'internal://files/work/'
    }

    writeFile(fileName: string, data: any, encoding: string, callback: ResultCallback) {

        if (encoding == FileEncoding.BINARY) {
            let ua: DataView = data;
            data = ua.buffer;
        }
        let has = this.has(this.sysPath)
        console.log(`handling result： ${has}`)
        if (has) {
            let filePath = this.sysPath + fileName;
            console.log(' writeFile filePath ', filePath)
            this.sdk.writeFile({
                uri: filePath,  //写入的文件路径
                text: data,  //写入的文本
                encoding: encoding,  //字符编码格式
                success: function () { //成功回调
                    console.log(' writeFile ok')
                    callback(ResultState.YES)
                },
                fail: function (err: any) {  //失败回调
                    console.log(' writeFile fail', err)
                    callback(ResultState.NO)
                },
                complete: function () {  //完成回调
                    console.log(' writeFile complete')
                }
            })
        } else {
            this.mkdir(this.sysPath, (state: ResultState) => {
                if (state == ResultState.YES) {
                    let filePath = this.sysPath + fileName;
                    console.log(' writeFile filePath ', filePath)
                    this.sdk.writeFile({
                        uri: filePath,  //写入的文件路径
                        text: data,  //写入的文本
                        encoding: encoding,  //字符编码格式
                        success: function () { //成功回调
                            console.log(' writeFile ok')
                            callback(ResultState.YES)
                        },
                        fail: function (err: any) {  //失败回调
                            console.log(' writeFile fail', err)
                            callback(ResultState.NO)
                        },
                        complete: function () {  //完成回调
                            console.log(' writeFile complete')
                        }
                    })
                }

            })
        }

    }

    has(name: string) {
        var has = this.sdk.accessFile({
            uri: name
        })
        return has;
    }

    mkdir(name: string, callback: ResultCallback) {
        this.sdk.mkdir({
            uri: name,
            success: function (uri: any) {
                console.log(`handling success: ${uri}`)
                callback(ResultState.YES)
            },
            fail: function (data: any, code: any) {
                console.log(`handling fail, code = ${code}`)
                callback(ResultState.NO)
            }
        })
    }

    readFile(fileName: string, encoding: string, callback: DataCallback) {
        let filePath = this.sysPath + fileName;
        console.log(' readFile filePath ', filePath)
        // if (!this.has(folderName)) {

        //     callback(ResultState.NO, null)
        //     return;
        // }
        this.sdk.readFile({
            uri: filePath,  //写入的文件路径
            encoding: encoding,  //字符编码格式
            success: function (res: any) { //成功回调
                // console.log(' readFile ok',res)
                if (encoding == FileEncoding.BINARY) {
                    let bytes: Uint8Array = new Uint8Array(res.text)
                    callback(ResultState.YES, bytes)
                } else {
                    callback(ResultState.YES, res.text)
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
    writeFileSync(fileName: string, data: any, encoding: string, position?: any) {
        let filePath = this.sysPath + fileName;
        if (encoding == FileEncoding.BINARY) {
            let ua: DataView = data;
            data = ua.buffer;
        }
        const result = this.sdk.writeFileSync({
            uri: filePath,
            text: data,
            encoding: encoding,
            position: position
        })

        if (result === 'success') {
            return true;
        }
        else {
            console.log(`handling fail, result = ${result}`)
            return false;
        }
    }

    readFileSync(fileName: string, encoding: string) {
        let filePath = this.sysPath + fileName;
        const result = this.sdk.readFileSync({
            uri: filePath,
            encoding: encoding,
        })

        if (typeof result === 'string') {
            console.log(`handling fail, error message = ${result}`)
            return null;
        }
        else {
            console.log('handling success, text: ' + result.text)
            return result.text;
        }
    }
}
