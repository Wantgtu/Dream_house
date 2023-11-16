import JsNativeBridge from "./JsNativeBridge";
let CLASS_NAME = 'sdk/bridge/SystemBridge'
export default class NativeAgreement{
    private static loginSuccess: Function = null;
    private static loginFail: Function = null;
    static showUserAgreement(param: any) {
        this.loginSuccess = param["success"];
        this.loginFail = param["fail"]
        JsNativeBridge.callStaticMethod(CLASS_NAME, "showAgreement", JSON.stringify(param))
    }

    static userAgreementCallback(result: any) {
        cc.log("NativeTest JsNativeBridge userAgreementCallback result ",result)
        // let list = param.split("$$");
        // let data = list[0]
        // let result = parseInt(list[1])
        if(result == 1){
            if(this.loginSuccess){
                this.loginSuccess()
            }
        }else{
            if(this.loginFail){
                this.loginFail()
            }
        }
    } 
}