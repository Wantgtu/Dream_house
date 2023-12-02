import SDKEventDispatcher from "./SDKEventDispatcher";

export default class SDKEvent extends SDKEventDispatcher {

    static REWARD_AD_OPEN: string = 'REWARD_AD_OPEN'
    static REWARD_AD_CLOSE: string = 'REWARD_AD_CLOSE'

    static instance<T extends {}>(this: new () => T): T {
        if (!(<any>this).ins) {
            (<any>this).ins = new this();
        }
        return (<any>this).ins;
    }
    trackEvent(eventID: string, param?: any) {

    }
}