import { BaseController } from "../../cfw/mvc";
import LobbyC from "../lobby/LobbyC";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import TaskMgr from "./model/TaskMgr";
import TaskItemModel from "./model/TaskItemModel";
import { ItemState } from "../../cfw/model";
import SDKManager from "../../sdk/sdk/SDKManager";
import BagManager from "../public/bag/BagManager";
import { ItemID, RedTipType } from "../../config/Config";
import RedTipMgr from "../../extention/redtip/RedTipMgr";
import CMgr from "../../sdk/channel-ts/CMgr";

export default class TaskC extends BaseController {


    intoLayer() {
        let m = TaskMgr.instance().getCurTask()
        if (!m) {
            return;
        }

        ViewManager.pushUIView({
            path: 'prefabs/TaskView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            model: m,
            controller: this,
        })
    }

    playGame() {
        LobbyC.instance().intoGame()
    }

    getTaskReward(m: TaskItemModel, r: number = 1, pos: cc.Vec2) {
        if (m.getState() == ItemState.CAN_GET) {
            if (r > 1) {
                CMgr.helper.showRewardAd(0, (s: number) => {
                    if (s) {
                        this.addItems(m, r, pos)
                    }
                })
            } else {
                this.addItems(m, r, pos)
            }
        }
    }

    addItems(task: TaskItemModel, r: number = 1, pos: cc.Vec2) {
        if (TaskMgr.instance().addItems(task, r, pos)) {
            RedTipMgr.instance().removeRedTip(RedTipType.HAS_TASK)
            TaskMgr.instance().updateTaskID()
            TaskMgr.instance().updateTaskState()
        }
        // if (BagManager.instance().isEnough(ItemID.GOLD, task.getGold())) {
        //     BagManager.instance().updateItemNum(ItemID.GOLD, -task.getGold())


        //     for (let index = 0; index < r; index++) {
        //         let other = task.getOther();
        //         if (other && other.length > 0) {
        //             for (let index = 0; index < other.length; index++) {
        //                 const foodID = other[index];
        //                 // FoodMgr.instance().addItem(foodID)
        //                 // GridFoodMgr.instance().addItem(foodID)
        //                 BagManager.instance().updateItemNum(foodID, 1)

        //             }
        //         }
        //     }
        //     task.setState(ItemState.GOT)

        //     let exp = task.getExp()
        //     BagManager.instance().updateItemNum(ItemID.EXP, exp, pos)
        //     RedTipMgr.instance().removeRedTip(RedTipType.HAS_TASK)
        //     TaskMgr.instance().updateTaskID()
        //     TaskMgr.instance().updateTaskState()
        // }

    }
}