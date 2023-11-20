class EventTarget {
    ower: any;
    type: string
    cb: Function;

}

export class EventDispatcher {

    private eventHash: { [key: string]: EventTarget[] } = {};

    offAll() {
        this.eventHash = {};
    }

    offByName(type: string) {
        this.eventHash[type] = [];
    }

    clearByTarget(type: string, ower: any) {
        var events = this.eventHash[type];
        if (events && events.length > 0) {
            for (let index = 0; index < events.length; index++) {
                const event = events[index];
                if (event.ower === ower) {
                    events.splice(index, 1)
                    break;
                }
            }
        }
    }

    on(type: string, cb: Function, ower: any) {
        let index = this.has(type, cb, ower)
        if (index >= 0) {
            return;
        }
        if (!this.eventHash[type]) {
            this.eventHash[type] = [];
        }

        var event: EventTarget = new EventTarget();
        event.ower = ower;
        event.type = type;
        event.cb = cb;

        this.eventHash[type].push(event);
    };

    has(type: string, cb: Function, ower: any) {
        var events = this.eventHash[type];
        if (events && events.length > 0) {
            for (let index = 0; index < events.length; index++) {
                const event = events[index];
                if (event.ower === ower && event.cb === cb) {
                    return index;
                }
            }
        }
        return -1;
    }

    off(type: string, cb: Function, ower: any) {
        var events = this.eventHash[type];
        if (events && events.length > 0) {
            for (let index = 0; index < events.length; index++) {
                const event = events[index];
                if (event.ower === ower && event.cb === cb) {
                    events.splice(index, 1);
                    break;
                }
            }
        }
    }

    emit(type: string, ...data: any) {
        var events = this.eventHash[type];
        if (events && events.length > 0) {
            for (let index = 0; index < events.length; index++) {
                const event = events[index];
                event.cb.call(event.ower, ...data)
            }
        }
    }
}



export class EventProxy {


    private dispatcher: EventDispatcher;
    private eventMap: { [k: string]: any } = {}
    protected count: number = 0;
    setDispatcher(dispatcher: EventDispatcher) {
        this.dispatcher = dispatcher;
        this.count = 0;
    }

    on(eventName: string, func: Function, target: Object) {
       
        this.count++;
        if (!this.eventMap[eventName]) {
            this.dispatcher.on(eventName, func, target);
            this.eventMap[eventName] = { eventName: eventName, target: target, func: func };
        }
    }

    has(eventName: string) {
        return this.eventMap[eventName] != undefined;
    }

    offAll() {
        if (this.dispatcher) {
            for (const key in this.eventMap) {
                const element = this.eventMap[key];
                this.count--;
                this.dispatcher.off(element.eventName, element.func, element.target);

            }
            this.eventMap = {}
        }

    }
}

export class GEvent extends EventDispatcher {
    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }

    static EVENT_HIDE: string = 'EVENT_HIDE'

    static EVENT_SHOW: string = 'EVENT_SHOW'

    static CHANGE_AD_STATE: string = 'EVENT_CHANGE_AD_STATE'

    static POP_VIEW: string = 'POP_VIEW'

    static CHANGE_LANG: string = 'CHANGE_LANG'


    pause() {

        this.emit(GEvent.EVENT_HIDE)
    }

    resume() {

        this.emit(GEvent.EVENT_SHOW)
    }

}

export class GEventProxy extends EventProxy {

    constructor() {
        super()
        this.setDispatcher(GEvent.instance())
    }
}
