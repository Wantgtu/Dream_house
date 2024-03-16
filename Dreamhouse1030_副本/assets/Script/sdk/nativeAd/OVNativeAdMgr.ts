import { BaseModel } from "../../cfw/model";
import { LocalValue } from "../../cfw/local";
import { TimeHelper } from "../../cfw/time";


let GAME_NAME = 'KittyTown'
export default class OVNativeAdMgr extends BaseModel {
    protected loginNum: LocalValue;

    protected loginTime: LocalValue;
    protected closeNativeAdCount: LocalValue;
    protected isSameDay: boolean = false;
    constructor() {
        super();
        this.loginNum = new LocalValue(GAME_NAME + 'loginNum', 0)
        this.loginTime = new LocalValue(GAME_NAME + "loginTime", 0)
        this.closeNativeAdCount = new LocalValue(GAME_NAME + 'closeNativeAdCount', 0)
        if (this.loginTime.getValue() == 0) {
            this.loginTime.setValue(TimeHelper.now())
        }
        let day = TimeHelper.getLoginDayNum(this.loginTime.getValue(), 5)
        if (day != this.loginNum.getValue()) {
            this.loginNum.setValue(day)
            this.closeNativeAdCount.setValue(0)
            this.isSameDay = false
        } else {
            this.isSameDay = true;
        }
    }
    updateCloseAdCount(num: number) {
        this.closeNativeAdCount.updateValue(num)
    }

    getCloseAdCount() {
        return this.closeNativeAdCount.getValue()
    }
    setLoginNum(num: number) {
        return this.loginNum.setValue(num)
    }

    getLoginNum() {
        return this.loginNum.getValue();
    }

    checkLoginNum() {
        return !this.isSameDay
    }

}