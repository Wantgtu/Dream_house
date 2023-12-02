import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import { BaseController } from "../../cfw/mvc";
import BagManager from "../public/bag/BagManager";
import { ItemID, EventName } from "../../config/Config";
import { BundleManager } from "../../cfw/module";
import { ResType } from "../../cfw/res";
import LoadingC from "../public/loading/LoadingC";
import UIManager from "../../cfw/ui";
import ItemC from "../item/ItemC";
import FoodItemModel from "./model/FoodItemModel";
import GameManager from "./model/GameManager";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";
import { EventCheckType } from "../../extention/gevent/GameEventConfig";
import GridFoodItemModel from "./model/GridFoodItemModel";
import { GEvent } from "../../cfw/event";
import SelectFoodItemView from "./view/SelectFoodItemView";
import MarketC from "../market/MarketC";
import { LocalValue } from "../../cfw/local";
import CMgr from "../../sdk/channel-ts/CMgr";
import UmengEventID from "../../config/UmengEventID";
import Debug from "../../cfw/tools/Debug";

export default class GameC extends BaseController {

    intoLayer() {
        let flag = BundleManager.instance().hasBundle(ModuleID.GAME)
        if (flag) {
            this.showView()
        } else {
            LoadingC.instance().addItem(ModuleID.GAME, ResType.AssetBundle, ModuleID.RES, 'Load bundle')
            LoadingC.instance().intoLayer(() => {

                this.showView()
            }, UIIndex.STACK)
        }
        // ItemC.instance().intoLayer()
    }
    protected loading: boolean = false

    setLoading(l: boolean) {
        this.loading = l;
    }
    showView() {
        // if (UIManager.instance().hasView('GameView', UIIndex.STACK)) {
        //     return;
        // }
        // if (this.loading) {
        //     return;
        // }
        // this.setLoading(true)
        ViewManager.pushUIView({
            path: 'prefab/GameView',
            moduleID: ModuleID.GAME,
            uiIndex: UIIndex.STACK,
            controller: this,
            model: new GameManager(),
            func: () => {
                UIManager.instance().popView()
            },
            delayTime:2000,
        })
    }
    protected first_game: LocalValue = new LocalValue('first_game', 0)
    init() {
        if (this.first_game.getInt() == 0) {
            this.first_game.setValue(1)
            CMgr.helper.trackEvent(UmengEventID.first_game)
        }
        // GameEventAdapter.instance().checkEvent(EventCheckType.EVENT_FINISH)
    }

    gotoLobby() {
        // LobbyC.instance().intoLayer()
    }


    showBuyEnergyView() {
        ItemC.instance().showBuyEnergyView()
    }

    clearCDTimeBtnClick(index: number) {


    }


    showFoodInfo(m: FoodItemModel) {
        ViewManager.pushUIView({
            path: 'prefabs/FoodInfoView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            model: m,
            controller: this,
        })
    }

    addBottom(parent: cc.Node, model, callback: Function) {
        ViewManager.pushUIToast({
            path: 'prefabs/GameBottomView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.ROOT,
            model: model,
            controller: this,
            parent: parent,
            func: (comp) => {
                callback(comp)
            }
        })
    }
    openStoreView() {
        MarketC.instance().intoLayer()
    }
    protected gridID: number = 0;
    showSelectFoodView(food: GridFoodItemModel, gridID: number) {
        this.gridID = gridID;
        ViewManager.pushUIView({
            path: 'prefabs/SelectFoodView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            model: food,
            controller: this,
        })
    }
    protected selectFood: FoodItemModel = null;
    clickSelectFood(food: SelectFoodItemView) {
        this.selectFood = food.getModel();
        GEvent.instance().emit(EventName.SELECT_FOOD, food)
    }

    clickSelectOK() {
        if (this.selectFood) {
            BagManager.instance().updateItem(this.selectFood)
            GEvent.instance().emit(EventName.DELETE_GRID_FOOD, this.gridID);
            this.selectFood = null;
        }
    }
}