import { BaseController } from "../../cfw/mvc";
import ActivityMgr from "./model/ActivityMgr";
import ActivityItemModel from "./model/ActivityItemModel";
import BagManager from "../public/bag/BagManager";
import { ItemID, EventName, RedTipType } from "../../config/Config";
import SDKManager from "../../sdk/sdk/SDKManager";
import { UIIndex } from "../../config/UIConfig";
import { ModuleID } from "../../config/ModuleConfig";
import OfflineView from "./view/OfflineView";
import ViewManager from "../../cfw/tools/ViewManager";
import UIManager from "../../cfw/ui";
import OnlineView from "./view/OnlineView";
import { GEvent } from "../../cfw/event";
import { engine } from "../../engine/engine";
import EngineHelper from "../../engine/EngineHelper";
import RedTipMgr from "../../extention/redtip/RedTipMgr";
import CMgr from "../../sdk/channel-ts/CMgr";
import UmengEventID from "../../config/UmengEventID";
export default class ActivityC extends BaseController {

    intoLayer() {

    }


    showOfflineView() {
        if (!CMgr.helper.hasOffline()) {
            return;
        }
        let m = ActivityMgr.instance().getActivityItemModel(1)
        let passTime = m.getPassTime();
        // passTime = 
        let tm = passTime / 60;
        // console.log("showOfflineView tm ", tm)
        if (tm < 1) {
            tm = 1;
            // return;
        }
        ViewManager.pushUIView({
            path: "prefabs/OfflineView",
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.QUEUE,
            className: OfflineView,
            controller: this,
            model: m,
            func: () => {
            }
        })
    }

    showOnlineView() {
        if (!CMgr.helper.hasOnline()) {
            return;
        }
        if (UIManager.instance().hasView('OnlineView', UIIndex.STACK)) {
            return;
        }
        GEvent.instance().emit(EventName.ONLINE_LIGHT_EFFECT, false)
        let m = ActivityMgr.instance().getActivityItemModel(2)
        ViewManager.pushUIView({
            path: "prefabs/OnlineView",
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            className: OnlineView,
            controller: this,
            model: m,
            func: () => {
            }
        })
    }


    getOfflineReward(m: ActivityItemModel, ratio: number) {
        let token = m.getTokenNum() * ratio;
        let gold = m.getGoldNum() * ratio;
        let pos = EngineHelper.getMidPos()
        if (ratio == 2) {

            CMgr.helper.showRewardAd(0, (r: number) => {
                if (r) {
                    UIManager.instance().popView()
                    m.reset()
                    BagManager.instance().updateItemNum(ItemID.ENERGY, gold, pos)
                    // BagManager.instance().updateItemNum(ItemID.TOKEN, token, pos)
                    CMgr.helper.trackEvent(UmengEventID.offline_reward)
                }
            })
        } else {
            m.reset()
            BagManager.instance().updateItemNum(ItemID.ENERGY, gold, pos)
            // BagManager.instance().updateItemNum(ItemID.TOKEN, token, pos)
        }
    }

    getOnlineReward(m: ActivityItemModel, ratio: number) {
        let passTime = m.getLeftTime();
        // console.log('getOnlineReward passTime ', passTime)
        if (passTime > 0) {

            CMgr.helper.showRewardAd(0, (r: number) => {
                if (r) {
                    m.setTime(Date.now())
                    ActivityMgr.instance().checkState()
                    CMgr.helper.trackEvent(UmengEventID.online_reach_time)
                }
            })
        } else {
            let item = m.getItem();
            // if (item) {
            //     item.setNum(item.getNum() * ratio)
            // }
            let token = m.getOnlineToken() * ratio;
            let gold = m.getOnLineGold() * ratio;

            let pos = EngineHelper.getMidPos()
            if (ratio == 2) {

                CMgr.helper.showRewardAd(0, (r: number) => {
                    if (r) {
                        UIManager.instance().popView()
                        m.updateCount()
                        m.reset()
                        // GEvent.instance().emit(EventName.ONLINE_LIGHT_EFFECT, false)
                        BagManager.instance().updateItemNum(ItemID.ENERGY, gold, pos)
                        // BagManager.instance().updateItemNum(ItemID.TOKEN, token, pos)
                        RedTipMgr.instance().removeRedTip(RedTipType.ONLINE)
                        CMgr.helper.trackEvent(UmengEventID.online_reward)
                        // RedTipManager.instance().removeRedTip(9)
                        BagManager.instance().updateItemNum(item.getID(), token, pos)

                    }
                })
            } else {
                m.updateCount()
                m.reset()

                BagManager.instance().updateItemNum(ItemID.ENERGY, gold, pos)
                // BagManager.instance().updateItemNum(ItemID.TOKEN, token, pos)
                BagManager.instance().updateItemNum(item.getID(), token, pos)
                RedTipMgr.instance().removeRedTip(RedTipType.ONLINE)
                // RedTipManager.instance().removeRedTip(9)

            }
        }


    }
}