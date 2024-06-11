import SDKFileSystemManager from "../base/SDKFileSystemManager";
import { ResultCallback, DataCallback, ResultState, FileEncoding } from "../SDKConfig";
import SDKHelper from "../SDKHelper";

export default class NativeFileSystem extends SDKFileSystemManager {


    init() {
        this.fs = this.sdk.getFileSystemManager();
        this.sysPath = this.sdk['env'].USER_DATA_PATH
    }

    writeFileSync(fileName: string, data: any, encoding: string, param?: any): boolean {
        let filePath = this.sysPath + fileName;
        if (encoding == FileEncoding.BINARY) {
            data = SDKHelper.uint8ArrayToString(data)
        }
        this.sdk.writeFileSync(data, filePath);
        return true;
    }

    readFileSync(fileName: string, encoding: string): any {
        let filePath = this.sysPath + fileName;

        let data = this.sdk.readFileSync(filePath, encoding)
        if (encoding == FileEncoding.BINARY) {
            data = SDKHelper.stringToUint8Array(data)
        }
        return data;
    }

    writeFile(fileName: string, data: any, encoding: string, callback: ResultCallback) {
        this.writeFileSync(fileName, data, encoding)
        callback(ResultState.YES)
    }

    readFile(fileName: string, encoding: string, callback: DataCallback) {
        let data = this.readFileSync(fileName, encoding)
        if (data) {

            callback(ResultState.YES, data)

        } else {
            callback(ResultState.NO, null)
        }


    }





}
