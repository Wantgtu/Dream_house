
/**
 * 时间的显示样式
 * 0 xx时xx分xx秒   1 xx:xx:xx: 
 */
enum TimeDisplayType {
    FONT,
    POINT,
}
/**
 * 时间的更新方式
 * 0 递减 
 * 1 递增 
 */
// export enum TimeUpdateType {
//     SUB,//倒计时
//     ADD,//距离活动时间
//     UPDATE,//定时触发
//     FRAME//每帧直接调用
// }

export class TimeDisplay {


    static getFontString(t: number) {
        t = Math.floor(t)
        return this.getTimeString(t, TimeDisplayType.FONT)
    }

    static getPointString(t: number) {
        t = Math.floor(t)
        return this.getTimeString(t, TimeDisplayType.POINT)
    }

    /**
     * 
     * @param t 时间 秒
     * @param type 时间的显示类型 0 xx时xx分xx秒   1 xx:xx:xx: 
     */
    private static getTimeString(t: number, type: TimeDisplayType = TimeDisplayType.FONT): string {
        if (!t || t === 0) {
            return "00:00:00";
        }
        let time = t;
        // cc.log(" time ",this.time);
        let display: string = "";

        let s = time % 60;

        let m = Math.floor(time / 60 % 60);

        let h = Math.floor(time / 3600 % 24);

        let d = Math.floor(time / 3600 / 24);
        let ss: string = "" + s;
        if (s < 10) {
            ss = "0" + ss;
        }
        let mm = "" + m;
        if (m < 10) {
            mm = "0" + mm;
        }
        let hh = "" + h;
        if (h < 10) {
            hh = "0" + hh;
        }
        let dName = "d"
        let hName = "h"
        let mName = 'm'
        let sName = 's'

        if (d > 0) {
            display = d + dName + hh + hName + mm + mName;
        } else {
            if (type == TimeDisplayType.FONT) {
                if (h != 0) {
                    display = hh + hName + mm + mName + ss + sName;
                } else if (m != 0) {
                    display = mm + mName + ss + sName;
                } else {
                    display = ss + sName;
                }
            } else {
                if (h != 0) {
                    display = hh + ":" + mm + ":" + ss;
                } else if (m != 0) {
                    display = mm + ":" + ss;
                } else {
                    display = ss;
                }
            }


        }
        return display;
    }
}
/**
 * Time接收的时间戳都是以毫秒为单位的，服务器传过来的是秒，注意转化。
 */
export class TimeHelper {
    static s_DeltaTime: number = 0;// 本地时间戳与服务器时间戳的差值。
    static s_CurTimeZone: number = 0;    //本地时区 UTC+? 相对UTC时间多出的时区数
    static s_ServerTimeZone = 8;    //服务器时区 UTC+8 相对UTC时间多出的时区数

    /**
     * serverTime必须精确到毫秒
     * @param serverTime 登录服务器的时间戳 毫秒
     * @param zoneOffset 服务器的时区 秒
     */
    static sync(serverTime: number, zoneOffset?: number) {
        this.s_DeltaTime = serverTime - this.localNow();
        if (zoneOffset) {
            this.s_ServerTimeZone = zoneOffset / 3600;
        }

        this.s_CurTimeZone = 0 - new Date().getTimezoneOffset() / 60;
        // cc.log(" this.s_DeltaTime  ",this.s_DeltaTime," s_ServerTimeZone ",this.s_ServerTimeZone," s_CurTimeZone ",this.s_CurTimeZone," zoneOffset ",zoneOffset);
    }

    //返回服务器时间(精确到毫秒的时间戳)
    static now() {
        return this.localNow() + this.s_DeltaTime;
    }

    //根据结束时间获得剩余时间
    /**
     * 当返回负数时表明过期了多久
     * @param endTime 毫秒
     */
    static leftTime(endTime: number) {
        if (endTime == 0) {
            return 0;
        }
        let dis = endTime - this.now();
        return dis;
    }

    static startTime(startTime: number) {
        return this.now() - startTime;
    }


    //返回本地时间(精确到毫秒的时间戳)
    static localNow() {
        let now = Date.now();
        // cc.log(" now =================================== "+now);
        return now;
    }

    //是否同一天
    static isSameDay(timestamp: number, now?: number) {
        let d: Date = this.timestamp2DateObj(timestamp);
        let d2: Date;
        if (!now) {
            now = Date.now();
        }
        d2 = this.timestamp2DateObj(now);

        return d.getDate() == d2.getDate() //d.getFullYear() == d2.getFullYear() && d.getMonth() == d2.getMonth() && 
    }

