import BaseLogin from "../base/BaseLogin";
import { DataCallback, ResultState } from "../SDKConfig";

export default class MiMoLogin extends BaseLogin {

    login(account: string, func: DataCallback) {
        this.sdk.login({
            account: account,
            success(res: any) {
                console.log(`login调用成功${res.code} ${res.anonymousCode}`);
                func(ResultState.YES, res)
            },
            fail(res: any) {
                // console.log(`login调用失败`);
                func(ResultState.NO, null)

            }
        });

    }
}