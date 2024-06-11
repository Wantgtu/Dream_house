import FoodItemModel from "../../game/model/FoodItemModel";
import MarketMgr from "../../market/model/MarketMgr";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
import { RedTipType } from "../../../config/Config";
import { BaseModel, BaseItemModel } from "../../../cfw/model";
import BuyMgr from "../../buy/model/BuyMgr";
import MarketTypeModel from "../../market/model/MarketTypeModel";


export default class FoodMediator extends BaseModel {
    protected marketFoodMap: { [key: string]: number } = {}
    initData() {
        let array = MarketMgr.instance().getMarketTypeModelList()
        for (let j = 0; j < array.length; j++) {
            let type: MarketTypeModel = array[j];
            let temp = type.getMarketItems();
            for (let i = 0; i < temp.length; i++) {
                const marketItem = temp[i];
                let list = marketItem.getItemList();
            }
        }
    }



    addMarketFoods(foods: BaseItemModel[]) {
        for (let index = 0; index < foods.length; index++) {
            const element = foods[index];
            let foodID = element.getID();
            if (!this.marketFoodMap[foodID]) {
                this.marketFoodMap[foodID] = 0
            }
            this.marketFoodMap[foodID]++;
        }
        this.checkBuyItemList()
    }

    removeMarketFoods(foods: BaseItemModel[]) {
        for (let index = 0; index < foods.length; index++) {
            const element = foods[index];
            let foodID = element.getID();
            if (!this.marketFoodMap[foodID]) {
                this.marketFoodMap[foodID] = 0
            }
            if (this.marketFoodMap[foodID] > 0) {
                this.marketFoodMap[foodID]--;
            }
        }
        this.checkBuyItemList();

    }

    checkBuyItem(foods: FoodItemModel[]) {
        for (let index = 0; index < foods.length; index++) {
            const food = foods[index];
            if (this.marketFoodMap[food.getID()] > 0) {
                RedTipMgr.instance().addRedTip(RedTipType.IN_MARKET, food.getID())
            }
        }

    }

    removeBuyItemList(foods: FoodItemModel[]) {
        for (let index = 0; index < foods.length; index++) {
            const food = foods[index];
            RedTipMgr.instance().removeRedTip(RedTipType.IN_MARKET, food.getID())
        }
    }


    checkBuyItemList() {
        let list = BuyMgr.instance().getBuyList();
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            this.checkBuyItem(element.getItemList())
        }
    }
}