    static getPastTimestamp(timestamp: number) {
        let dis = this.now() - timestamp;
        return dis;
    }
    /**
     * 根据天数获得时间戳
     * @param n 天数
     */
    static getTime(n: number) {
        return n * 24 * 60 * 60 * 1000
    }
    /**
     * 获取过去了多少天
     * @param timestamp 登录时的时间
     */
    static getPastDayNum(timestamp: number) {
        let now = this.now();
        let past = now - timestamp;
        return Math.floor(past / 1000 / 3600 / 24);
    }

    /**
     * 根据时间戳 推算 当前给定时间的时间戳。
     * @param timestamp  毫秒
     * @param hour 
     * @param munite 
     * @param second 
     */
    static getDayTime(timestamp: number, hour: number, munite: number = 0, second: number = 0) {
        let cDate = new Date(timestamp);
        let date2 = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate(), hour, munite, second);
        return date2.getTime();
    }

    /**
 * 获取过去了多少分钟
 * @param timestamp 登录时的时间
 */
    static getPastMinutesNum(timestamp: number) {
        return Math.floor(this.getPastSecondNum(timestamp) / 60);
    }

    static getPastSecondNum(timestamp: number) {
        let now = this.now();
        let past = now - timestamp;
        return Math.floor(past / 1000);
    }


    /**
     * 获得当地的时间
     * @param timestamp 服务器传递的时间戳 毫秒
     */
    static getLocalDateByTime(timestamp: number): Date {
        let d = this.Timestamp2Date(timestamp, this.s_ServerTimeZone, this.s_CurTimeZone);
        return d;
    }


    /**
     * 
     * @param date 
     */
    static getDateString(date: Date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate()
        // cc.log(" date ",date.toLocaleString());
        // cc.log(" date ",date.toLocaleDateString());
        // cc.log(" date ",date.toLocaleTimeString());
        return year + "/" + month + "/" + day;
    }


    /**
     * 
     * @param str "2018-12-5 06:00"
     */
    static getLocalDateByString(str: string) {

        let d = this.timestamp2DateObj(str);
        return this.Timestamp2Date(d.getTime(), this.s_ServerTimeZone, this.s_CurTimeZone);
    }

    /**
     * 
     * @param num 
     */
    static timestamp2DateObj(num: string | number): Date {
        let date: Date = new Date(num)
        return date;
    }

    /**
     * 返回以timestamp计算的, 所在目标时区的Date对象
     * 默认destTimeZone为本地时区
     * 注意参数 timestamp 需要必须精确到 毫秒！
     * 如果timestamp 是服务器的时间戳，curTimeZzone 应该是服务器的时区。
     * @param timestamp curTimeZzone 的时间戳 
     * @param curTimeZzone 当前的时区
     * @param destTimeZone 目标时区
     */
    static Timestamp2Date(timestamp: number, curTimeZzone: number, destTimeZone: number) {
        if (!destTimeZone) {
            destTimeZone = curTimeZzone;
        }
        //当前时区比目标时区多出的时区数
        let deltaTimeZone = curTimeZzone - destTimeZone;
        let deltaTime = deltaTimeZone * 3600000;
        let adjustedNow = timestamp - deltaTime;

        return new Date(adjustedNow);
    }


    //返回以Now()为时间戳计算的, 所在目标时区的Date对象
    static NowDate(destTimeZone: number) {
        return this.Timestamp2Date(this.now(), this.s_CurTimeZone, destTimeZone);
    }

    /**
     * 判断是否可以刷新。
     * @param sTime 上次刷新时间 毫秒 
     * @param time 给定刷新时间  
     */
    static lessThenTime(sTime: number, hour: number, minute: number = 0, second: number = 0) {
        if (sTime == 0) {
            return true;
        }
        let sDate = new Date(sTime);
        // console.log(sDate.toLocaleString());
        let cDate = new Date(this.now());
        // cc.log(" cDate.getFullYear()",cDate.getFullYear(),cDate.getDate());
        // console.log(cDate.toLocaleString());
        let fiveDate = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate(), hour, minute, second);
        // console.log(fiveDate.toLocaleDateString());
        // console.log(fiveDate.toLocaleString());
        // console.log(fiveDate.getTime());
        return sDate.getTime() < fiveDate.getTime();
    }

    static moreThenTime(sTime: number, hour: number, minute: number = 0, second: number = 0) {
        if (sTime == 0) {
            return true;
        }
        let sDate = new Date(sTime);
        // console.log(sDate.toLocaleString());
        let cDate = new Date(this.now());
        // cc.log(" cDate.getFullYear()",cDate.getFullYear(),cDate.getDate());
        // console.log(cDate.toLocaleString());
        let temp = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate(), hour, minute, second);
        // console.log(temp.toLocaleString());
        return sDate.getTime() > temp.getTime();
    }

    static isBetween(sTime: number, hour1: number, hour2: number) {
        if (sTime == 0) {
            return false;
        }
        // console.log(' isBetween start ')
        let sDate = new Date(sTime);
        // console.log(sDate.toLocaleString());
        let cDate = new Date(this.now());
        // cc.log(" cDate.getFullYear()",cDate.getFullYear(),cDate.getDate());
        // console.log(cDate.toLocaleString());
        let data1 = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate(), hour1, 0, 0);
        // console.log(data1.toLocaleString());
        let data2 = new Date(cDate.getFullYear(), cDate.getMonth(), cDate.getDate(), hour2, 0, 0);
        // console.log(data2.toLocaleString());
        // console.log(' isBetween end ')
        return sDate.getTime() <= data2.getTime() && sDate.getTime() >= data1.getTime();
    }








    /**
     * 获取登陆天数
     * @param regTime  登陆时间
     * @param refreshTime 刷新时间
     */
    static getLoginDayNum(regTime: number, refreshTime: number) {


        let t0 = this.getDayTime(regTime, refreshTime);
        console.log(' to ', t0)

        let t = this.getDayTime(this.now(), refreshTime);
        console.log(' t ', t)
        return Math.ceil((t - t0 + 1) / 86400000);
    }


    //-------------------------------

    // static test(){
    //     let d = new Date();

    //     let od = this.Timestamp2Date(d.getTime(),this.s_CurTimeZone, 9);

    //     cc.log(" time 1 ",od.toLocaleDateString());
    //     cc.log(" time 2 ",od.toLocaleString());
    //     cc.log(" time 3 ",od.toLocaleTimeString());

    // var d=new Date(); //创建一个Date对象
    // var localTime = d.getTime();
    // var localOffset=d.getTimezoneOffset()*60000; //获得当地时间偏移的毫秒数
    // var utc = localTime + localOffset; //utc即GMT时间

    // cc.log(" localTime ",localTime," localOffset ",localOffset," utc ",utc," d.getTimezoneOffset() ",d.getTimezoneOffset());

    // var offset =10; //以夏威夷时间为例，东10区

    // var hawaii = utc + (3600000*offset); 
    // cc.log(" hawaii ",hawaii);
    // var nd = new Date(hawaii); 
    // cc.log("Hawaii time is " , nd.toLocaleString());        
    // }



    // //时间戳换算为总毫秒数
    // static TotalMillisecond() {
    //     return this.now();
    // }

    // //时间戳换算为总秒数
    // static TotalSeconds() {
    //     return Math.floor(this.now() / 1000);
    // }

    // //时间戳换算为总分钟数
    // static TotalMinutes() {
    //     return Math.floor(this.now() / (1000 * 60));
    // }

    // //时间戳换算为总小时数
    // static TotalHours() {
    //     return Math.floor(this.now() / (1000 * 60 * 60));
    // }

    // //时间戳换算为总天数
    // static TotalDays() {
    //     return Math.floor(this.now() / (1000 * 60 * 60 * 24));
    // }

    // //时间戳换算为总月数, TODO, 要怎么算？
    // static TotalMonths() {
    //     cc.error("暂未实现");
    // }    


}
export abstract class TimeObserver {

