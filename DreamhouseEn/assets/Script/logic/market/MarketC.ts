import { BaseController } from "../../cfw/mvc";
import { UIIndex } from "../../config/UIConfig";
import MarketMgr from "./model/MarketMgr";
import { ModuleID } from "../../config/ModuleConfig";
import ViewManager from "../../cfw/tools/ViewManager";
import BagManager from "../public/bag/BagManager";
import { ItemID, DailyTaskID } from "../../config/Config";
import TipC from "../public/tip/TipC";
import DailyTaskMgr from "../dailytask/model/DailyTaskMgr";
import CMgr from "../../sdk/channel-ts/CMgr";
import UmengEventID from "../../config/UmengEventID";
import UIManager from "../../cfw/ui";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";
import WeeklyC from "../weekly/WeeklyC";
import Debug from "../../cfw/tools/Debug";
import BaseMarketItemModel from "./model/BaseMarketItemModel";


export default class MarketC extends BaseController {
    intoLayer() {
        // if (UIManager.instance().hasView('MarketView', UIIndex.STACK)) {
        //     return;
        // }
        ViewManager.pushUIView({
            path: 'market/prefab/MarketView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            model: MarketMgr.instance(),
            controller: this,
        })
    }


    buyItem(m: BaseMarketItemModel, pos: cc.Vec2) {
        let count = m.getCount();
        if (count > 0 || count == -1) {
            let costItem = m.getCostItem();
            let itemList = m.getItemList()
            if (costItem) {
                let id = costItem.getID();
                Debug.log('costItem id ', id)
                if (id == ItemID.AD) {
                    CMgr.helper.showRewardAd(0, (r: number) => {
                        if (r) {
                            m.setCostNum(m.getCostNum() - 1)
                            if (m.getCostNum() == 0) {
                                m.resetCostNum();
                                if (count > 0)
                                    m.setCount(count - 1)
                                for (let index = 0; index < itemList.length; index++) {
                                    const element = itemList[index];
                                    BagManager.instance().updateItem(element, pos)
                                }
                                if (m.getID() == 11) {
                                    DailyTaskMgr.instance().updateTaskCount(DailyTaskID.GIFT)
                                }
                                CMgr.helper.trackEvent(UmengEventID.market_reawrd, { id: m.getID() })
                            }

                        }
                    })
                } else if (id == ItemID.SHARE) {
                    CMgr.helper.showShare(0, (r: number) => {
                        if (r) {
                            m.setCostNum(m.getCostNum() - 1)
                            if (m.getCostNum() == 0) {
                                m.resetCostNum();
                                if (count > 0)
                                    m.setCount(count - 1)
                                for (let index = 0; index < itemList.length; index++) {
                                    const element = itemList[index];
                                    BagManager.instance().updateItem(element, pos)
                                }

                                CMgr.helper.trackEvent(UmengEventID.market_reawrd_by_share, { id: m.getID() })
                                // if (m.getID() == 11) {
                                //     DailyTaskMgr.instance().updateTaskCount(DailyTaskID.GIFT)
                                // }
                            }
                        }
                    })
                } else if (id == ItemID.SCRATCH_CARD) {
                    let num = m.getCostNum()
                    Debug.log(' num ', num, costItem.getID(), m.getCostNum())
                    if (BagManager.instance().isEnough(id, num)) {
                        BagManager.instance().updateItemNum(id, -num)
                        for (let index = 0; index < itemList.length; index++) {
                            const element = itemList[index];
                            BagManager.instance().updateItem(element, pos)
                        }
                        if (count > 0)
                            m.setCount(count - 1)

                        // CMgr.helper.trackEvent(UmengEventID.buy_item, { itemID: m.getID() })
                    } else {
                        TipC.instance().showToast(costItem.getName() + ' not enough')
                    }
                } else {
                    let num = m.getNum();
                    if (BagManager.instance().isEnough(id, num)) {
                        BagManager.instance().updateItemNum(id, -num)
                        for (let index = 0; index < itemList.length; index++) {
                            const element = itemList[index];
                            BagManager.instance().updateItem(element, pos)
                        }
                        if (count > 0)
                            m.setCount(count - 1)

                        CMgr.helper.trackEvent(UmengEventID.buy_item, { itemID: m.getID() })
                    } else {
                        TipC.instance().showToast(costItem.getName() + ' not enough')
                    }
                }
            } else {
                if (count > 0)
                    m.setCount(count - 1)
                for (let index = 0; index < itemList.length; index++) {
                    const element = itemList[index];
                    BagManager.instance().updateItem(element, pos)
                }
            }


        }
    }

    refreshItem() {
        let model = MarketMgr.instance().getMarketTypeModel(1)
        let cost = model.getCost();
        if (BagManager.instance().isEnough(ItemID.TOKEN, cost)) {
            BagManager.instance().updateItemNum(ItemID.TOKEN, -cost)
            model.setFoodList();
            model.resetCount()
        } else {
            TipC.instance().showToast('Diamond shortage！')
        }
    }

    back() {
        if (!GameEventAdapter.instance().isOpen()) {
            WeeklyC.instance().intoLayer()
        }
    }
}