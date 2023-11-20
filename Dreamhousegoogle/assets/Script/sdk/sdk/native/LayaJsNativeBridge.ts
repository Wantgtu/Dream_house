

/**
 * int	I
 * float	F
 * boolean	Z
 * String	Ljava/lang/String;
 */
export default class LayaJsNativeBridge {

    /**
     * 
     * @param className 
     * @param methodName 
     * @param parameters 
     * @param callback 
     */

    static callStaticMethod(className: string, methodName: string, parameters: any, callback?: Function) {
        var os: any = window['conchConfig'].getOS();
        var bridge: any;
        let PlatformClass: any = window['PlatformClass']
        if (os == "Conch-ios") {
            bridge = PlatformClass.createClass(className);//创建脚步代理
            if (!bridge) {
                console.log(' callStatic Method class name ', className, methodName, parameters)
                return;
            }
            if (callback) {
                bridge.callWithBack(function (value) {
                    var obj = JSON.parse(value)
                    console.log(obj);
                    callback(obj)
                }, methodName + ":", JSON.stringify(parameters));

            } else {
                bridge.call(methodName, parameters)

            }

        }
        else if (os == "Conch-android") {
            //需要完整的类路径，注意与iOS的不同
            bridge = PlatformClass.createClass(className);//创建脚步代理
            if (!bridge) {
                console.log(' callStatic Method class name ', className, methodName, parameters)
                return;
            }
            if (callback) {
                bridge.callWithBack(function (value) {
                    var obj = JSON.parse(value)
                    console.log(obj);
                    callback(obj)
                }, methodName, JSON.stringify(parameters));
            } else {
                bridge.call(methodName, parameters)
            }

        }



    }


}

