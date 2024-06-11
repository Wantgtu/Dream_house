import { DataModel } from "../../../cfw/cfw";
import FoodItemModel from "../../game/model/FoodItemModel";
import FoodMgr from "../../game/model/FoodMgr";

let rateList: number[][] = [[1, 2, 3, 4], [5]]
export enum BoxPopItemModelEnum {
    state,// 道具ID,数量，权重

}

/**
* 宝箱
**/
export default class BoxPopItemModel extends DataModel {

    static CLASS_NAME: string = 'BoxPopItemModel'

    protected special: number = 0;
    constructor() {
        super(BoxPopItemModel.CLASS_NAME)
    }
    protected item: FoodItemModel = null;
    // 道具ID,数量，权重
    getState() {
        return this.getValue(BoxPopItemModelEnum.state)
    }

    setState(s: number) {
        this.setValue(BoxPopItemModelEnum.state, s)
    }

    setSpecial(n: number) {
        this.special = n;
    }

    reset() {
        this.special = 0;
        this.item = null;
    }

    isSpecial() {
        return this.special == 1;
    }

    setItem() {
        this.item = FoodMgr.instance().getItemByRareList(rateList[this.special])
    }

    getItem() {
        if (!this.item) {
            this.setItem()
        }
        return this.item;

    }



}