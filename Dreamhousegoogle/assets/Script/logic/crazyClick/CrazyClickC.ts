import { BaseController } from "../../cfw/mvc";
import SDKManager from "../../sdk/sdk/SDKManager";
import { ModuleManager } from "../../cfw/module";
import { ModuleID } from "../../config/ModuleConfig";
import ViewManager from "../../cfw/tools/ViewManager";
import { UIIndex } from "../../config/UIConfig";
import UIManager from "../../cfw/ui";
import { LocalValue } from "../../cfw/local";
import User from "../user/User";
import { FREE_EGG_COUNT, EGG_OPEN_LEVEL, EventName, RedTipType, ItemID } from "../../config/Config";
import LevelMgr from "../level/model/LevelMgr";
import { GEvent } from "../../cfw/event";
import RedTipMgr from "../../extention/redtip/RedTipMgr";
import FoodMgr from "../game/model/FoodMgr";
import ItemModel from "../item/model/ItemModel";
import BagManager from "../public/bag/BagManager";
import ItemC from "../item/ItemC";
import { BaseItemModel } from "../../cfw/model";
import CMgr from "../../sdk/channel-ts/CMgr";

// import BaseController from "../../cfw/mvc/BaseController";
// import ModuleManager, { ModuleID } from "../../cfw/module/ModuleManager";
// import SDKManager from "../../sdk/SDKManager";
// import LoadingController from "../loading/LoadingController";
// import LobbyController from "../lobby/LobbyController";
// import UIManager from "../../cfw/ui/UIManager";

export let SPECIAL_COUNT: number = 10;
export default class CrazyClickC extends BaseController {
    static EGG_RESULT: string = 'EGG_RESULT'
    protected dayNum: LocalValue
    protected count: LocalValue;

    protected costItem: BaseItemModel;
    constructor() {
        super();
        this.count = new LocalValue('CrazyClickCMgrcount', 0)
        this.dayNum = new LocalValue('CrazyClickCMgrdayNum', 0)
        if (this.dayNum.getInt() != User.instance().getLoginDayNum()) {
            this.count.setValue(0)
            this.dayNum.setValue(User.instance().getLoginDayNum())
        }
        this.costItem = BagManager.instance().getNewItemModel(ItemID.TOKEN, FREE_EGG_COUNT)
        GEvent.instance().on(EventName.UPDATE_LEVEL, this.udpateLevel, this)
        this.udpateLevel();
    }


    udpateLevel() {
        if (this.isOpen()) {
            RedTipMgr.instance().addRedTip(RedTipType.EGG_OPEN)
        }
    }

    isOpen() {
        return LevelMgr.instance().getLevel() >= EGG_OPEN_LEVEL
    }

    getTip(){
        return EGG_OPEN_LEVEL + '级之后开启';
    }

    getCount() {
        return this.count.getInt();
    }

    updateCount() {
        return this.count.updateValue(1)
    }

    // private static ins: CrazyClickC;

    // static instance() {
    //     if (!this.ins) {
    //         this.ins = new CrazyClickC()
    //     }
    //     return this.ins;
    // }

    static step: number = 0;

    // protected witch: number = 0;



    gotoLayer(func?: Function) {
        this.callback = func;
        // this.witch = w;
        let hasSubPackage = SDKManager.getChannel().hasSubPackage()
        if (hasSubPackage) {
            ModuleManager.loadBundle(ModuleID.CRAZY_CLICK, (r) => {
                if (r) {
                    this.intoLayer()
                }

            })
        } else {
            this.intoLayer()
        }
    }
    protected callback: Function;
    intoLayer() {
        // if (UIManager.instance().hasView('CrazyClickView', UIIndex.STACK)) {
        //     return;
        // }
        ViewManager.pushUIView({
            path: 'prefabs/CrazyClickView',
            moduleID: ModuleID.CRAZY_CLICK,
            uiIndex: UIIndex.STACK,
            controller: this,
            func: () => {

            }
        })
       
    }




    next() {
        // console.log(' this.witch ', this.witch)
        if (this.callback) {
            this.callback();
            this.callback = null;
        }
        // if (this.witch == 0) {
        //     this.gotoLobby()
        // } else {
        // }

    }

    getResult(witch: number) {
        let count = this.getCount();
        if (count % SPECIAL_COUNT == 0) {
            return FoodMgr.instance().getItemByRare(5)
        } else {
            if (witch == 0) {
                return FoodMgr.instance().getItemByRareList([1, 2])
            } else {
                return FoodMgr.instance().getItemByRareList([3, 4])
            }

        }
    }

    getReward(witch: number) {
        if (witch == 0) {
            if (BagManager.instance().isItemEnough(this.costItem)) {
                BagManager.instance().reduceItem(this.costItem)
                GEvent.instance().emit(CrazyClickC.EGG_RESULT, witch)
            } else {
                // ItemC.instance().showBuyEnergyView()
                ItemC.instance().showBuyTokenView(0)
            }
        } else {
            CMgr.helper.showRewardAd(0, (r: number) => {
                if (r) {
                    GEvent.instance().emit(CrazyClickC.EGG_RESULT, witch)
                }
            })
        }

    }
    gotoLobby() {
        // UIManager.instance().clear()
        // let hasSubPackage = SDKManager.getChannel().hasSubPackage()
        // if (hasSubPackage) {
        //     LoadingController.instance().intoLayer(ModuleID.LOBBY, [ModuleID.LOBBY, ModuleID.DECORATION, ModuleID.SMALL_GAME])
        // } else {
        //     LobbyController.instance().intoLayer()
        // }



    }
}
