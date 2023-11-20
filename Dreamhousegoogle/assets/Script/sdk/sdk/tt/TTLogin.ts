import BaseLogin from "../base/BaseLogin";
import { ResultCallback, DataCallback, ResultState } from "../SDKConfig";

/**
 * https://microapp.bytedance.com/dev/cn/mini-game/develop/multi-server-support/using-restriction
 */
export default class TTLogin extends BaseLogin {




    login(account: string, func: DataCallback) {
        let isForce: boolean = false;
        let info = this.sdk.getSystemInfoSync();
        console.log(' login == info ', info)
        if (info.appName == 'Douyin') {
            isForce = true;
        }
        this.sdk.login({
            force: isForce,
            success(res: any) {
                console.log(`login调用成功${res.code} ${res.anonymousCode}`);
                func(ResultState.YES, res)
            },
            fail(res: any) {
                // console.log(`login调用失败`);
                if (isForce) {
                    func(ResultState.NO, null)
                } else {
                    func(ResultState.YES, null)
                }
            }
        });

    }




}
