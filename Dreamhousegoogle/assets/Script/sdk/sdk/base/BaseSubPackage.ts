import { ResultState, DataCallback } from "../SDKConfig";
import BaseChannel from "./BaseChannel";

export default class BaseSubPackage {

    protected subNames: string[];

    protected callback: DataCallback;

    protected channel: BaseChannel;
    protected sdk: any;
    constructor(channel: BaseChannel) {
        this.channel = channel;
        this.sdk = this.channel.getSDK();
    }

    /**
     * 加载单个分包
     * @param name 
     * @param callback 
     */
    loadSingle(name: string, callback: DataCallback) {
        this.loadSubpackage(name, callback)
    }

    loadSubpackage(subname: string, callback: DataCallback, onProgress?: (finished: number, total: number, item?: any) => void) {

        const loadTask = this.sdk.loadSubpackage({
            name: subname, // name 可以填 name 或者 root
            success: (res: any) => {
                // 分包加载成功后通过 success 回调
                callback(ResultState.YES, null)
            },
            fail: (res: any) => {
                // 分包加载失败通过 fail 回调
                // console.log(' loadSubpackage fail res ', res, ' subname ', subname)
                callback(ResultState.NO, null)
            },
        });
        if (loadTask) {
            loadTask.onProgressUpdate((res: { progress: number, }) => {
                callback(ResultState.PROGRESS, res.progress)
            })
        } else {

        }



    }
    /**
     * 根据给定的分包列表加载
     * @param subNames 
     * @param callback 
     */
    loadList(subNames: string[], callback: DataCallback) {
        this.loadSingle(subNames.shift(), (state: ResultState, progress) => {
            switch (state) {
                case ResultState.YES:
                    if (this.subNames.length > 0) {
                        this.loadList(subNames, callback)
                    } else {
                        callback(state, progress)
                    }
                    break;
                case ResultState.NO:
                    callback(state, progress)
                    break;
                case ResultState.PROGRESS:
                    callback(state, progress)
                    break;
            }

        })
    }
}
