import ShareController from "./ShareController";
import { BaseView } from "../../cfw/view";
import UmengEventID from "../../config/UmengEventID";
import CMgr from "../channel-ts/CMgr";
import BagManager from "../../logic/public/bag/BagManager";
import EngineHelper from "../../engine/EngineHelper";
import TipC from "../../logic/public/tip/TipC";
import UIManager from "../../cfw/ui";


export default class NormalShareC extends ShareController {


    stopRecorder(view: BaseView) {
        CMgr.helper.showShare(0, (rs: number) => {
            if (rs) {
                CMgr.helper.trackEvent(UmengEventID.buy_energy_use_share)
                BagManager.instance().updateItem(this.getItem(), EngineHelper.getMidPos())
            } else {
                TipC.instance().showToast('分享失败')
            }
            UIManager.instance().popView(view)
        }, null)
    }
}