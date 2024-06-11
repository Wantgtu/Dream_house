import { BaseItemView } from "../../../cfw/view";
import { GameView } from "../../game/view/GameView";
import TaskC from "../../task/TaskC";
import TaskMgr from "../../task/model/TaskMgr";
import { ItemState } from "../../../cfw/model";
import { EventName, SoundID } from "../../../config/Config";
import GuideMgr from "../../../extention/guide/GuideMgr";
import SoundMgr from "../../sound/model/SoundMgr";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyTaskItemView extends BaseItemView {
    protected gameView: GameView;

    setGameView(gv: GameView) {
        this.gameView = gv;
    }

    onButtonClick() {
        GuideMgr.instance().notify('onTaskBtnClick')
        TaskC.instance().intoLayer()
    }

    getOrder() {
        return 10
    }

    start() {
        this.gEventProxy.on(EventName.UPDATE_TASK_STATE, this.updateTaskState, this)
        this.updateTaskState()

    }

    updateTaskState() {
        let task = TaskMgr.instance().getCurTask();
        // let node = this.ScrollView.content.getChildByName('BuyTaskItemView')
        if (task && task.getState() == ItemState.CAN_GET) {
            this.node.active = true;

            SoundMgr.instance().playSound(SoundID.sfx_greenTick)
            this.popAnim()

        } else {
            this.node.active = false;
        }

    }

    popAnim() {
        cc.tween(this.node).by(0.2, { scale: 0.4 }).by(0.2, { scale: -0.4 }).start();
    }
}