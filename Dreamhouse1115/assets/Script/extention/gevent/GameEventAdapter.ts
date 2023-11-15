
import EventDelegate from "./model/EventDelegate";
import { EventDispatcher, GEvent } from "../../cfw/event";
import EventManager from "./model/EventManager";
import { GameEventName, EventCheckType, OperateType } from "./GameEventConfig";
import { CompareSign, gameCompare } from "../../cfw/tools/Define";
import UIManager from "../../cfw/ui";
import OperateFactory from "./operate/OperateFactory";
import OperateObserver from "./operate/OperateObserver";
import SceneMgr from "../../logic/scene/model/SceneMgr";
import LevelMgr from "../../logic/level/model/LevelMgr";
import TaskMgr from "../../logic/task/model/TaskMgr";
import TaskItemModel from "../../logic/task/model/TaskItemModel";
import { ItemState } from "../../cfw/model";
import GridFoodMgr from "../../logic/game/model/GridFoodMgr";
import BuyMgr from "../../logic/buy/model/BuyMgr";
import BuildItemModel from "../../logic/scene/model/BuildItemModel";
import ItemMgr from "../../logic/item/model/ItemMgr";
import { ItemID } from "../../config/Config";
import BuyPerson from "../../logic/buy/model/BuyPerson";
import GridFoodItemModel from "../../logic/game/model/GridFoodItemModel";
import FoodMgr from "../../logic/game/model/FoodMgr";

/**
 *由代码触发
 */
export default class GameEventAdapter extends EventDispatcher implements EventDelegate {

    private static ins: GameEventAdapter;
    static instance(): GameEventAdapter {
        if (!this.ins) {
            this.ins = new GameEventAdapter();
        }
        return this.ins;
    }


    private event: EventManager

    constructor() {
        super()
        this.event = new EventManager(this)
        // GuideMgr.instance().on(GuideEventName.FINISH, this.eventFinish, this)
        // GameTipMgr.instance().on(GameTipMgr.NEXT_TIP, this.eventFinish, this)
        // GameTipMgr.instance().on(GameTipMgr.FINISH, this.eventFinish, this)
    }

    getEventManager() {
        return this.event;
    }
    // protected observers: NodeInterface[] = []
    // onRegister(view: NodeInterface) {
    //     let index = this.observers.indexOf(view)
    //     if (index >= 0) {
    //         return
    //     }
    //     this.observers.push(view)
    // }

    getState(id: number) {
        return this.event.getState(id)
    }

    // offRegister(view: NodeInterface) {
    //     let index = this.observers.indexOf(view)
    //     if (index >= 0) {
    //         this.observers.splice(index, 1)
    //     }
    // }
    /**
     * 当事件在进行时切换界面，就需要直接判断是否执行。
     */
    // eventStep() {
    //     if (this.event.isOpen()) {
    //         this.update()
    //     }
    // }
    /**
     * 检查事件
     * @param t 
     * @param value 
     */
    checkEvent(t: EventCheckType, param?: any) {
        // cc.log(' GameEventAdapter checkEvent t ', t, ' param ', param)
        // if (this.event.isOpen()) {
        // this.update();
        // } else {

        this.event.check(t, (type: any, compareSign: CompareSign, value: string) => {
            // cc.log('type ', type, 'compareSign', compareSign, 'vlaue', value)
            let v: any;
            switch (parseInt(type)) {
                case EventCheckType.INTO_LAYER:
                    // v = UIManager.instance().getCurUIName();
                    // cc.log('INTO_LAYER v ===========================  ', param)
                    return gameCompare(param, compareSign, value)
                case EventCheckType.LEVEL_EQULE:
                    v = LevelMgr.instance().getLevel();
                    // cc.log('LEVEL_EQULE v ===========================  ', v)
                    return gameCompare(v, compareSign, value)
                case EventCheckType.GUIDE_NOT_FINISH:
                    v = this.event.getState(value);
                    // cc.log('GUIDE_NOT_EQULE v ===========================  ', v)
                    return gameCompare(v, compareSign, ItemState.NOT_GET)
                case EventCheckType.EVENT_FINISH:
                    v = this.event.getState(value);
                    // cc.log('EVENT_FINISH v ===========================  ', v)
                    return gameCompare(v, compareSign, ItemState.GOT)
                case EventCheckType.LEFT_UI_COUNT:
                    v = UIManager.instance().getOpenUICount();
                    // cc.log('LEFT_UI_COUNT v ===========================  ', v)
                    return gameCompare(v, compareSign, value)
                case EventCheckType.TASK:
                    let task: TaskItemModel = TaskMgr.instance().getTaskItemModel(value)
                    if (task) {
                        v = task.getState();
                    }
                    return gameCompare(v, compareSign, ItemState.CAN_GET)
                case EventCheckType.BUILD:
                    let build: BuildItemModel = SceneMgr.instance().getBuildItemModel(value)
                    if (build) {
                        v = build.getState();
                    }
                    return gameCompare(v, compareSign, ItemState.CAN_GET)
                case EventCheckType.NEW_FOOD:
                    let f: GridFoodItemModel = GridFoodMgr.instance().getFoodByFoodID(value)
                    if (f) {
                        return gameCompare(f.getFoodID(), compareSign, value)
                    }
                    return false
                // cc.log('FOOD_FULL  v ', v, 'value', value)

                case EventCheckType.FOOD_FULL:
                    let person: BuyPerson = BuyMgr.instance().getBuyPerson(value)
                    if (person) {
                        v = person.getState();
                    }
                    // cc.log('FOOD_FULL  ', v, 'value', value)
                    return gameCompare(v, compareSign, ItemState.CAN_GET)
                case EventCheckType.MERGE_NEW_FOOD:
                    // v = GridFoodMgr.instance().getHaveFood(value)
                    return gameCompare(param, compareSign, value)
                case EventCheckType.ENERGY:
                    let m = ItemMgr.instance().getItemModel(ItemID.ENERGY)
                    v = m.getNum();
                    return gameCompare(v, compareSign, value)
                case EventCheckType.FOOD_FRAZE:
                    let food: GridFoodItemModel = FoodMgr.instance().getFoodByFoodType(value)
                    if (food) {
                        v = food.getState();
                        console.log(' state ', v)
                        return gameCompare(v, compareSign, ItemState.CAN_GET)
                    } else {
                        console.log('food is null')
                    }
                    return false;
                case EventCheckType.HAS_30093_NUM:
                    v = FoodMgr.instance().getFoodCountByID(30093)
                    return gameCompare(v, compareSign, value)
                case EventCheckType.NEW_FOOD_INTO_CHIKEN:
                    let f2 = FoodMgr.instance().getFoodByFoodID(value)
                    if (f2) {
                        return true;
                    }
                    return false
                default:
                    return false
            }
            // return false;
        })
        // }

    }

