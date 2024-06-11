import CMgr from "../channel-ts/CMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TrackEvent extends cc.Component {

    @property
    eventName: string = ''

    start() {
        CMgr.helper.trackEvent(this.eventName)
    }
}