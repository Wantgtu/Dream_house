import { BaseModel } from "../../../cfw/model";
import { TSMap } from "../../../cfw/struct";
import GridFoodItemModel from "./GridFoodItemModel";
import Utils from "../../../cfw/tools/Utils";
import { LocalList } from "../../../cfw/local";
import { EventName, RedTipType, FoodType } from "../../../config/Config";
import StorageMgr from "../../storage/model/StorageMgr";
import { GEvent } from "../../../cfw/event";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
import TestConfig from "../../../config/TestConfig";


export default class GridFoodMgr extends BaseModel {


    protected rewardItems: LocalList

    protected map: TSMap<string, GridFoodItemModel> = new TSMap()


    constructor() {
        super()
        this.rewardItems = new LocalList('rewardItems', 0)

        let count = this.rewardItems.size();
        for (let index = 0; index < count; index++) {
            let id = this.rewardItems.get(index)
            if (id) {
                this.addFood(id)
                let m = this.getFood(id)
                this.notify(m)
            }

        }
        if (TestConfig.CAT_TEST) {
            // this.addRewardFood(30062)
            // this.addRewardFood(30052)
            this.addRewardFood(30228)
        }

        // this.init();
    }
    getFood(key: string) {
        return this.map.get(key)
    }

    init() {
        // console.log(' GridFoodMgr init ', this.map.size())
        this.map.forEach((key, item: GridFoodItemModel) => {
            // console.log(' GridFoodMgr init ', item.getID())
            item.init();
        })
    }

    getNextModel(gridFood: GridFoodItemModel) {
        let food = gridFood.getFood();
        // let foodID = gridFood.getFoodID()
        let nextID = food.getNextID();
        // let food = FoodMgr.instance().getFoodItemModel(nextID)
        if (nextID) {
            let nextModel: GridFoodItemModel = this.getNewFood(nextID)
            if (nextModel) {
                this.setFood(nextModel.getID(), nextModel)
                return nextModel;
            }
        }
        return null;
    }

    getNewFood(foodID: number) {
        if (foodID <= 0) {
            return null;
        }
        let key = this.getKey()
        while (this.map.has(key)) {
            key = this.getKey();
        }
        // console.log('getNewFood foodID ', foodID, ' key == ', key)
        let food = new GridFoodItemModel(key)
        if (foodID > 0) {
            food.setFoodID(foodID)
        }
        return food;
    }

    addNewFood(foodID: number) {
        let food = this.getNewFood(foodID)
        if (!food) {
            // console.error(' food is null')
            return null;
        }
        this.setFood(food.getID(), food)
        return food;
    }

    addFood(key: any) {
        let food = new GridFoodItemModel(key);
        this.setFood(key, food)

        return food;
    }


    getKey() {
        let key: string = Date.now() + '' + Utils.random(0, 99999);
        return key;
    }


    setFood(key: string, food: GridFoodItemModel) {
        this.map.set(key, food)
    }

    deleteFood(key: string) {
        let m = this.map.delete(key)
        if (m) {
            m.removeSelf()
        }
    }

    addRewardFood(foodID: number) {
        let m = this.addNewFood(foodID)
        if (m) {
            this.rewardItems.push(m.getID())
            this.notify(m)
        } else {
            console.warn(' addRewardFood m is null ')
        }
    }

    getFoodByFoodID(foodID: any) {
        let count = this.rewardItems.size();
        for (let index = 0; index < count; index++) {
            let id = this.rewardItems.get(index)
            let m = this.getFood(id)
            if (m && m.getFoodID() == foodID) {
                return m;
            }
        }
        return null;
    }



    getHaveFood(foodID: any) {
        let list = this.map.getArray()
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (foodID == element.getFoodID()) {
                return foodID;
            }
        }
        return -1;
    }

    notify(m: GridFoodItemModel) {
        if (!m) {
            return;
        }
        RedTipMgr.instance().addRedTip(RedTipType.HAS_REWARD)
        GEvent.instance().emit(EventName.ADD_BUY_PROP, m)
        // GameEventAdapter.instance().checkEvent(EventCheckType.NEW_FOOD, m.getFoodID())
    }

    deleteRewardFood(key: string) {
        this.rewardItems.delete(key)
        // this.deleteFood(key)
        if (this.rewardItems.size() <= 0) {
            RedTipMgr.instance().removeRedTip(RedTipType.HAS_REWARD)
        }
    }

    getRewardList() {
        return this.rewardItems;
    }

    getRewardSize() {
        return this.rewardItems.size();
    }

    getRewardFood() {
        if (this.rewardItems.size() > 0) {
            let m = this.rewardItems.get(0)
            this.deleteRewardFood(m)
            return m;
        }
        return null;

    }

    addToStorage(food: GridFoodItemModel) {
        let flag = StorageMgr.instance().addToStorage(food)
        return flag;
    }
}