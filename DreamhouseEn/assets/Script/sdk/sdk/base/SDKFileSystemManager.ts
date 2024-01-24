import { ResultCallback, DataCallback } from "../SDKConfig";
import BaseChannel from "./BaseChannel";

export default abstract class SDKFileSystemManager {

    protected fs: any;
    protected sysPath: string = ''
    protected sdk: any
    protected channel: BaseChannel;
    constructor(channel: BaseChannel) {
        this.channel = channel;
        this.sdk = this.channel.getSDK()
        console.log(this.sdk);
        //this.init()
    }

    init() {

    }
    writeFile(fileName: string, data: any, encoding: string, callback: ResultCallback) {

    }

    readFile(filePath: string, encoding: string, callback: DataCallback) {

    }
    abstract writeFileSync(filePath: string, data: any, encoding: string, param?: any): boolean;
    abstract readFileSync(filePath: string, encoding: string): any;
}
