import GameEventAdapter from "../GameEventAdapter";
import { BaseModel } from "../../../cfw/model";
import { OperateType } from "../GameEventConfig";


export default class OperateObserver extends BaseModel {

    protected event: GameEventAdapter;

    protected type: OperateType = OperateType.CLOSE_TIP;

    setType(t: OperateType) {
        this.type = t;
    }

    setEvent(e: GameEventAdapter) {
        this.event = e;
    }

    start(param?: any): void {

    }

    finish() {
        if (this.event) {
            this.event.eventFinish(this.type)
        }
    }
}