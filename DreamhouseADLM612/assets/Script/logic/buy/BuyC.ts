import { BaseController } from "../../cfw/mvc";
import BuyItemModel from "./model/BuyItemModel";
import BagManager from "../public/bag/BagManager";
import FoodMgr from "../game/model/FoodMgr";
import BuyMgr from "./model/BuyMgr";
import FoodItemModel from "../game/model/FoodItemModel";
import GameC from "../game/GameC";


export default class BuyC extends BaseController {

    intoLayer() {

    }

    buy(model: BuyItemModel) {


    }

    showFoodInfo(m: FoodItemModel) {
        GameC.instance().showFoodInfo(m)
    }
}