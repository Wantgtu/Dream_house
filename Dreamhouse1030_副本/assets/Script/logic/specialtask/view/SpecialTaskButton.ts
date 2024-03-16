import SpecialTaskC from "../SpecialTaskC";
import { SPECIAL_TASK_OK } from "../../../config/Config";
import SpecialtaskMgr from "../model/SpecialtaskMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialTaskButton extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        SpecialtaskMgr.instance();
        this.node.active = SPECIAL_TASK_OK
    }

    onButtonClick() {
        SpecialTaskC.instance().intoLayer()
    }

    // update (dt) {}
}
