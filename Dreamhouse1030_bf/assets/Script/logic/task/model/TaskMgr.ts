import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import TaskItemModel, { TaskItemModelEnum } from "./TaskItemModel";
import { LocalValue } from "../../../cfw/local";
import { ItemID, EventName, RedTipType, DailyTaskID, ItemType } from "../../../config/Config";
import BagManager from "../../public/bag/BagManager";
import { GEvent } from "../../../cfw/event";
import ItemModel from "../../item/model/ItemModel";
import DailyTaskMgr from "../../dailytask/model/DailyTaskMgr";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
import CMgr from "../../../sdk/channel-ts/CMgr";
import UmengEventID from "../../../config/UmengEventID";
import LevelMgr from "../../level/model/LevelMgr";
import ItemMgr from "../../item/model/ItemMgr";
import TestConfig from "../../../config/TestConfig";
import Debug from "../../../cfw/tools/Debug";
/**
* %SheetName%
**/
export default class TaskMgr extends BaseModel {

	protected taskItemModelMgr: ModelManager<TaskItemModel> = new ModelManager()

	protected taskID: LocalValue;
	initData() {
		this.taskID = new LocalValue('taskID', 1)
		this.taskItemModelMgr.initWithData(ModuleManager.dataManager.get(TaskItemModel.CLASS_NAME), TaskItemModel)
		GEvent.instance().on(EventName.UPDATE_ITEM_NUM_FINISH, this.updateItem, this)
		this.setBuildState()
		this.updateTaskState();
		this.checkPreTask(this.getCurTask())
		if (TestConfig.TASK_TEST) {
			let list = this.getTaskItemModelList();
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				let items = element.getItemList();
				for (let j = 0; j < items.length; j++) {
					const food = items[j];
					if (!food) {
						Debug.warn(' food is null ', element.getID())
					} else {
						if (food.getType() != ItemType.FOOD) {
							// Debug.warn(' food is error ', food.getID())
						}
					}

				}

			}
			// this.taskID.setValue(9)
		}
	}

	getTaskItemModel(id) { return this.taskItemModelMgr.getByID(id) }

	getTaskItemModelList() { return this.taskItemModelMgr.getList() }

	getIndexData(buildID: number) {
		return this.taskItemModelMgr.getIndexData(TaskItemModelEnum.buildID, buildID)
	}

	getTaskIndexData(level: number) {
		return this.taskItemModelMgr.getIndexData(TaskItemModelEnum.level, level)
	}

	updateItem(m: ItemModel) {
		if (m.getID() == ItemID.GOLD) {
			this.updateTaskState();
		}
	}
	getTaskID() {
		return this.taskID.getInt()
	}

	isFinish() {
		let list = this.getTaskItemModelList()
		let lastID = list[list.length - 1].getID();
		return this.getTaskID() > lastID;
	}

	updateTaskID() {
		if (!this.isFinish()) {
			this.taskID.updateValue(1)
			this.setBuildState()
		} else {

		}

	}

	setBuildState() {
		let build = this.getCurBuild();
		if (build) {
			if (build.getState() == ItemState.NOT_GET) {
				build.setState(ItemState.ON_GOING)
			}

		}
		let task = this.getCurTask()
		if (task) {
			if (task.getState() == ItemState.NOT_GET) {
				task.setState(ItemState.ON_GOING)
			}
		}
	}

	//更新任务状态
	updateTaskState() {
		let count = this.taskItemModelMgr.size()
		if (this.getTaskID() < count) {
			let task = this.getTaskItemModel(this.getTaskID())
			if (task) {

				if (BagManager.instance().isEnough(ItemID.GOLD, task.getGold())) {
					if (task.getState() != ItemState.CAN_GET) {
						task.setState(ItemState.CAN_GET)
						DailyTaskMgr.instance().updateTaskCount(DailyTaskID.TASK)
						CMgr.helper.trackEvent(UmengEventID.task, { taskID: task.getID() })
						// task.getBuild().setState(ItemState.CAN_GET)
						// GEvent.instance().emit(EventName.UPDATE_TASK_STATE)

					}
					RedTipMgr.instance().addRedTip(RedTipType.HAS_TASK)
				}

			}
		}
	}


	checkPreTask(task: TaskItemModel) {
		let start = task.getID() - 1
		for (let index = start; index >= 1; index--) {
			let model = this.getTaskItemModel(index)
			let build = model.getBuild();
			if (build && build.isClear()) {
				if (build.getState() == ItemState.NOT_GET || build.getState() == ItemState.ON_GOING) {
					build.setState(ItemState.CAN_GET)
				} else {
					// break;
				}

			}

		}
	}

	hasTask() {
		let m = this.getCurTask()
		return m != null && m != undefined;
	}


	getCurTask() {
		let taskID = this.getTaskID();
		let m = this.getTaskItemModel(taskID)
		return m;
	}

	getCurBuild() {
		let curTask = this.getCurTask();
		if (curTask) {
			return curTask.getBuild();
		}
		return null;
	}

	getOpenCount(buildID: number) {
		let count = 0;
		let list = this.taskItemModelMgr.getIndexData(TaskItemModelEnum.buildID, buildID)
		if (list && list.length > 0) {
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				if (element.getState() == ItemState.GOT) {
					count++;
				}
			}
		}
		return count;
	}

	getTotalCount(buildID: number) {
		let list = this.taskItemModelMgr.getIndexData(TaskItemModelEnum.buildID, buildID)
		if (list && list.length > 0) {
			return list.length;
		}
		return 0;
	}

	getTotalCoin(buildID: number) {
		let temp = 0;
		let list = this.taskItemModelMgr.getIndexData(TaskItemModelEnum.buildID, buildID)
		if (list && list.length > 0) {
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				temp += element.getGold();
			}
		}
		return temp
	}

	addItems(task: TaskItemModel, r: number = 1, pos?: cc.Vec2) {
		if (BagManager.instance().isEnough(ItemID.GOLD, task.getGold())) {
			BagManager.instance().updateItemNum(ItemID.GOLD, -task.getGold())


			// for (let index = 0; index < r; index++) {
			let other = task.getOther();
			// console.warn('addItems ============ 111111 ', other)
			if (other && other.length > 0) {
				let count = Math.floor(other.length / 2);
				for (let index = 0; index < count; index++) {
					const foodID = other[index * 2];
					let num = other[index * 2 + 1]
					BagManager.instance().updateItemNum(foodID, num)
				}
			}
			// }
			// console.log(' addItems id ', task.getID())
			task.setState(ItemState.GOT)

			let exp = task.getExp()
			BagManager.instance().updateItemNum(ItemID.EXP, exp, pos)

			LevelMgr.instance().checkLevel(ItemMgr.instance().getItemModel(ItemID.EXP))
			// console.warn('addItems ============ finish ')
			// this.checkPreTask(task)
			return true;
		} else {
			return false
		}
		// return false
	}

	getRightModel() {
		let list = this.getTaskItemModelList();
		let curID = this.getTaskID();
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.getID() < curID) {
				if (element.getState() == ItemState.CAN_GET) {
					return element;
				}
			} else if (element.getID() == curID) {
				return element
			} else {
				return null;
			}
		}
		return null;
	}
}