    // 倒计时时间 单位秒  由于服务器返回的是秒，而时间管理器需要毫秒 所以注意时间转换。
    protected time: number = 0;

    //回调函数
    protected func: (time: number) => void;

    //time为0时 是否从时间管理器中移除。
    protected autoDelete: boolean = false;

    //间隔时间
    protected duration: number = 1;

    protected isPause: boolean = false;

    constructor(func: (time: number) => void, duration: number = 1) {
        this.func = func;
        this.time = 0;
        this.duration = duration;
    }

    setTime(t: number, param?: any) {
        this.time = t;
    }

    setDuration(d: number) {
        this.duration = d;
    }

    getDuration() {
        return this.duration;
    }

    setAutoDelete(flag: boolean) {
        this.autoDelete = flag;
    }

    isAutoDelete() {
        return this.autoDelete;
    }

    getTime() {
        return this.time;
    }

    abstract check(dt: number): boolean;

    update(dt: number): boolean {
        if (this.isPause) {
            return false;
        }
        return this.check(dt)
    }

    pause() {
        this.isPause = true;
    }

    resume() {
        this.isPause = false;
    }

    start() {
        TimeManager.instance().add(this)
    }

    stop() {
        TimeManager.instance().remove(this)
    }

    clear() {

    }

}

/**
 * 时间递减
 */
