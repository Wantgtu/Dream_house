import { BaseModel } from "../../cfw/model";
import { LocalValue } from "../../cfw/local";
import { TimeHelper } from "../../cfw/time";


export default class User extends BaseModel {

    protected loginCount: LocalValue;//登录次数

    protected loginTime: LocalValue;
    protected loginDayNum: number;
    // protected preLoginDayNum: number = 0;
    protected time: number = 0;
    constructor() {
        super();
        this.loginCount = new LocalValue('loginCount', 0)
        this.loginTime = new LocalValue('loginTime', 0)
        if (this.loginTime.getInt() == 0) {
            this.loginTime.setValue(Date.now())
        }
        // console.log(' this.loginTime.getInt() ', this.loginTime.getInt())
        let newNum = TimeHelper.getLoginDayNum(this.loginTime.getInt(), 5)
        // console.log(' newNum ', newNum)
        // let oldNum = this.loginDayNum.getInt()
        // console.log(' oldNum ',oldNum)
        // this.preLoginDayNum = oldNum;
        // if (oldNum != newNum) {
        this.loginDayNum = newNum;
        this.time = Date.now();
        // }

    }


    getLeftTime() {
        let t = Date.now()
        let dis = t - this.time;
        return Math.floor(dis / 1000)
    }

    // isNewDay() {
    //     return this.preLoginDayNum != this.getLoginDayNum();
    // }

    // reset() {
    //     this.preLoginDayNum = this.getLoginDayNum()
    // }

    getLoginDayNum() {
        return this.loginDayNum
    }

    login() {
        this.loginCount.updateValue(1)
    }

    getLoginCount() {
        return this.loginCount.getInt();
    }

    getLoginTime() {
        return this.loginTime.getInt();
    }

    isFirstLogin() {
        return this.loginCount.getInt() == 1;
    }
}