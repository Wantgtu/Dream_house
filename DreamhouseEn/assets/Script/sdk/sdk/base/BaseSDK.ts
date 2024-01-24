import BindFunction from "../tools/BindFunction";


export default class BaseSDK {
    protected sdk: any;
    constructor(sdk: any) {
        this.setSDK(sdk)
        this.funcHelper = new BindFunction()
    }
    protected funcHelper: BindFunction


    getFunc(func: Function) {
        return this.funcHelper.getFunc(func, this)
    }
    setSDK(sdk: any) {
        this.sdk = sdk;
        console.log(' BaseSDK sdk ====== ', this.sdk)
    }

    getSDK() {
        return this.sdk;
    }
}