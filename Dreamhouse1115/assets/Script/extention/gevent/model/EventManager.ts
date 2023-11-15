

import EventDelegate from "./EventDelegate";
import { BaseModel, ItemState } from "../../../cfw/model";
import { TSMap } from "../../../cfw/struct";
import { LocalMap } from "../../../cfw/local";
import { CompareSign, gameCompare } from "../../../cfw/tools/Define";
import EventItemModel from "./EventItemModel";
import EventCheckItemModel from "./EventCheckItemModel";
import GeventMgr from "./GeventMgr";
import { GameEventName } from "../GameEventConfig";




//可以忽略存档的测试方式。
let ignoreList: number[] = []

export default class EventManager extends BaseModel {

    protected event: TSMap<number, EventItemModel> = new TSMap();
    //事件检查表ID，不是事件ID
    //触发的事件ID
    private eventID: number = -1;
    //事件步数
    private step: number = 0;

    private ignoreMap: TSMap<number, number> = new TSMap();
    //需要手动保存的事件列表
    protected saveList: EventCheckItemModel[] = []

    private delegate: EventDelegate;

    constructor(delegate: EventDelegate) {
        super();
        this.delegate = delegate;
        this.init();
    }

    getEventID() {
        return this.eventID;
    }


    init() {
        for (let index = 0; index < ignoreList.length; index++) {
            const element = ignoreList[index];
            this.ignoreMap.set(element, 1)
        }
    }

    getState(id: any) {
        let m = GeventMgr.instance().getEventCheckItemModel(id)
        if (!m) {
            return ItemState.NOT_GET
        }
        return m.getState();
    }


    /**
     * 
     * @param type 
     * @param func 
     */
    check(type: number, func: (type: number, compareSign: CompareSign, value: string) => boolean) {
        // if (this.isOpen()) {
        //     return;
        // }
        let list = GeventMgr.instance().getCheckIndex(type)
        // console.log(' check list count ', list.length)
        if (list) {
            for (let index = 0; index < list.length; index++) {
                const element: EventCheckItemModel = list[index];
                if (!this.isPassed(element.getID()) || this.ignoreMap.has(element.getID())) {
                    //初始条件判断
                    // if (param >= 0) {
                    //     if (!gameCompare(param, element.getCompareType(), element.getData())) {
                    //         continue;
                    //     }
                    // }

                    let result: boolean = true;
                    //附加条件判断
                    let conditionList = element.getConditionList()
                    if (conditionList.length > 0) {
                        for (let j = 0; j < conditionList.length; j++) {
                            const element = conditionList[j];
                            let c = element.split(':')
                            if (!func(parseInt(c[0]), parseInt(c[1]), c[2])) {
                                result = false;
                                break;
                            }

                        }
                    }

                    if (result) {
                        this.start(element)
                        return true;
                    }


                }
            }
        }
        return false;
    }

    isPassed(id: number) {
        return this.getState(id) == ItemState.GOT
    }

    //事件开始
    private start(element: EventCheckItemModel) {

        let eid = element.getID();
        console.warn(' start event eid', eid)
        this.eventID = eid;
        this.step = 0;
        this.delegate.update();
        this.emit(GameEventName.EVENT_START)
    }

    //保存一些不会自动保存的事件
    save() {
        while (this.saveList.length > 0) {
            let item = this.saveList.shift();
            item.setState(ItemState.GOT)
        }
    }


    isOpen() {
        return this.eventID != -1;
    }

    end() {
        // console.log(' EventManager end', this.step)
        this.eventID = -1;
        this.step = 0;
        this.emit(GameEventName.EVENT_END)

    }

    next() {
        // console.log(' EventManager next', this.step)
        let item = this.getItemModel()
        if (item.getSave() == 1) {
            this.finish()
        }
        this.step++;
        let steps = GeventMgr.instance().getEventStep(this.eventID)
        if (this.step >= steps.length) {
            this.end()
        } else {
            this.delegate.update();
        }
    }

    getItemModel() {
        let steps = GeventMgr.instance().getEventStep(this.eventID)
        // let list = this.eventMapList.get(this.eventID)
        let item = steps[this.step]
        return item;
    }

    finish() {
        let item: EventCheckItemModel = GeventMgr.instance().getEventCheckItemModel(this.eventID)
        if (item) {
            item.setState(ItemState.GOT)
        } else {
        }
    }


}