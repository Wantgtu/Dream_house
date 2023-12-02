import { BaseItemView } from "../../../cfw/view";
import { GameView } from "../../game/view/GameView";
import { GEvent } from "../../../cfw/event";
import { EventName, SoundID } from "../../../config/Config";
import BuildItemModel from "../../scene/model/BuildItemModel";
import TaskMgr from "../../task/model/TaskMgr";
import SceneMgr from "../../scene/model/SceneMgr";
import { ItemState } from "../../../cfw/model";
import GuideMgr from "../../../extention/guide/GuideMgr";
import SoundMgr from "../../sound/model/SoundMgr";
import UIManager from "../../../cfw/ui";
import { engine } from "../../../engine/engine";
import Debug from "../../../cfw/tools/Debug";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyBuildTipView extends BaseItemView {

    protected gameView: GameView;
    protected curBuild: BuildItemModel;
    setGameView(gv: GameView) {
        this.gameView = gv;
    }

    onButtonClick() {
        GuideMgr.instance().notify('onBuiltClick')
        if (!this.curBuild) {
            this.curBuild = TaskMgr.instance().getCurBuild()
        }
        GEvent.instance().emit(EventName.CLOSE_GAME_VIEW, this.curBuild)
        this.curBuild = null;
        // UIManager.instance().popAll();
    }

    getOrder() {
        return 10
    }

    start() {
        this.node.active = false;
        this.gEventProxy.on(EventName.NEW_BUILD_OPEN, this.updateState, this)
        this.updateState(TaskMgr.instance().getCurBuild())

    }

    updateState(build: BuildItemModel) {
        Debug.log(' build.getState() ', build.getState())
        this.curBuild = build;
        if (SceneMgr.instance().hasBuildNotOpen(build)) {
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
    // update (dt) {}
}
