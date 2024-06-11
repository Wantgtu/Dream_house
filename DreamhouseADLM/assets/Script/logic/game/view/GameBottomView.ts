import { GameView } from "./GameView";
import FoodItemView from "./FoodItemView";
import Utils from "../../../cfw/tools/Utils";
import { ItemState } from "../../../cfw/model";
import { FoodOutType, ItemID, EventName } from "../../../config/Config";
import { GridItemView } from "./GridItemView";
import BagManager from "../../public/bag/BagManager";
import GuideMgr from "../../../extention/guide/GuideMgr";
import ItemC from "../../item/ItemC";
import GameEventAdapter from "../../../extention/gevent/GameEventAdapter";
import StorageC from "../../storage/StorageC";
import GameC from "../GameC";
import { BaseView } from "../../../cfw/view";
import UIText from "../../../cocos/lang/UIText";
import ChangeScale from "../../../cocos/comp/ChangeScale";
import StorageMgr from "../../storage/model/StorageMgr";
import SpecialtaskMgr from "../../specialtask/model/SpecialtaskMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBottomView extends BaseView {

    @property({ type: cc.Label })
    titleLabel: cc.Label = null;

    @property({ type: cc.Label })
    descLabel: cc.Label = null;

    @property({ type: cc.Node })
    deleteNode: cc.Node = null;

    @property({ type: cc.Node })
    sellNode: cc.Node = null;

    @property({ type: cc.Node })
    clearNode: cc.Node = null;

    @property({ type: cc.Label })
    sellLabel: cc.Label = null;
    @property({ type: cc.Label })
    clearLabel: cc.Label = null;
    @property({ type: cc.Node })
    timeIcon: cc.Node = null;

    @property({ type: cc.Node })
    box: cc.Node = null;

    @property({ type: cc.Sprite })
    removeIcon: cc.Sprite = null;

    @property({ type: cc.Node })
    removed: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // protected boxPos: cc.Vec2;

    gameView: GameView;
    protected controller: GameC;
    start() {
        this.titleLabel.node.opacity = 0
        this.descLabel.node.opacity = 0;
        this.deleteNode.active = false;
        this.sellNode.active = false
        this.clearNode.active = false
        this.gEventProxy.on(EventName.CLOSE_GAME_VIEW, this.backBtnClick, this)
        this.removed.active = false;
        // this.boxPos = this.itemView.convertToNodeSpaceAR(this.box.getPosition())
    }

    openAnim() {
        cc.Tween.stopAllByTarget(this.box)
        cc.tween(this.box)
            .call(() => {
                this.box.opacity = 0;
            })
            .delay(0.5)
            .call(() => {
                this.box.opacity = 255;
            })
            .start();
    }


    collideWithBox(food: FoodItemView) {
        let rect: cc.Rect = food.node.getBoundingBoxToWorld()
        let rect2: cc.Rect = this.box.getBoundingBoxToWorld()
        let flag = Utils.isRectCollideAnchor(rect.x, rect.y, rect.width, rect.height, 0.5, 0.5,
            rect2.x, rect2.y, rect2.width, rect2.height, 0.5, 0.5)
        return flag;
    }

    startBoxAnim() {

        let empty = StorageMgr.instance().getEmpty();
        if (!empty) {
            return;
        }
        let scale = this.box.getComponent(ChangeScale)

        if (!scale) {
            this.box.addComponent(ChangeScale)
        } else {
            scale.start();
        }

    }

    stopBoxAnim() {
        let empty = StorageMgr.instance().getEmpty();
        if (!empty) {
            return;
        }
        let scale = this.box.getComponent(ChangeScale)
        if (scale) {
            scale.stop()
        }

    }

    setFoodInfo(grid: GridItemView) {
        this.deleteNode.active = false;
        this.sellNode.active = false
        this.clearNode.active = false
        if (this.removed.active) {
            this.removed.active = false
        }

        if (this.deleteFood) {
            console.log(' removeＳｅｌｆ')
            this.deleteFood.removeSelf();
            this.deleteFood = null;
        }
        if (grid.hasFood()) {
            let food: FoodItemView = grid.getFood();
            this.titleLabel.node.opacity = 255
            this.descLabel.node.opacity = 255;
            let str = food.getFoodName() + UIText.instance().getText(19, { num: food.getLevel(), rare: food.getRare() + 1 })
            this.titleLabel.string = str;
            this.descLabel.string = food.getText();
            if (grid.isOpen()) {
                // let sellPrice = food.getSellPrice();
                // if (sellPrice > 0) {
                // console.warn('setFoodInfo food.getState() ', food.getState())
                let type = food.getOutType();
                switch (parseInt(type)) {
                    case FoodOutType.NO_OUT:
                    case FoodOutType.OUT_RANDOM_COUNT_DESTROY:
                        switch (food.getState()) {
                            case ItemState.NOT_GET:
                            case ItemState.GOT:
                                let sellPrice = food.getSellPrice();
                                if (sellPrice > 0) {
                                    this.sellNode.active = true
                                    this.sellLabel.string = sellPrice;
                                } else {
                                    this.deleteNode.active = true
                                }
                                break;
                            case ItemState.CAN_GET:
                                if (food.getSplitRandom() > 0) {
                                    this.clearNode.active = true
                                    this.timeIcon.active = false;
                                    this.clearLabel.string = '' + food.getOpenPrice();
                                } else {
                                    let sellPrice = food.getSellPrice();
                                    if (sellPrice > 0) {
                                        this.sellNode.active = true
                                        this.sellLabel.string = sellPrice;
                                    } else {
                                        this.deleteNode.active = true
                                    }
                                }
                                break;

                        }

                        break;
                    case FoodOutType.CHOICE_ITEM:
                    case FoodOutType.OUT_COST_ITEM:
                    case FoodOutType.OUT_ITEM_DESTORY:



                        let sellPrice = food.getSellPrice();
                        if (sellPrice > 0) {
                            this.sellNode.active = true
                            this.sellLabel.string = sellPrice;
                        } else {
                            this.deleteNode.active = true
                        }
                        break;
                    case FoodOutType.OUT_ITEM_WITH_OPEN_CD:
                        switch (food.getState()) {
                            case ItemState.NOT_GET:
                                this.clearNode.active = true
                                this.timeIcon.active = true;
                                this.clearLabel.string = food.getOldTime() / 60 + 'm';
                                break;
                            case ItemState.CAN_GET:
                                this.clearNode.active = true
                                this.timeIcon.active = false;
                                this.clearLabel.string = '' + food.getOpenPrice();
                                break;
                            case ItemState.GOT:
                                let sellPrice = food.getSellPrice();
                                if (sellPrice > 0) {
                                    this.sellNode.active = true
                                    this.sellLabel.string = sellPrice;
                                } else {
                                    this.deleteNode.active = true
                                }
                                break;
                        }
                        break;
                    case FoodOutType.OUT_RANDOM_AND_CD:
                        switch (food.getState()) {
                            case ItemState.CAN_GET:
                                this.clearNode.active = true
                                this.timeIcon.active = false;
                                this.clearLabel.string = '' + food.getOpenPrice();
                                this.clearNode
                                this.clearNode.scale = 1;
                                cc.tween(this.clearNode).by(0.2, { scale: 0.1 }).by(0.2, { scale: -0.1 }).start();
                                break;
                            case ItemState.GOT:
                            case ItemState.NOT_GET:
                                //如果没有同类型道具不能删除或出售
                                if (this.gameView.hasOtherFood(food)) {
                                    let sellPrice = food.getSellPrice();
                                    if (sellPrice > 0) {
                                        this.sellNode.active = true
                                        this.sellLabel.string = sellPrice;
                                    } else {
                                        this.deleteNode.active = true
                                    }
                                } else {

                                }

                                break;
                        }
                        break;

                }
            } else {
                this.clearNode.active = false
                this.sellNode.active = false
                this.deleteNode.active = false
            }
            this.gameView.select(true)
        } else {
            this.titleLabel.node.opacity = 0
            this.descLabel.node.opacity = 0;
            this.gameView.select(false)
        }



    }


    sellPriceBtnClick() {
        let grid = this.gameView.getCurGrid();
        if (grid) {
            if (grid.hasFood()) {
                let food: FoodItemView = grid.getFood();
                let price = food.getSellPrice();
                if (price > 0) {
                    let pos = food.node.convertToWorldSpaceAR(food.node.getPosition())
                    BagManager.instance().updateItemNum(ItemID.GOLD, price, pos)
                    // grid.removeFood()
                    grid.removeFood()
                    this.setFoodInfo(grid)
                    food.removeSelf();
                    SpecialtaskMgr.instance().addGold(price)
                    return true;
                    // this.select(false)
                    // this.setFoodInfo(grid)
                }

            }
        }
    }

    clearCDTimeBtnClick() {
        let grid = this.gameView.getCurGrid();
        if (grid) {
            if (grid.hasFood()) {
                let food = grid.getFood()
                if (food.isTimeFraze()) {
                    let token = food.getOpenPrice();
                    // console.log(' token ', token, BagManager.instance().isEnough(ItemID.TOKEN, token))

                    if (token < 0) {
                        token = 0;
                        // console.error(' this is error ', food, food.getModel())
                    }
                    if (GameEventAdapter.instance().isOpen()) {
                        token = 0;
                    }
                    if (BagManager.instance().isEnough(ItemID.TOKEN, token)) {

                        food.setState(ItemState.GOT)
                        food.resetCount();
                        food.updateState();

                        BagManager.instance().updateItemNum(ItemID.TOKEN, -token)
                        GuideMgr.instance().notify('clearCDTime')
                        if (food.getSplitRandom() > 0) {
                            this.gameView.updateGridAndBuyState()
                        }
                        this.setFoodInfo(grid)
                        return true;
                    } else {
                        ItemC.instance().showBuyTokenView(token)
                    }
                } else {
                    // console.log('not isTimeFraze  ')
                    food.setTime()
                    food.setState(ItemState.CAN_GET)
                    food.updateState()
                    GuideMgr.instance().notify('startCDTime')
                    this.setFoodInfo(grid)
                }
            } else {
                // console.log(' not have food ')
            }
        } else {
            // console.log(' not have grid ')
        }
    }

    protected deleteFood: FoodItemView;
    protected deleteGrid: GridItemView;
    deleteFoodBtnClick() {
        let grid = this.gameView.getCurGrid();
        if (grid) {
            // if (this.controller.deleteFoodBtnClick(grid.getModel())) {
            let food = grid.getFood();
            if (food) {

                grid.removeFood();
                this.setFoodInfo(grid)
                this.removed.active = true;
                this.setSpriteAtlas(this.removeIcon, food.getModuleID(), food.getIcon(), food.getSpriteFrame())
                this.deleteGrid = grid;
                this.deleteFood = food;
                this.gameView.updateGridAndBuyState();
            }

            // }
        }
    }

    onStorageBtnClick() {
        StorageC.instance().intoLayer()
    }
    onFoodInfoClick() {
        let grid = this.gameView.getCurGrid();
        if (grid) {
            let food = grid.getFood();
            if (food) {
                this.controller.showFoodInfo(food.getModel().getFood())
                GuideMgr.instance().notify('foodButtonClick')
            }
        }

    }

    backBtnClick() {
        // console.log(' GameBottomView backBtnClick')
        this.gameView.recover()

        this.controller.gotoLobby()
    }
    // update (dt) {}

    onRecoverBtnClick() {
        console.log(' onRecoverBtnClick 1111')
        if (this.deleteGrid && this.deleteFood) {
            this.removed.active = false
            console.log(' onRecoverBtnClick ')
            // this.deleteGrid.setFood(this.deleteFood)
            this.gameView.addRecoverFood(this.deleteGrid, this.deleteFood)
            this.deleteFood = null;
            this.setFoodInfo(this.deleteGrid)
            this.deleteGrid = null;
        }
    }
}
