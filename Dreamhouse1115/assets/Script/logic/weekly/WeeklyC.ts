import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import WeeklyRewardView from "./view/WeeklyRewardView";
import WeeklyMgr from "./model/WeeklyMgr";
import User from "../user/User";
import BagManager from "../public/bag/BagManager";
import SDKManager from "../../sdk/sdk/SDKManager";
import UIManager from "../../cfw/ui";
import { ItemState } from "../../cfw/model";
import { engine } from "../../engine/engine";
import EngineHelper from "../../engine/EngineHelper";
import CMgr from "../../sdk/channel-ts/CMgr";
import UmengEventID from "../../config/UmengEventID";

export default class WeeklyC extends BaseController {

    intoLayer() {
        // console.log('WeeklyC intoLayer')
        let model = WeeklyMgr.instance();
        if (!model.hasReward()) {
            // console.log('WeeklyC not have model ')
            return;
        }

        ViewManager.pushUIView({
            path: "prefabs/WeeklyRewardView",
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.QUEUE,
            className: WeeklyRewardView,
            controller: this,
            model: model,
            func: () => {
            }
        })
    }

    getReward(r: number) {

        let day = WeeklyMgr.instance().getCurDay()
        if (day) {

            // console.log(' day ', day.getID())
            let item = day.getItem();
            let num = r * item.getNum(false);
            // console.log('getReward num === ', num)
            if (r > 1) {
                // CMgr.helper.trackEvent(SDKEventID.vedio_weekly)
                CMgr.helper.showRewardAd(0, (s: number) => {
                    if (s == 1) {
                        let pos = EngineHelper.getMidPos()
                        BagManager.instance().updateItemNum(item.getID(), num, pos)
                        day.setState(ItemState.GOT)
                        UIManager.instance().popView()
                        CMgr.helper.trackEvent(UmengEventID.weekly_reward)
                    }
                })
            } else {
                let pos = EngineHelper.getMidPos()
                BagManager.instance().updateItemNum(item.getID(), num, pos)
                day.setState(ItemState.GOT)
                UIManager.instance().popView()
            }
        }
    }
}