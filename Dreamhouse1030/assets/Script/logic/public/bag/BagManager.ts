import { ItemType, ItemID, BUY_GOLD, DailyTaskID } from "../../../config/Config";
import ItemMgr from "../../item/model/ItemMgr";
import { BaseModel, ItemState, BaseItemModel } from "../../../cfw/model";
import SDKManager from "../../../sdk/sdk/SDKManager";
import ItemModel from "../../item/model/ItemModel";
import LangManager from "../../../cfw/tools/LangManager";
import TipC from "../tip/TipC";
import FoodMgr from "../../game/model/FoodMgr";
import GridFoodMgr from "../../game/model/GridFoodMgr";
import DailyTaskMgr from "../../dailytask/model/DailyTaskMgr";
import CMgr from "../../../sdk/channel-ts/CMgr";
import Debug from "../../../cfw/tools/Debug";


export default class BagManager extends BaseModel {


    getNewItemModel(id, num: number) {
        let type = Math.floor(id / 1000)

        if (type == ItemType.FOOD) {
            return FoodMgr.instance().getNewItemModel(id, num)
        } else {
            // Debug.warn('type == ItemType.FOOD  ', type == ItemType.FOOD, id, type)
            return ItemMgr.instance().getNewItemModel(id, num)
        }
    }


    updateItem(item: BaseItemModel, p?: cc.Vec2) {
        this.updateItemNum(item.getID(), item.getNum(false), p)
    }

    reduceItem(item: BaseItemModel, p?: cc.Vec2) {
        this.updateItemNum(item.getID(), -item.getNum(false), p)
    }


    getNum(itemID: number) {
        if (itemID > 0) {
            let type = Math.floor(itemID / 1000)
            // console.log('itemID ', itemID, ' type ', type)
            switch (type) {
                case ItemType.TOKEN:

                case ItemType.GOLD:
                case ItemType.KEY:

                case ItemType.EXP:
                case ItemType.ENERGY:
                    return ItemMgr.instance().getCount(itemID)
                case ItemType.FOOD:

                    break;

            }
        }
        return 0;
    }

    updateItemNum(itemID: number, num: number = 1, p?: cc.Vec2, obj?: cc.Sprite) {
        if (itemID > 1000) {
            let type = Math.floor(itemID / 1000)
            // console.warn('itemID ', itemID, ' type ', type, ' num ', num)
            switch (type) {
                case ItemType.TOKEN:

                    ItemMgr.instance().updateCount(itemID, num, p, obj)
                    if (num < 0) {
                        DailyTaskMgr.instance().updateTaskCount(DailyTaskID.BUY, Math.abs(num))
                    }
                    break;
                case ItemType.GOLD:

                    ItemMgr.instance().updateCount(itemID, num, p, obj)
                    if (num > 0) {
                        DailyTaskMgr.instance().updateTaskCount(DailyTaskID.GOLD, num)
                    }
                    break;
                case ItemType.FOOD:
                    if (num == 0) {
                        num = 1;
                    }
                    // console.warn(' BagManager num ', num)
                    for (let index = 0; index < num; index++) {
                        GridFoodMgr.instance().addRewardFood(itemID)
                    }
                    break;
                default:
                    ItemMgr.instance().updateCount(itemID, num, p, obj)
                    break;

            }
        }
    }
    isEnough(id: number, value: number) {
        let item: ItemModel = ItemMgr.instance().getItemModel(id)
        return item.getNum() >= value;
    }

    isItemEnough(item: BaseItemModel) {
        return this.isEnough(item.getID(), item.getNum(false))
    }

    isAsyncEnough(id: number, value: number, call: Function) {
        let item: ItemModel = ItemMgr.instance().getItemModel(id)
        let flag = item.getNum() >= value;
        if (id == ItemID.AD) {
            CMgr.helper.showRewardAd(0, (r: number) => {
                call(r)
            })
        } else if (id == ItemID.SHARE) {
            SDKManager.getChannel().showShare(0, (r: number) => {
                call(r)
            })
        }
        else {
            call(flag);
        }
    }
    buyItem(id: number, value: number, func: Function) {
        switch (id) {
            case ItemID.AD:
                CMgr.helper.showRewardAd(0, (r: number) => {
                    if (r) {
                        func()
                    }
                })
                break;
            case ItemID.GOLD:
                let text = LangManager.instance().getLocalString('BUY_GOLD', { num: BUY_GOLD })
                TipC.instance().intoLayer(text, (r: number) => {
                    if (r) {
                        CMgr.helper.showRewardAd(0, (s: number) => {
                            if (s) {
                                let size = cc.view.getVisibleSize();
                                BagManager.instance().updateItemNum(ItemID.GOLD, BUY_GOLD, cc.v2(size.width / 2, size.height / 2))
                                // func()
                            }
                        })
                    }
                }, true)
                break;
        }
    }
    // buyItem(itemID: number) {
    //     switch (itemID) {
    //         case ItemID.GOLD:
    //             let text = LangManager.instance().getLocalString('BUY_GOLD', { num: BUY_GOLD })
    //             TipC.instance().intoLayer(text, (r: number) => {
    //                 if (r) {
    //                     SDKManager.getChannel().showRewardAd(0, (s: number) => {
    //                         if (s) {
    //                             BagManager.instance().updateItemNum(ItemID.GOLD, BUY_GOLD, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2))
    //                             // func()
    //                         }
    //                     })
    //                 }
    //             }, true)
    //             break;
    //     }
    // }
}