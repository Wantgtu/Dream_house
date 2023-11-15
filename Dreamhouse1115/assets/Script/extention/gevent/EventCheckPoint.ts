import { EventCheckType } from "./GameEventConfig";
import GameEventAdapter from "./GameEventAdapter";
import { BaseView } from "../../cfw/view";
import { EventName, ItemID } from "../../config/Config";
import ItemModel from "../../logic/item/model/ItemModel";
import GridItemModel from "../../logic/game/model/GridItemModel";
import GridFoodItemModel from "../../logic/game/model/GridFoodItemModel";
import BuildItemModel from "../../logic/scene/model/BuildItemModel";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventCheckPoint extends BaseView {

    @property({ type: cc.Enum(EventCheckType) })
    eventType: EventCheckType = EventCheckType.INTO_LAYER;

    @property
    param: string = '';

    @property
    initCheck: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        if (this.initCheck) {
            this.checkEventType(this.param)
        }

        // cc.log('EventCheckPoint ', this.eventType, this.param)
        this.addEvent()
    }

    addEvent() {
        switch (parseInt('' + this.eventType)) {
            case EventCheckType.BUILD:
                this.gEventProxy.on(EventName.NEW_BUILD_OPEN, this.newBuild, this)
                break;
            case EventCheckType.TASK:
                this.gEventProxy.on(EventName.TASK_OPEN, this.checkEventType, this)
                break;
            case EventCheckType.ENERGY:
                this.gEventProxy.on(EventName.UPDATE_ITEM_NUM, this.updateItemNum, this)
                break;
            case EventCheckType.NEW_FOOD:
                this.gEventProxy.on(EventName.ADD_BUY_PROP, this.addNewProp, this)
                break;
            case EventCheckType.MERGE_NEW_FOOD:
                this.gEventProxy.on(EventName.MERGE_NEW_FOOD, this.checkEventType, this)
                break;
            case EventCheckType.FOOD_FULL:
                // cc.log(' on ===========FOOD_FULL=====  ')
                this.gEventProxy.on(EventName.BUY_ITEM_FULL, this.checkEventType, this)
                break;
            case EventCheckType.FOOD_FRAZE:
                this.gEventProxy.on(EventName.FOOD_FRAZE, this.checkEventType, this)
                break;
            case EventCheckType.NEW_FOOD_INTO_CHIKEN:
            case EventCheckType.HAS_30093_NUM:
                this.gEventProxy.on(EventName.ADD_FOOD_BY_GITF, this.checkEventType, this)
                break;
        }
    }

    newBuild(build: BuildItemModel) {
        this.checkEventType(build.getID())
    }

    addNewProp(m: GridFoodItemModel) {
        this.checkEventType(m.getFoodID())
    }

    updateItemNum(m: ItemModel) {
        if (m.getID() == ItemID.ENERGY) {
            this.checkEventType(m.getNum())
        }
    }
    checkEventType(param?: any) {
        // cc.log('  this.eventType ', this.eventType, param)
        GameEventAdapter.instance().checkEvent(this.eventType, param)
    }

    // update (dt) {}
}
