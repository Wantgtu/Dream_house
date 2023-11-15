
export default class Debug {


    static isDebug: boolean = true;

    private static time: number = 0;
    static timeStart() {
        this.time = Date.now()
    }

    static timeEnd() {
        this.time = Date.now() - this.time;
        return this.time
    }

    static log(...data: any) {
        if (this.isDebug)
            console.log.apply(console, arguments)
    }

    static error(...data: any) {
        if (this.isDebug)
            console.error.apply(console, arguments)
    }

    static warn(...data: any) {
        if (this.isDebug)
            console.warn.apply(console, arguments)
    }
}