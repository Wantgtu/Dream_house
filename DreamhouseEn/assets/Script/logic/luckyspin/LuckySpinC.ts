import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import LuckySpinView from "./view/LuckySpinView";
import LuckyspinMgr from "./model/LuckyspinMgr";
import SDKManager from "../../sdk/sdk/SDKManager";
import CMgr from "../../sdk/channel-ts/CMgr";
import UIManager from "../../cfw/ui";
import UmengEventID from "../../config/UmengEventID";
import RedTipMgr from "../../extention/redtip/RedTipMgr";
import { EGG_OPEN_LEVEL, LUCKY_SPIN_OPEN_LEVEL, RedTipType } from "../../config/Config";
import LuckySpinItemModel from "./model/LuckySpinItemModel";
import EngineHelper from "../../engine/EngineHelper";
import BagManager from "../public/bag/BagManager";
import LevelMgr from "../level/model/LevelMgr";


export default class LuckySpinC extends BaseController {


    intoLayer() {
        if (!LuckyspinMgr.instance().isOpen()) {
            return;
        }
        // if (UIManager.instance().hasView('LuckySpinView', UIIndex.STACK)) {
        //     return;
        // }
        ViewManager.pushUIView({
            path: 'luckyspin/LuckySpinView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            className: LuckySpinView,
            model: LuckyspinMgr.instance(),
            controller: this
        })
    }


    addItem(result: LuckySpinItemModel) {
        let m: LuckyspinMgr = LuckyspinMgr.instance()
        m.updateCount();
        BagManager.instance().updateItem(result.getItem(), EngineHelper.getMidPos())
        if (m.needAd()) {
            RedTipMgr.instance().removeRedTip(RedTipType.LUCKY_SPIN)
        }
    }


    onOkClick(m: LuckyspinMgr) {
        CMgr.helper.trackEvent(UmengEventID.luckyspin_count)
        if (m.needAd()) {
            CMgr.helper.showRewardAd(0, (r: number) => {
                if (r) {
                    // m.updateCount();
                    m.emit(LuckyspinMgr.NOTIFY_RESULT)
                    CMgr.helper.trackEvent(UmengEventID.luckyspin_ad_count)
                }
            })
        } else {
            // m.updateCount();
            m.emit(LuckyspinMgr.NOTIFY_RESULT)

        }
    }

}