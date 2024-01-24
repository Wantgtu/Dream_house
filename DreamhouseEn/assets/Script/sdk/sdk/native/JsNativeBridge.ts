import CocosJsNativeBridge from "./CocosJsNativeBridge";
import LayaJsNativeBridge from "./LayaJsNativeBridge";

// Learn TypeScript:

export default class JsNativeBridge {


    /**
     * 如果使用laya引擎替换为LayaJsNativeBridge使用
     * @param className java 类名
     * @param methodName java 方法名
     * @param parameters json格式的参数
     * @param methodSignOrFunc 函数声明或者回调函数
     */
    static callStaticMethod(className: string, methodName: string, parameters: string, methodSignOrFunc?: any) {
        if (window['cc']) {
            console.log('NativeTest cocos creator ', parameters);
            CocosJsNativeBridge.callStaticMethod(className, methodName, parameters, methodSignOrFunc)
        } else if (window['laya']) {
            console.log(' laya ')
            LayaJsNativeBridge.callStaticMethod(className, methodName, parameters, methodSignOrFunc)
        }

    }


}
