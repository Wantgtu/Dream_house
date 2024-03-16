import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import DailyTaskMgr from "./model/DailyTaskMgr";
import DailyTaskView from "./view/DailyTaskView";
import DailyTaskItemModel from "./model/DailyTaskItemModel";
import { ItemState } from "../../cfw/model";
import BagManager from "../public/bag/BagManager";
import { RedTipType } from "../../config/Config";
import RedTipMgr from "../../extention/redtip/RedTipMgr";
import CMgr from "../../sdk/channel-ts/CMgr";
import UmengEventID from "../../config/UmengEventID";
import UIManager from "../../cfw/ui";
// import LevelMgr from "../player/model/LevelMgr";
// import RedTipManager from "../../redtip/model/RedTipManager";


export default class DailyTaskC extends BaseController {

    intoLayer() {
        if (!CMgr.helper.hasDailyTask()) {
            return;
        }
        // if (UIManager.instance().hasView('DailyTaskView', UIIndex.STACK)) {
        //     return;
        // }
        ViewManager.pushUIView({
            path: "prefabs/DailyTaskView",
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            className: DailyTaskView,
            controller: this,
            model: DailyTaskMgr.instance(),
            func: () => {
            }
        })
    }

    buyClick(m: DailyTaskItemModel, p: cc.Vec2) {
        if (m.getState() == ItemState.CAN_GET) {
            let item = m.getItem();
            BagManager.instance().updateItem(item, p)
            m.setState(ItemState.GOT)
            RedTipMgr.instance().removeRedTip(RedTipType.DAILY_TASK, m.getID())
            CMgr.helper.trackEvent(UmengEventID.daily_task, { taskID: m.getID() })
            // RedTipManager.instance().removeRedTip(8, m.getID())
        }

    }
}