export default class ChannelEvent {
    static LOAD_EXPORT_DATA = 'LOAD_EXPORT_DATA'
    static LOAD_CONFIG  = 'LOAD_CONFIG'
    private eventHash = {};

    private static ins: ChannelEvent

    static instance() {
        if (!this.ins) {
            this.ins = new ChannelEvent();
        }
        return this.ins;
    }

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
        if (!this.eventHash.hasOwnProperty(type)) {
            this.eventHash[type] = [];
        }

        var event = {};
        event["ower"] = ower;
        event["type"] = type;
        event["callback"] = cb;

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

    emit(type: string, ...data) {
        var events = this.eventHash[type];
        if (events && events.length > 0) {
            for (var i in events) {
                var event = events[i];
                event.callback && (event.callback(event.ower, ...data));
            }
        }
    }
}