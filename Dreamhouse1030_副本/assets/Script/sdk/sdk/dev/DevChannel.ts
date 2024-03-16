import BaseChannel from "../base/BaseChannel";
import SDKHelper from "../SDKHelper";
import { ResultCallback, ResultState } from "../SDKConfig";

export default class DevChannel extends BaseChannel {


    // request(url: string, func: Function) {
    //     SDKHelper.addScript(url, 'lc_sdk', (err, data) => {
    //         console.log('config.sdk ', window['lc_sdk'])
    //         if (!err) {
    //             func(null, window['lc_sdk'].data)
    //         } else {
    //             func(' data is null ', null)
    //         }
    //     })
    // }
    request(url: string, func: Function) {
        SDKHelper.sendHttpRequest(url, '', (msg: string, data) => {
            func(msg, data)
        })
    }

    canInstallShortcut(callback: ResultCallback) {
        callback(ResultState.YES)
    }

    installShortcut(result: ResultCallback) {
        result(ResultState.YES)
    }
}
