import { LocalMap } from "../../../cfw/local";
import FoodItemModel from "../../game/model/FoodItemModel";
import { BaseItemModel, ItemState, BaseModel } from "../../../cfw/model";
import BagManager from "../../public/bag/BagManager";
import PersonMgr from "../../person/model/PersonMgr";
import BuyMgr from "./BuyMgr";
import { EventName } from "../../../config/Config";
import { GEvent } from "../../../cfw/event";
import FoodMediator from "../../public/mediator/FoodMediator";

let PersonID = 'PersonID'
let Items = 'Items'
let ItemID = 'ItemID'
let State = 'State'
let ItemNum = 'ItemNum'
export default class BuyPerson extends BaseItemModel {

    protected data: LocalMap
    protected id: number = 0;
    protected items: FoodItemModel[] = []
    protected rewardItem: BaseItemModel;
    protected delete: number = 0;
    constructor(id: number) {
        super()
        this.setID(id)
        this.data = new LocalMap('BuyPerson' + id, 0)
    }

    hasData() {
        return this.data.isHaveData()
    }

    // getID() {
    //     return this.id;
    // }

    setPersonID(id: number) {
        this.data.set(PersonID, id)
    }

    setDelete(id: number) {
        this.delete = id;
    }
    getDelete() {
        return this.delete;
    }

    getItems() {
        return this.data.get(Items)
    }

    setItems(list: number[]) {
        this.data.set(Items, list)
    }

    getPersonID() {
        return this.data.get(PersonID)
    }

    setItemID(id: number) {
        this.data.set(ItemID, id)
    }

    setItemNum(num: number) {
        this.data.set(ItemNum, num)
    }

    getItemNum() {
        // console.error()
        return this.data.get(ItemNum);
    }
    getPerson() {
        return PersonMgr.instance().getPersonItemModel(this.getPersonID())
    }
    getItemList() {
        if (this.items.length == 0) {
            let list = this.getItems()
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                let item: any = BagManager.instance().getNewItemModel(element, 1)
                this.items.push(item)
            }
            FoodMediator.instance().checkBuyItem(this.items)

        }
        return this.items;
    }

    getItemID() {
        return this.data.get(ItemID)
    }
    getRewardItem() {
        let id = this.getItemID();
        let num = this.getItemNum();
        if (!this.rewardItem) {
            this.rewardItem = BagManager.instance().getNewItemModel(id, num)
        }
        return this.rewardItem;

    }

    removeSelf() {
        FoodMediator.instance().removeBuyItemList(this.items)

        BuyMgr.instance().remove(this)
        this.data.removeSelf()
        FoodMediator.instance().checkBuyItemList()
    }

    getState() {
        return this.data.get(State)
    }

    setState(s: number) {
        this.data.set(State, s)
        if (s == ItemState.CAN_GET) {
            // console.log(' BUY_ITEM_FULL ')
            GEvent.instance().emit(EventName.BUY_ITEM_FULL, this.getID())
        }
    }

}