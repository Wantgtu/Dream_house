import { DataCallback, ResultCallback, ResultState } from "../SDKConfig";
import BaseChannel from "./BaseChannel";

export default class BaseLogin {
    protected channel: BaseChannel;
    protected sdk: any
    constructor(channel: BaseChannel) {
        this.channel = channel;
        this.sdk = this.channel.getSDK()
    }


    checkSession(callback: ResultCallback) {
        this.sdk.checkSession({
            success(res: any) {
                console.log(`session未过期`);
                callback(ResultState.YES);
            },
            fail(res: any) {
                console.log(`session已过期，需要重新登录`);
                callback(ResultState.NO);
            }
        });
    }


    login(account: string, func: DataCallback) {
        let isForce: boolean = false;
        this.sdk.login({
            force: isForce,
            success(res: any) {
                console.log(`login调用成功${res.code} ${res.anonymousCode}`);
                func(ResultState.YES,res)
            },
            fail(res: any) {
                // console.log(`login调用失败`);
                if (isForce) {
                    func(ResultState.NO,res)
                } else {
                    func(ResultState.YES,res)
                }

            }
        });

    }

    getUserInfo(withCredentials: string, lang: string, func: DataCallback) {
        this.sdk.getUserInfo({
            withCredentials: withCredentials,
            lang: lang,
            success(res: any) {
                console.log(`getUserInfo调用成功${res.userInfo}`);
                func(ResultState.YES, res)
            },
            fail(res: any) {
                console.log(`getUserInfo调用失败`, res);
                func(ResultState.NO, null)
            }
        });
    }

    logout() {

    }

    showUserAgreement(func:ResultCallback){
        this.sdk.showUserAgreement({
            success() {
                func(ResultState.YES)
            },
            fail() {
                func(ResultState.NO)
            }
        })
    }
}