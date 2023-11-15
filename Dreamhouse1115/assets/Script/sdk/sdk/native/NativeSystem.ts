import JsNativeBridge from "./JsNativeBridge";
import NativeName from "./NativeName";

let CLASS_NAME = 'sdk/bridge/SystemBridge'
export default class NativeSystem {

    private static loginSuccess: Function = null;
    private static loginFail: Function = null;
    static login(param: any) {
        this.loginSuccess = param["success"];
        this.loginFail = param["fail"]
        JsNativeBridge.callStaticMethod(CLASS_NAME, NativeName.login, JSON.stringify(param))
    }

    static loginCallback(param: any) {
        let list = param.split("$$");
        let data = list[0]
        let result = parseInt(list[1])
        if (result == 1) {
            if (this.loginSuccess) {
                this.loginSuccess(data)
            }
        } else {
            if (this.loginFail) {
                this.loginFail(data)
            }
        }
    }

    static exitApp(param: any) {
        JsNativeBridge.callStaticMethod(CLASS_NAME, "exitApp", "")
    }

    static initAd() {
        JsNativeBridge.callStaticMethod(CLASS_NAME, "initAd", "")
    }
}