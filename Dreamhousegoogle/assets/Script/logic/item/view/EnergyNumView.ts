import { BaseItemView } from "../../../cfw/view";
import { EventName, ItemID, ENERGY_MAX, ENERGY_TIME } from "../../../config/Config";
import BagManager from "../../public/bag/BagManager";
import { TimeDisplay } from "../../../cfw/time";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnergyNumView extends BaseItemView {

    @property(cc.Label)
    label: cc.Label = null;



    start() {
        this.gEventProxy.on(EventName.UPDATE_ENERGY_TIMER, this.updateTime, this)
        this.updateTime(ENERGY_TIME)
    }

    updateTime(time: number) {
        let num = BagManager.instance().getNum(ItemID.ENERGY)
        if (num >= ENERGY_MAX) {
            this.label.string = 'Full'
        } else {
            this.label.string = TimeDisplay.getPointString(time)
        }
    }


}
