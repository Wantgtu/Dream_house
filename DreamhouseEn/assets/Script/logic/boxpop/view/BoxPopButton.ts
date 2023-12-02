import { RANDOM_BOX_OPEN_LEVEL } from "../../../config/Config";
import CMgr from "../../../sdk/channel-ts/CMgr";
import TipC from "../../public/tip/TipC";
import BoxPopC from "../BoxPopC";
import BoxpopMgr from "../model/BoxpopMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxPopButton extends cc.Component {



    start() {
        this.node.active = CMgr.helper.hasGiftSpecial();
        BoxpopMgr.instance();
    }


    onButtonClick() {
        // BoxPopC.instance().show()

        if (BoxpopMgr.instance().isOpen()) {
            BoxPopC.instance().show()
        } else {
            TipC.instance().showToast(BoxpopMgr.instance().getTip())
        }
    }

    // update (dt) {}
}
