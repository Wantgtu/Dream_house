import { BaseController } from "../../cfw/mvc";
import LevelMgr from "./model/LevelMgr";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import LevelItemModel from "./model/LevelItemModel";
import { ItemState } from "../../cfw/model";
import CMgr from "../../sdk/channel-ts/CMgr";
export default class LevelC extends BaseController {

    constructor() {
        super();
        // GEvent.instance().on(EventName.UPDATE_ITEM_NUM, this.udpateNum, this)
    }
    // udpateNum(m: ItemModel) {
    //     if (m.getID() == ItemID.EXP) {
    //         let lv = LevelMgr.instance().updateExp(m)
    //         if (lv) {
    //             setTimeout(() => {
    //                 GEvent.instance().emit(EventName.UPDATE_LEVEL)
    //                 this.intoLayer()
    //             }, 1000);
    //         }
    //     }
    // }
    intoLayer() {
        let m = LevelMgr.instance().getCurLevel()
        if (!m) {
            return;
        }
        // console.log(' state ', m.getState())
        if (m.getState() == ItemState.CAN_GET) {

            ViewManager.pushUIView({
                path: 'prefabs/LevelView',
                moduleID: ModuleID.PUBLIC,
                uiIndex: UIIndex.STACK,
                model: m,
                controller: this,
            })
        }

    }

    getReward(m: LevelItemModel, r: number) {
        if (r > 1) {
            CMgr.helper.showRewardAd(0, (s: number) => {
                if (s) {
                    LevelMgr.instance().addItems(m, r)
                }
            })
        } else {
            LevelMgr.instance().addItems(m, r)
        }

    }


}