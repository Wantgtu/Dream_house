


class EventListener {
    ower: any
    type: string
    callback: Function
}

export default class SDKEventDispatcher {

    private eventHash: { [key: string]: EventListener[] } = {};

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

        var event: EventListener = new EventListener();
        event.ower = ower;
        event.type = type;
        event.callback = cb;

        this.eventHash[type].push(event);
    };

    has(type: string, cb: Function, ower: any) {
        var events = this.eventHash[type];
        if (events && events.length > 0) {
            for (let index = 0; index < events.length; index++) {
                const event = events[index];
                if (event.ower === ower && event.callback === cb) {
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
                if (event.ower === ower && event.callback === cb) {
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
                event.callback.call(event.ower, ...data)
            }
        }
    }
}


