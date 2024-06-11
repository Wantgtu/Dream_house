import { BaseItemView } from "../../../cfw/view";
import TaskItemModel from "../model/TaskItemModel";
import { ItemState } from "../../../cfw/model";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class TaskBuildProgress extends BaseItemView {

    @property(cc.Node)
    lock: cc.Node = null;

    @property(cc.Node)
    curBg: cc.Node = null;


    @property(cc.Node)
    right: cc.Node = null;

    @property(cc.Label)
    idLabel: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    protected model: TaskItemModel

    updateState() {
        this.idLabel.string = this.model.getID();
        // console.log('TaskBuildProgress this.model.getState() ', this.model.getState(), this.model.getID())
        switch (this.model.getState()) {
            case ItemState.NOT_GET:
                this.curBg.active = false;
                this.right.active = false;
                this.lock.active = true
                break;
            case ItemState.GOT:
                this.curBg.active = false;
                this.right.active = true;
                this.lock.active = false
                break;
            case ItemState.ON_GOING:
                this.curBg.active = true;
                this.right.active = false;
                this.lock.active = false
                break;
            case ItemState.CAN_GET:
                this.curBg.active = false;
                this.right.active = true;
                this.lock.active = false
                break;
        }
    }

    // update (dt) {}
}
