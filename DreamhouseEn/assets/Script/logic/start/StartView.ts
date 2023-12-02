import { BaseView } from "../../cfw/view";
import { ModuleManager } from "../../cfw/module";
import { ModuleID } from "../../config/ModuleConfig";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class StartView extends BaseView {

    @property([cc.Sprite])
    list: cc.Sprite[] = [];



    protected time: number = 0;
    protected step: number = 0;
    protected state: number = 0;
    start() {

    }

    onNextClick() {
        this.updateStep();
    }

    updateStep() {

        this.time = 0;
        if (this.step > this.list.length - 1) {
            this.state = 1;
            this.controller.toNext();
        } else {
            let node = this.list[this.step++].node;
            if (node) {
                cc.tween(node).to(0.5, { opacity: 0 }).start();
            }
        }


    }

    update(dt) {
        if (this.state == 0) {
            this.time += dt;
            if (this.time >= 1.5) {
                this.time = 0;

                this.updateStep();

            }
        }

    }

    onDestroy() {
        super.onDestroy()
        ModuleManager.release(ModuleID.START)
    }
}
