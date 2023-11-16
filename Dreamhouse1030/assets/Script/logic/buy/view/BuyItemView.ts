import { BaseItemView } from "../../../cfw/view";
import BuyFoodItemView from "./BuyFoodItemView";
import { BaseItemModel, ItemState } from "../../../cfw/model";
import { ResItem, ResType } from "../../../cfw/res";
import { ModuleManager } from "../../../cfw/module";
import { CCPoolManager } from "../../../cocos/ccpool";
import { GEvent } from "../../../cfw/event";
import { EventName, PropType, SoundID, DailyTaskID, PersonState } from "../../../config/Config";
import { GameView } from "../../game/view/GameView";
import { GridItemView } from "../../game/view/GridItemView";
import GuideMgr from "../../../extention/guide/GuideMgr";
import SoundMgr from "../../sound/model/SoundMgr";
import DailyTaskMgr from "../../dailytask/model/DailyTaskMgr";
import Utils from "../../../cfw/tools/Utils";
import PersonItemView from "../../person/view/PersonItemView";
import BuyPerson from "../model/BuyPerson";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let ts: number[] = [0.1, 0.2, 0.3, 0.15, 0.25]
const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyItemView extends BaseItemView {

    // @property(cc.Sprite)
    // personIcon: cc.Sprite = null;

    @property(cc.Label)
    coinNum: cc.Label = null;

    @property(cc.Prefab)
    foodFrefab: cc.Prefab = null;

    @property(cc.Button)
    goBtn: cc.Button = null;

    @property(cc.Sprite)
    itemIcon: cc.Sprite = null;

    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.Prefab)
    personPrefab: cc.Prefab = null;

    @property(cc.Node)
    personPos: cc.Node = null;

    protected foods: BuyFoodItemView[] = []


    protected model: BuyPerson;

    protected gameView: GameView;



    protected hasCount: number = 0;


    setGameView(gv: GameView) {
        this.gameView = gv;
    }

    protected person: PersonItemView;

    content() {
        let item: BaseItemModel = this.model.getRewardItem();

        this.setSpriteAtlas(this.itemIcon, item.getModuleID(), item.getIcon(), item.getSpriteFrame())
        this.coinNum.string = '+' + item.getNum(false)

        if (!this.person) {
            let node = cc.instantiate(this.personPrefab)
            this.person = node.getComponent(PersonItemView)
            this.personPos.addChild(node)
            this.person.callback = this.animationFinish.bind(this)
        }
        if (this.person) {
            this.person.setModel(this.model.getPerson())
            this.person.content();
        }

        let list = this.model.getItemList();

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            // let node = cc.instantiate(this.foodFrefab)
            let node = CCPoolManager.instance().get('BuyFoodItemView', () => {
                return cc.instantiate(this.foodFrefab)
            })
            let comp = node.getComponent(BuyFoodItemView)
            if (comp) {
                comp.setModel(element)
                comp.content()
                this.foods.push(comp)
            }

            this.layout.node.addChild(node)

        }
        // this.updateState();
        // this.eventProxy.on(BaseItemModel.UPDATE_STATE, this.updateState, this)
    }

    changePersonState(s: PersonState) {
        if (this.person) {
            this.person.changeState(s)
        }
    }

    getDuration() {
        if (this.person) {
            return this.person.getDuration()
        }
        return 0;
    }

    protected animationFinish(s: PersonState) {
        if (s == PersonState.OUT) {
            // this.recover();
        }
    }

    // back(func: Function) {
    //     // this.removeSelf()
    //     cc.tween(this.personIcon.node).to(0.2, { scaleY: 0 }).call(() => {
    //         this.recover();
    //         func()
    //     }).start();
    // }

    getRewardItem() {
        return this.model.getRewardItem()
    }


    hasFood(list: GridItemView[], foodID: number, count: number) {
        let n = 0;
        for (let index = 0; index < list.length; index++) {
            const grid = list[index];
            if (grid.getState() == ItemState.GOT) {
                let food = grid.getFood()
                if (food && food.getState() != ItemState.CAN_GET) {
                    let f = food.getFoodID();
                    // console.log(' ffffffffffffffffff ', f)
                    if (f == foodID) {
                        // food.setBgVisible(true)
                        n++;
                        // element.show
                        if (n - count > 0) {
                            // list.splice(index, 1)
                            return true;
                        }

                    }
                }
            }


        }
        return false;
    }

    isFull() {
        return this.hasCount >= this.foods.length;
    }

    getHasCount() {
        return this.hasCount;
    }

    updateState() {
        let gridList = this.gameView.getGridList();
        // console.log(' gridList ', gridList)
        let list = this.foods
        let count = 0;
        let temp: number[] = []
        // let foodMap: { [key: number]: number } = {}
        // console.log(' list.length ', list.length)
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            let foodID = element.getID();
            if (temp[foodID] == undefined) {
                temp[foodID] = 0;
            }
            let flag = this.hasFood(gridList, foodID, temp[foodID])
            // console.log('updateState flag ', flag)
            if (flag) {
                temp[foodID]++;
                count++;
                element.setBgVisible(true)
                // element.setState(ItemState.GOT)
            } else {
                element.setBgVisible(false)
                // element.setState(ItemState.NOT_GET)
            }
        }

        this.hasCount = count;
        if (count >= list.length) {
            if (!this.goBtn.node.active) {
                this.goBtn.node.active = true;
                this.model.setState(ItemState.CAN_GET)
                this.changePersonState(PersonState.TIP)
                // GameEventAdapter.instance().checkEvent(EventCheckType.FOOD_FULL)
                SoundMgr.instance().playSound(SoundID.sfx_greenTick)

            }

        } else {
            if (this.goBtn.node.active) {
                this.goBtn.node.active = false;
                this.model.setState(ItemState.ON_GOING)
            }

        }

        // if (this.model.getState() == ItemState.GOT) {

        // } else {

        // }
    }

    onGoButtonClick() {
        //buy delete 
        // food delete 
        // item add 
        this.model.setState(ItemState.GOT)
        GuideMgr.instance().notify('onBuyItemClick')
        DailyTaskMgr.instance().updateTaskCount(DailyTaskID.ONE)
        GEvent.instance().emit(EventName.DELETE_BUY_ITEM, this)
        let deleteType = this.model.getDelete();
        if (deleteType > 0) {
            this.gameView.deleteGridFoodByFoodID(deleteType)
        }
        // BuyC.instance().buy(this.model)

    }

    removeSelf() {
        this.model.removeSelf();
    }

    recover() {

        for (let index = 0; index < this.foods.length; index++) {
            const element = this.foods[index];
            element.recover()
        }
        CCPoolManager.instance().put(this.node)
        this.foods.length = 0;
    }

    getFoods() {
        return this.foods;
    }


    getOrder() {
        return 8
    }
    // update (dt) {}
}
