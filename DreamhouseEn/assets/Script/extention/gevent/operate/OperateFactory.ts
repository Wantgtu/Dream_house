import { OperateType } from "../GameEventConfig";
import GuideMgr from "../../guide/GuideMgr";
import GameTipMgr from "../../gameTip/model/GameTipMgr";
import CloseGameTip from "../../gameTip/model/CloseGameTip";
import GameEventAdapter from "../GameEventAdapter";
import OperateObserver from "./OperateObserver";
import DialogMgr from "../../dialog/model/DialogMgr";


export default class OperateFactory {

    protected static ins: { [key: number]: OperateObserver } = {};
    static build(type: OperateType, event: GameEventAdapter) {
        let ins = this.ins[type]
        if (!ins) {
            switch (type) {
                case OperateType.OPEN_GUIDE:
                    ins = GuideMgr.instance()
                    break;
                case OperateType.OPEN_TIP:
                    ins = GameTipMgr.instance()
                    break;
                case OperateType.CLOSE_TIP:
                    ins = CloseGameTip.instance()
                    break;
                case OperateType.OPEN_DIALOG:
                    ins = DialogMgr.instance();
                    break;

            }
            if (ins) {
                this.ins[type] = ins;
                ins.setEvent(event)
                ins.setType(type)
            }
        }
        return ins;

    }
}