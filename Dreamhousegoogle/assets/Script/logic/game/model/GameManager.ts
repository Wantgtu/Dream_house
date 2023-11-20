import { BaseModel } from "../../../cfw/model";
import FoodMgr from "./FoodMgr";
import GridFoodMgr from "./GridFoodMgr";
import GridFoodItemModel from "./GridFoodItemModel";


export default class GameManager extends BaseModel {


    constructor() {
        super();
        FoodMgr.instance();
        this.init();
    }

    init() {
       
        GridFoodMgr.instance().init();
    }

    getGridItemModelList() {
        return FoodMgr.instance().getGridItemModelList();
    }

    addNewFood(foodID: number) {
        return GridFoodMgr.instance().addNewFood(foodID)
    }

    getNextModel(food: GridFoodItemModel) {
        return GridFoodMgr.instance().getNextModel(food)
    }

    addToStorage(food: GridFoodItemModel) {
        return GridFoodMgr.instance().addToStorage(food)
    }
}