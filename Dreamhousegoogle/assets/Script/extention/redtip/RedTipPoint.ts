import { RedTipType } from "../../config/Config";
import RedTipView from "./RedTipView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RedTipPoint extends cc.Component {

    @property({ type: cc.Enum(RedTipType) })
    type: RedTipType = RedTipType.HAS_TASK

    @property
    id: number = -1;


    upateState() {
        let view = this.node.getComponent(RedTipView)
        if (view) {
            view.updateState();
        }
    }
}