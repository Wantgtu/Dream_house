import { BaseView } from "../../../cfw/view";
import BuyItemView from "./BuyItemView";
import BuyMgr from "../model/BuyMgr";
import BuyItemModel from "../model/BuyItemModel";
import { CCPoolManager } from "../../../cocos/ccpool";
import { GEvent } from "../../../cfw/event";
import { EventName, FoodHasState, SoundID, FRAME_DURATION } from "../../../config/Config";
import { GameView } from "../../game/view/GameView";
import GridFoodMgr from "../../game/model/GridFoodMgr";
import BuyPropView from "./BuyPropView";
import { LocalList } from "../../../cfw/local";
import GridFoodItemModel from "../../game/model/GridFoodItemModel";
import TaskMgr from "../../task/model/TaskMgr";
import { ItemState } from "../../../cfw/model";
import FoodItemView from "../../game/view/FoodItemView";
import BuyFoodItemView from "./BuyFoodItemView";
import BuyTaskItemView from "./BuyTaskItemView";
import SoundMgr from "../../sound/model/SoundMgr";
import BuyPerson from "../model/BuyPerson";
import { SplitFrameLoader, TimeManager } from "../../../cfw/time";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyView extends BaseView {

    // @property(cc.ScrollView)
    // ScrollView: cc.ScrollView = null;


    @property(cc.Prefab)
    buyItemPrefab: cc.Prefab = null;



    // @property({ type: cc.Prefab })
    // buyPropPrefab: cc.Prefab = null;


    // @property({ type: cc.Prefab })
    // buyTaskPrefab: cc.Prefab = null;

    @property(BuyTaskItemView)
    buyTaskItemView: BuyTaskItemView = null;

    @property(BuyPropView)
    buyPropView: BuyPropView = null;

    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    protected model: BuyMgr;

    protected gameView: GameView;
    protected frameLoader: SplitFrameLoader = new SplitFrameLoader(this.splitFrameInit.bind(this), FRAME_DURATION)
    protected itemList: BuyItemView[] = []
    // protected buyProView: BuyPropView;
    onLoad() {
        this.gameView = this.node.getComponent(GameView)
    }

    start() {
        this.buyPropView.setGameView(this.gameView)
        this.buyTaskItemView.setGameView(this.gameView)
        this.model = BuyMgr.instance();
        this.addPerson()

        let count = GridFoodMgr.instance().getRewardSize();
        // console.log('buyView  start count ', count)
        if (count <= 0) {
            this.buyPropView.setVisible(false)
        }
        // let list = this.model.getBuyList();
        // for (let index = 0; index < list.length; index++) {
        //     const element = list[index];
        //     this.add(element)
        // }
        TimeManager.instance().add(this.frameLoader)
        // this.updateBuyItemList()
        this.gEventProxy.on(EventName.ADD_BUY_ITEM, this.add, this)
        this.gEventProxy.on(EventName.ADD_BUY_PROP, this.addProp, this)

        // this.updateTaskState();
        this.updateBuyItemList()
        this.gEventProxy.on(EventName.CHANGE_FOOD_STATE, this.addPerson, this)
        this.gEventProxy.on(EventName.UPDATE_TASK_STATE, this.newItems, this)
        this.gEventProxy.on(EventName.NEW_BUILD_OPEN, this.newItems, this)
        this.gEventProxy.on(EventName.ADD_BUY_PROP, this.newItems, this)
    }

    newItems() {
        if (this.scrollView) {
            this.scrollView.scrollToLeft(0.2)
        }
    }

    splitFrameInit(index: number) {
        let list = this.model.getBuyList();
        if (list.length <= 0 || index < 0 || index >= list.length) {
            TimeManager.instance().remove(this.frameLoader)
            return;
        }
        const element = list[index];
        this.add(element)
    }

    addPerson() {
        this.model.audoAddPerson(this.gameView.getFoodType())
    }
    onDestroy() {
        super.onDestroy()
        TimeManager.instance().remove(this.frameLoader)
    }





    addBuyView() {

    }

    addProp(model) {
        this.buyPropView.node.active = true;
        // let node = this.ScrollView.content.getChildByName('BuyPropView')
        // // let count = GridFoodMgr.instance().getRewardSize();
        // // console.log('addProp count ', count, node)
        // if (!node) {
        // this.addBuyView();
        // } else {
        //     if (this.buyPropView) {
        this.buyPropView.add(model)
        //     }
        // }
    }

    add(element: BuyPerson) {
        // let node = cc.instantiate(this.buyItemPrefab)
        let node = CCPoolManager.instance().get('BuyItemView', () => {
            return cc.instantiate(this.buyItemPrefab)
        })
        let comp = node.getComponent(BuyItemView)
        if (comp) {
            comp.setGameView(this.gameView)
            comp.setModel(element)
            comp.content()
            comp.updateState()
            this.itemList.push(comp)
            this.layout.node.addChild(node)
            this.updateBuyItemList()
            SoundMgr.instance().playSound(SoundID.sfx_winCashTillAppear)
        }
    }

    remove(item: BuyItemView) {
        let index = this.itemList.indexOf(item)
        if (index >= 0) {
            this.itemList.splice(index, 1)
            // this.ScrollView.content.removeChild(item.node)
        }
    }
    recover() {
        for (let index = 0; index < this.itemList.length; index++) {
            const element = this.itemList[index];
            element.recover()
        }
    }


    updateBuyItemList() {
        let gridList = this.gameView.getGridList();
        let foodMap: { [key: number]: number } = {}
        for (let index = 0; index < this.itemList.length; index++) {
            const element = this.itemList[index];
            element.updateState()
            let list = element.getFoods();
            for (let j = 0; j < list.length; j++) {
                const food: BuyFoodItemView = list[j];
                let foodID = food.getFoodID();
                foodMap[foodID] = 1
            }
        }
        for (let index = 0; index < gridList.length; index++) {
            const element = gridList[index];
            if (element.getState() == ItemState.GOT) {
                let food = element.getFood();
                if (food) {
                    let foodID = food.getFoodID();
                    if (foodMap[foodID]) {
                        if (food.getState() != ItemState.CAN_GET)
                            food.setBgVisible(FoodHasState.HAS)
                    } else {
                        food.setBgVisible(FoodHasState.NONE)
                    }
                    element.setFoodHasState(food.getFoodHasState())
                }
            }

        }
        // console.log(' this.layout.node.children ', this.layout.node.children.length)
        this.layout.node.children.sort((a: cc.Node, b: cc.Node) => {
            let ac = a.getComponent(BuyItemView)
            let bc = b.getComponent(BuyItemView)
            // console.log('bc.isFull()  ac.isFull()  ', bc.isFull(), ac.isFull())
            // console.log('bc.getHasCount()  ac.getHasCount()  ', bc.getHasCount(), ac.getHasCount())
            if (ac.isFull() && bc.isFull()) {
                return 0;
            } else if (ac.isFull()) {
                return -1
            } else if (bc.isFull()) {
                return 1;
            }

            return bc.getHasCount() - ac.getHasCount();
        })
        this.layout['_doLayoutDirty']();
        this.layout.updateLayout()

    }

    // deleteItem(item: BuyItemView) {
    //     let index = this.itemList.indexOf(item)
    //     if (index >= 0) {
    //         this.itemList.splice(index, 1)
    //     }

    // }
    // update (dt) {}
}
