import { BaseController } from "../../cfw/mvc";
import BoxPopItemModel from "./model/BoxPopItemModel";
import SDKManager from "../../sdk/sdk/SDKManager";
import BoxpopMgr from "./model/BoxpopMgr";
import { GEvent } from "../../cfw/event";
import { EventName, RANDOM_BOX_OPEN_LEVEL, RedTipType } from "../../config/Config";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import BoxPopView from "./view/BoxPopView";
import CMgr from "../../sdk/channel-ts/CMgr";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";
import UIManager from "../../cfw/ui";
import UmengEventID from "../../config/UmengEventID";
import RedTipMgr from "../../extention/redtip/RedTipMgr";
import BagManager from "../public/bag/BagManager";
import LevelMgr from "../level/model/LevelMgr";

export default class BoxPopC extends BaseController {

    protected clickMap: { [key: number]: number } = {}
    // protected count: number = 0;
    intoLayer() {
        if (!CMgr.helper.hasGiftSpecial()) {
            return;
        }
        if (!BoxpopMgr.instance().isOpen()) {
            return;
        }
        if (!CMgr.helper.getzs_box_switch() || GameEventAdapter.instance().isOpen()) {
            return;
        }
        let time = CMgr.helper.getzs_box_show_delay()
        if (time > 0) {
            setTimeout(() => {
                this.show();
            }, time);
        } else {
            // this.show();
        }


    }

    show() {
        if (UIManager.instance().hasView('BoxPopView', UIIndex.STACK)) {
            return;
        }
        BoxpopMgr.instance().setRandomList()
        this.clickMap = {}
        // this.count = 0;
        ViewManager.pushUIView({
            path: "boxpop/BoxPopView",
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            className: BoxPopView,
            controller: this,
            model: BoxpopMgr.instance(),
            func: () => {
            }
        })
    }


    getUnUsedModel() {
        let list = BoxpopMgr.instance().getRandomList();
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (!this.clickMap[element.getID()]) {
                return element
            }
        }
        return null;
    }

    used(m: BoxPopItemModel) {
        return this.clickMap[m.getID()] == m.getID();
    }

    // getCount() {
    //     return ;
    // }

    clickBox(m?: BoxPopItemModel) {
        console.log('clickBox m ')
        if (m) {
            // console.log(' this.clickMap[m.getID()] == m.getID() ', this.clickMap[m.getID()] == m.getID())
            if (this.clickMap[m.getID()] == m.getID()) {
                return;
            }

        } else {
            return;
        }

        CMgr.helper.trackEvent(UmengEventID.boxpop_count)
        let item = m.getItem();
        // console.log(' BoxpopMgr.instance().needAd() 111', BoxpopMgr.instance().needAd())
        if (!BoxpopMgr.instance().needAd()) {
            BagManager.instance().updateItem(item)
            // this.count++;
            BoxpopMgr.instance().updateCount()
            GEvent.instance().emit(EventName.OPEN_BOX, m)
            // console.log(' BoxpopMgr.instance().needAd()222 ', BoxpopMgr.instance().needAd())
            if (BoxpopMgr.instance().needAd()) {
                RedTipMgr.instance().removeRedTip(RedTipType.BOX_POP)
            }
            this.clickMap[m.getID()] = m.getID();
        } else {
            CMgr.helper.showRewardAd(0, (r: number) => {
                if (r) {
                    // this.count++;
                    BagManager.instance().updateItem(item)
                    GEvent.instance().emit(EventName.OPEN_BOX, m)
                    CMgr.helper.trackEvent(UmengEventID.boxpop_ad_count)
                    this.clickMap[m.getID()] = m.getID();
                }
            })
        }

    }

 
}