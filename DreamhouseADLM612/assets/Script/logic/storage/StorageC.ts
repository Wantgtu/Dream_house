import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import StorageMgr from "./model/StorageMgr";
import StorageItemModel from "./model/StorageItemModel";
import BagManager from "../public/bag/BagManager";
import { ItemID } from "../../config/Config";
import { ItemState } from "../../cfw/model";
import ItemC from "../item/ItemC";
import CMgr from "../../sdk/channel-ts/CMgr";
import UmengEventID from "../../config/UmengEventID";


export default class StorageC extends BaseController {


    intoLayer() {
        ViewManager.pushUIView({
            path: 'prefabs/StorageView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            model: StorageMgr.instance(),
            controller: this,
        })
    }


    buyBox(m: StorageItemModel) {
        let token = m.getToken();
        if (BagManager.instance().isEnough(ItemID.TOKEN, token)) {
            BagManager.instance().updateItemNum(ItemID.TOKEN, -token)
            m.setState(ItemState.GOT)
            StorageMgr.instance().setNextModel()
            CMgr.helper.trackEvent(UmengEventID.storage_level, { level: m.getID() })
        } else {

            ItemC.instance().showBuyTokenView(token)
        }
    }
}