    /**
     * 处理每一步操作，所有操作都是通过事件告知管理器已经结束。
     * 管理器不会自动下一步。
     * 可以添加只能判断进行下一步，例如玩家点击三次都没有跳转。
     */
    update() {
        let item = this.event.getItemModel()
        if (!item) {
            // console.log('update ================= step ')
            return;
        }
        // console.log('update ================= item.getOperateType() ', item.getOperateType(), item.getParam())
        // switch (parseInt(item.getOperateType())) {
        //     case OperateType.OPEN_GUIDE:
        //         GuideMgr.instance().start(item.getParam())
        //         break;
        //     case OperateType.OPEN_TIP:
        //         GameTipMgr.instance().start(item.getParam())
        //         break;
        //     case OperateType.CLOSE_TIP:
        //         GameTipMgr.instance().hide()
        //         break;
        //     case OperateType.IN_VISIBLE:
        //         this.setUIVisible(item.getParam(), false)
        //         break;
        //     case OperateType.VISIBLE:
        //         this.setUIVisible(item.getParam(), true)
        //         break;
        //     default:
        //         this.emit(GameEventName.EVENT_UPDATE)
        //         break;
        // }
        let operate: OperateObserver = OperateFactory.build(item.getOperateType(), this)
        if (operate) {
            operate.start(item.getParam())
        }
        //对于与界面无关的操作可以通过上面的switch操作过滤了。
        // if (item.getIsNext() == 1) {
        // console.log(' GameEventAdapter getIsNext')
        // this.eventFinish(item.getOperateType())
        // }


    }

    guideFinish(guideID: number) {
        // console.log(' GameEventAdapter guideFinish')
        this.eventFinish(OperateType.OPEN_GUIDE, guideID)
    }

    closeTip(tipID: number) {
        this.eventFinish(OperateType.OPEN_TIP, tipID)
    }

    eventFinish(type: OperateType, param?: any) {
        // console.log(' GameEventAdapter eventFinish type ', type, param)
        if (this.event.isOpen()) {
            let item = this.event.getItemModel();
            if (item.getOperateType() == type) {
                // let eventID = this.event.getEventID();
                this.event.next();
                if (!this.event.isOpen()) {
                    // this.emit(GameEventName.EVENT_FINISH)
                    //检查一些因为事件id结束而触发的事件
                    this.checkEvent(EventCheckType.EVENT_FINISH)
                }
            }
        }
    }

    isOpen() {
        return this.event.isOpen()
    }


    setUIVisible(param: string, flag: boolean) {
        if (param.indexOf(':') >= 0) {
            let list = param.split(':')
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                GEvent.instance().emit(GameEventName.EVENT_UI_VISIBLE, element, flag)
            }
        } else {
            GEvent.instance().emit(GameEventName.EVENT_UI_VISIBLE, param, flag)
        }

    }

}