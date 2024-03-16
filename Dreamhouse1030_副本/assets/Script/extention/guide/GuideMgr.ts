
import GuideEventName from "./GuideEventName";
import { OperateType } from "../gevent/GameEventConfig";
import OperateObserver from "../gevent/operate/OperateObserver";

export default class GuideMgr extends OperateObserver {
    private guideID: number = -1;
    // protected state: LocalMap

    constructor() {
        super();
        // this.state = new LocalMap('GuideMgrState', 0)
    }
    start(guideID: any) {
        // console.log('GuideMgr guideID  ', guideID)
        // if (this.state.get(guideID) == 0) {
        this.guideID = guideID;
        this.emit(GuideEventName.START + guideID, this.guideID)
        // } else {

        // }
    }
    getGuideID() {
        return this.guideID
    }

    isOpen() {
        return this.guideID > 0
    }

    end() {
        // let id = this.guideID;
        this.guideID = -1;
        // this.emit(GuideEventName.END)
        // this.emit(GuideEventName.FINISH, OperateType.OPEN_GUIDE)
        this.finish();
        // this.guideID++
        // this.start(this.guideID)
    }

    notify(param: string) {
        if (!this.isOpen()) {
            return;
        }
        this.emit(GuideEventName.UPDATE, param)
    }

}