export class CountDownTimer extends TimeObserver {
    protected temp: number = 0;
    protected totalTime: number = 0;
    /**
    * 
    * @param endTime 结束时间
    * @param isTimeStamp 结束时间是否是时间戳
    */
    setTime(endTime: number, isTimeStamp: boolean = true) {
        if (isTimeStamp) {
            this.time = Math.floor(TimeHelper.leftTime(endTime) / 1000);
        } else {
            this.time = endTime
        }
        this.totalTime = this.time;
        if (this.time < 0) {
            this.time = 0;
        }
    }

    getPercent() {
        if (this.totalTime == 0) {
            return 0;
        }
        return (this.totalTime - this.time) / this.totalTime
    }

    check(dt: number) {
        if (this.time > 0) {
            this.temp += dt;
            if (this.temp >= this.duration) {
                this.temp -= this.duration
                this.time -= this.duration
                if (this.time < 0) {
                    this.time = 0;
                }
                if (this.func) {
                    this.func(this.time);
                }
            }
            return false
        } else {
            return true;
        }
    }
}

/**
 * 时间递增
 */
export class IncrementalTimer extends TimeObserver {
    protected temp: number = 0;
    /**
     * 一定要小于当前时间才有意义。
     * @param startTime 经过的时间
     */
    setTime(startTime: number) {
        this.time = Math.floor(TimeHelper.startTime(startTime) / 1000);
    }

    check(dt: number) {
        this.temp += dt;
        if (this.temp >= this.duration) {
            this.temp -= this.duration
            this.time += this.duration
            if (this.func) {
                this.func(this.time);
            }
        }
        return false
    }
}

export class SheduleTimer extends TimeObserver {
    protected temp: number = 0;
    check(dt: number) {
        this.temp += dt;
        if (this.temp >= this.duration) {
            this.temp -= this.duration
            if (this.func) {
                this.func(this.duration);
            }
            return true
        }
        return false;
    }
}

/**
 * 帧计时器
 */
export class FrameTimer extends TimeObserver {

    check(dt: number) {
        this.func(dt);
        return false;
    }
}

export class SplitFrameLoader extends TimeObserver {
    protected index: number = 0
    protected temp: number = 0;
    //每次加载个数
    protected count: number = 0
    constructor(func: (time: number) => void, d: number, c: number = 1) {
        super(func, d)
        this.count = c;
    }
    clear() {
        this.index = 0;
        this.temp = 0;
    }
    check(dt: number) {
        this.temp += dt;
        if (this.temp >= this.duration) {
            this.temp -= this.duration
            if (this.func) {
                for (let index = 0; index < this.count; index++) {
                    this.func(this.index++);
                }
            }
        }
        return false;
    }
}

export class TimeManager {

    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }
    //时间计数
    private totalTime: number = 0;

    private observerList: Array<TimeObserver> = [];

    protected removes: TimeObserver[] = []


    protected running: boolean = true;

    pause() {
        this.running = false;
    }

    resume() {
        this.running = true;
    }

    reset() {
        this.totalTime = 0;
    }


    add(observer: TimeObserver) {
        let index = this.has(observer)
        if (index >= 0) {
            return;
        }
        this.observerList.push(observer);
    }

    has(observer: TimeObserver) {
        let index = this.observerList.indexOf(observer)
        return index

    }

    remove(observer: TimeObserver) {
        let index = this.has(observer)
        if (index >= 0) {
            this.observerList.splice(index, 1);
        }

    }

    getTotalTime() {
        return this.totalTime;
    }

    update(dt: number) {
        if (!this.running) {
            return;
        }
        this.totalTime += dt
        for (let index = 0; index < this.observerList.length; index++) {
            const element: TimeObserver = this.observerList[index];
            if (element.update(dt)) {
                if (element.isAutoDelete()) {
                    this.removes.push(element)
                }
            }
        }
        while (this.removes.length > 0) {
            this.remove(this.removes.shift())
        }
    }

}




export enum TimeType {
    INTERVAL,
    TIMEOUT,
}

export class JSTimer {

    protected _id: number = 0;
    protected _type: TimeType = 0;
    protected _duration: number = 0;
    protected _call: () => void = null;


    constructor(call: () => void, duration: number, type: TimeType) {
        this._call = call;
        this._type = type;
        this._duration = duration;
    }

    start() {
        this.clear()
        switch (this._type) {
            case TimeType.INTERVAL:
                this._id = setInterval(this.update.bind(this), this._duration)
                break;
            case TimeType.TIMEOUT:
                this._id = setTimeout(this.update.bind(this), this._duration);
                break;
        }
    }

    private update() {
        this._call()
    }

    getID() {
        return this._id;
    }

    getType() {
        return this._type;
    }

    clear() {
        switch (this._type) {
            case TimeType.INTERVAL:
                clearInterval(this._id)
                break;
            case TimeType.TIMEOUT:
                clearTimeout(this._id)
                break;
        }
    }

}
