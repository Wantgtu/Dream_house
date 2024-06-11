/**
 * int	I
 * float	F
 * boolean	Z
 * String	Ljava/lang/String;
 */
export default class CocosJsNativeBridge {

    /**
     * 
     * @param className 
     * @param methodName 
     * @param parameters 
     * @param methodSignature 
     */
    static callStaticMethod(className, methodName, parameters, methodSignature = "(Ljava/lang/String;)V") {
        let cc: any = window['cc']
        let jsb: any = window['jsb']
        cc.log("NativeTest JsNativeBridge callStaticMethod ", cc.sys.isNative)
        if (!cc.sys.isNative) {
            return -1;
        }
        cc.log("NativeTest JsNativeBridge callStaticMethod ", methodName, parameters)
        if (cc.sys.os == cc.sys.OS_IOS) {
            let result = jsb.reflection.callStaticMethod(className, methodName, parameters);
            if (result) {
                cc.log("NativeTest callStaticMethod ios  ", result);
            }
        } else {
            cc.log("NativeTest JsNativeBridge callStaticMethod adroid ")
            let result = jsb.reflection.callStaticMethod(className, methodName, methodSignature, parameters)
            cc.log("NativeTest callStaticMethod result  ", result);
            if (result) {

                return result;
            }
        }
    }

}
