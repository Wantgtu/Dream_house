import { BaseItemModel, ItemState } from "../../../cfw/model";
import { LocalValue, LocalMap } from "../../../cfw/local";
import { FoodOutType, DEFAUL_GOLG } from "../../../config/Config";
import FoodItemModel, { FoodItemModelEnum } from "./FoodItemModel";
import FoodMgr from "./FoodMgr";
import { TimeObserver, CountDownTimer, TimeManager, TimeHelper } from "../../../cfw/time";
let FOOD_ID: string = 'foodID'
let TIME: string = 'time'
let OUT_COUNT: string = 'outCount'
let STATE: string = 'state'
export default class GridFoodItemModel extends BaseItemModel {


    protected foodInfo: LocalMap


    protected food: FoodItemModel;
    protected timeObsver: TimeObserver;
    constructor(id: string) {
        super();
        this.setID(id)
        this.foodInfo = new LocalMap('GridFoodItemModel' + id, 0)
        let foodID = this.getFoodID();
        if (foodID > 0) {
            this.setFood()
        }

        if (!this.food) {

            this.setFoodID(DEFAUL_GOLG)
            this.setFood()

        }

    }

    removeSelf() {
        // console.log(' GridFoodItemModel removeSelf')
        this.foodInfo.removeSelf();
    }

    init() {
        let time = this.getTime();
        // console.log(' time =========== ', time, ' this.isTimeFraze() ', this.isTimeFraze())
        if (time > 0 && TimeHelper.leftTime(time) <= 0) {
            // let count = this.getOutCount();
            if (this.isTimeFraze()) {
                this.setOutCount(this.getCfgOutCount())
                this.setState(ItemState.GOT)
                if (this.getOutType() == FoodOutType.NO_OUT) {
                    this.setFoodID(DEFAUL_GOLG)
                    this.setFood()
                }


            }

        } else {
            // this.showMask()
        }
    }

    isCostEnergy() {
        return this.food.isCostEnergy()
    }

    setFood() {
        let foodID = this.getFoodID();
        if (foodID > 0) {
            this.food = FoodMgr.instance().getFoodItemModel(foodID)
        }

    }

    updateFoodState() {
        this.food.updateFoodState();
    }

    getCfgOutCount() {
        return this.getCfgValue(FoodItemModelEnum.outCount)
    }

    getOutType() {
        return this.food.getOutType()
    }

    getOldTime() {
        return this.getCfgValue(FoodItemModelEnum.time)
    }

    getNextID() {
        return this.food.getNextID()
    }

    // hideMask() {
    //     TimeManager.instance().remove(this.timeObsver)
    //     this.emit(EventName.HIDE_CD_TIME)
    // }

    getScale() {
        return this.food.getScale();
    }

    // showMask() {
    //     if (!this.timeObsver) {
    //         this.timeObsver = new CountDownTimer((t: number) => {
    //             let total = this.getOldTime();
    //             // this.mask.progress = t / total;
    //             console.log('t  ', t, ' total ', total)
    //             this.emit(EventName.UPDATE_CD_TIME, t / total)
    //             if (t == 0) {
    //                 this.hideMask()
    //             }
    //             this.setTime(t)
    //         })
    //     }
    //     // console.log(' add timeoberver ', this.getTime())
    //     this.timeObsver.setTime(this.getTime(), false)
    //     TimeManager.instance().add(this.timeObsver)
    //     this.emit(EventName.SHOW_CD_TIME)
    // }


    getName() {
        return this.food.getName()
    }

    getSpriteFrame() {
        return this.food.getSpriteFrame();
    }

    getIcon() {
        return this.food.getIcon()
    }
    getRare() {
        return this.food.getRare();
    }

    isInMarket() {
        return this.food.isInMarket();
    }

    getFType() {
        return this.food.getFType();
    }

    setFoodID(id: number) {
        this.foodInfo.set(FOOD_ID, id)
        if (id > 0) {
            this.food = FoodMgr.instance().getFoodItemModel(id)
            if (this.food) {
                this.setOutCount(this.food.getOutCount())
                this.setTime(this.food.getTime())
            }

        }

    }

    getSellPrice() {
        return this.food.getSellPrice();
    }

    getSplitRandom() {
        return this.food.getSplitRandom();
    }

    // setCDTime() {
    //     this.setTime(this.getCfgValue(FoodItemModelEnum.time))
    // }
    resetOutCount() {
        this.setOutCount(this.getCfgValue(FoodItemModelEnum.outCount))
        // this.setTime(0)
    }

    getLevel() {
        return this.food.getLevel()
    }

    getCfgValue(index: number) {
        return this.food.getCfgValue(index)
    }

    getOpenPrice() {
        let total = this.getOldTime();
        let time = TimeHelper.leftTime(this.getTime()) / 1000
        let percent = 1;
        if (total > 0) {
            percent = time / total
        }
        return Math.ceil(this.food.getOpenPrice() * percent)
    }

    getPrice() {
        return this.food.getPrice();
    }

    isTimeFraze() {

        return this.getState() == ItemState.CAN_GET;


    }

    canOutput() {
        return this.food.canOutput()
    }

    getOutput() {
        return this.food.getOutput()
    }

    isMaxLevel() {
        return this.food.isMaxLevel()
    }



    getFood() {
        return this.food;
    }

    getFoodID() {
        return this.foodInfo.getInt(FOOD_ID)
    }

    getState() {
        return this.foodInfo.getInt(STATE)
    }

    setState(s: number) {
        this.foodInfo.set(STATE, s)
    }



    getTime() {
        return this.foodInfo.get(TIME)
    }

    setTime(n: number) {
        this.foodInfo.set(TIME, n)
    }

    setOutCount(n: number) {
        return this.foodInfo.set(OUT_COUNT, n)
    }

    getOutCount() {
        return this.foodInfo.get(OUT_COUNT)
    }

    getModuleID() {
        return this.food.getModuleID()
    }
}