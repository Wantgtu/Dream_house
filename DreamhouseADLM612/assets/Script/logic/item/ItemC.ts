import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import ItemMgr from "./model/ItemMgr";
import { DIR } from "../../cfw/tools/Define";
import SDKManager from "../../sdk/sdk/SDKManager";
import BagManager from "../public/bag/BagManager";
import { ItemID, ENRGY_NUM, ENRGY_NUM2, BUY_TOKEN } from "../../config/Config";
import UIManager from "../../cfw/ui";
import BuyTokenModel from "./model/BuyTokenModel";
import MarketC from "../market/MarketC";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";
import CMgr from "../../sdk/channel-ts/CMgr";
import EngineHelper from "../../engine/EngineHelper";
import { BaseView } from "../../cfw/view";
import UmengEventID from "../../config/UmengEventID";

export default class ItemC extends BaseController {

    intoLayer() {
        ViewManager.pushUIView({
            path: 'prefabs/MoneyView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.TOP,
            model: ItemMgr.instance(),
            controller: this,
        })
    }

    showBuyEnergyView() {
        // if (UIManager.instance().hasView('BuyEnergyView', UIIndex.STACK)) {
        //     return;
        // }
        ViewManager.pushUIView({
            path: 'prefabs/BuyEnergyView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            model: ItemMgr.instance(),
            controller: this,
        })
    }

    buyEnergy(dir: DIR) {
        // console.log(' dir ', dir)
        let size = cc.view.getVisibleSize();
        let pos = cc.v2(size.width / 2, size.height / 2)
        if (dir == DIR.LEFT) {
            CMgr.helper.showRewardAd(0, (r: number) => {
                // console.log(' r == ', r)
                if (r) {
                    BagManager.instance().updateItemNum(ItemID.ENERGY, ENRGY_NUM2, pos)
                    UIManager.instance().popView()
                    CMgr.helper.trackEvent(UmengEventID.buy_energy)
                }
            })
        } else {
            let cost = ItemMgr.instance().getBuyEnergyCost();
            // console.log(' cost ', cost)
            if (GameEventAdapter.instance().isOpen()) {
                BagManager.instance().updateItemNum(ItemID.ENERGY, ENRGY_NUM, pos)
                UIManager.instance().popView()
            } else {
                if (BagManager.instance().isEnough(ItemID.TOKEN, cost)) {
                    BagManager.instance().updateItemNum(ItemID.ENERGY, ENRGY_NUM, pos)
                    BagManager.instance().updateItemNum(ItemID.TOKEN, -cost)
                    ItemMgr.instance().updateBuyEnergyCount()
                    UIManager.instance().popView()
                    CMgr.helper.trackEvent(UmengEventID.buy_energy_use_token, { cost: cost })
                } else {
                    //够买钻石
                    ItemC.instance().showBuyTokenView(cost)
                }
            }

        }
    }

    showBuyTokenView(cost: number) {
        // if (UIManager.instance().hasView('BuyTokenView', UIIndex.STACK)) {
        //     return;
        // }
        let have = BagManager.instance().getNum(ItemID.TOKEN);
        let num = cost - have;
        ViewManager.pushUIView({
            path: 'prefabs/BuyTokenView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            model: new BuyTokenModel(num),
            controller: this,
        })
    }

    openStoreView() {
        MarketC.instance().intoLayer()
    }

    buyToken(view: BaseView) {
        CMgr.helper.showRewardAd(0, (r: number) => {
            if (r) {
                UIManager.instance().popView(view)
                BagManager.instance().updateItemNum(ItemID.TOKEN, BUY_TOKEN, EngineHelper.getMidPos())
                CMgr.helper.trackEvent(UmengEventID.buy_token_at_out)
            }
        })
    }

}
