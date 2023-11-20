import SDKEvent from "../../tools/SDKEvent";

export default class UmaEvent extends SDKEvent {



    trackEvent(eventID: string, param?: any) {
        if (window['wx']) {
            if (window['wx']['uma'] && eventID)
                window['wx']['uma'].trackEvent(eventID, param)
        }

    }
}