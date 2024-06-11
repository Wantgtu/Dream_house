import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import SpecialTaskItemModel from "./SpecialTaskItemModel";
import PersonMgr from "../../person/model/PersonMgr";
import { LocalValue } from "../../../cfw/local";
import { GEvent } from "../../../cfw/event";
import { EventName, SPECIAL_TASK_OK, RedTipType } from "../../../config/Config";
import { TimeHelper, TimeObserver, CountDownTimer, TimeManager } from "../../../cfw/time";
import BagManager from "../../public/bag/BagManager";
import SpecialTaskC from "../SpecialTaskC";
import GameEventAdapter from "../../../extention/gevent/GameEventAdapter";
import CMgr from "../../../sdk/channel-ts/CMgr";
import UmengEventID from "../../../config/UmengEventID";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
/**
* %SheetName%
**/

let DAY_NUM = 3 * 24 * 60 * 60 //3 * 24 * 60 * 60;//秒 活动时长
let DIS_DAY_NUM = 24 * 60 * 60//2 * 24 * 60 * 60;活动后间隔时长
let START_NUM = 600//300//300;//进入游戏多长时间开始活动
function getTime(n: number) {
	return n * 1000;
}
export default class SpecialtaskMgr extends BaseModel {

	protected specialTaskItemModelMgr: ModelManager<SpecialTaskItemModel> = new ModelManager()


	protected state: LocalValue;

	protected step: LocalValue;

	protected goldNum: LocalValue;
	protected startTime: LocalValue;

	protected timer: TimeObserver = new CountDownTimer((time: number) => {
		GEvent.instance().emit(EventName.UPDATE_SPECIAL_TASK_TIME, time)
		// console.log('CountDownTimer time ', time)
		if (time == 0) {
			//
			if (this.isOpen()) {
				this.finish();
				this.openView()
			} else {
				this.start();
				this.openView()
			}
		}
		// this.checkUpdateTime();
	}, 1)

	openView() {
		if (!GameEventAdapter.instance().isOpen()) {
			SpecialTaskC.instance().intoLayer()
		}
	}

	// checkUpdateTime() {
	// 	console.log('checkUpdateTime  this.isOpen() ', this.isOpen())
	// 	if (this.isOpen()) {
	// 		if (this.isTimeOver()) {
	// 			this.finish();
	// 		} else {
	// 		}
	// 	} else {
	// 		if (this.isTimeStart()) {
	// 			this.start();
	// 		}
	// 	}
	// }

	checkTime() {
		// console.log('checkTime this.isOpen() ', this.isOpen())
		if (this.isOpen()) {
			if (this.isTimeOver()) {
				this.finish();
			} else {
				this.timer.setTime(this.getEndTime())
				RedTipMgr.instance().addRedTip(RedTipType.SPECIAL_TASK)
			}
		} else {
			if (this.isTimeStart()) {
				this.start();
			} else {
				this.timer.setTime(this.getStartTime())
			}
		}
	}
	initData() {
		this.state = new LocalValue('SpecialtaskMgrState', ItemState.NOT_GET)
		this.step = new LocalValue('SpecialtaskMgrstep', 0)
		this.goldNum = new LocalValue('SpecialtaskMgrGoldNum', 0)
		this.startTime = new LocalValue('SpecialtaskMgrStartTime', 0)
		this.specialTaskItemModelMgr.initWithData(ModuleManager.dataManager.get(SpecialTaskItemModel.CLASS_NAME), SpecialTaskItemModel)
		cc.game.on(cc.game.EVENT_SHOW, this.eventShow, this)
		if (SPECIAL_TASK_OK) {
			if (this.startTime.getInt() == 0) {
				this.startTime.setValue(Date.now() + getTime(START_NUM))
			}
			// console.log('this.getCountDownTime()', this.getCountDownTime())
			this.checkTime();
			// this.timer.setTime(this.getCountDownTime())
			TimeManager.instance().add(this.timer)
		}

	}

	eventShow() {
		console.warn(' eventShow ')
		this.checkTime();
	}

	getStartTime() {
		return this.startTime.getInt();
	}

	getLeftTime() {
		let time = this.getCountDownTime();
		return TimeHelper.leftTime(time) / 1000
	}

	getCountDownTime() {
		let time = 0;

		if (this.isOpen()) {
			time = this.getEndTime();
		} else {
			time = this.getStartTime();
		}
		if (time < 0) {
			// console.error('getCountDownTime time  ', time, this.isOpen())
		}
		// console.log(' getCountDownTime time', time)
		return time;
	}

	private start() {

		console.warn('start begin')
		this.step.setValue(0)
		// console.warn('start888888')
		this.goldNum.setValue(0)
		// console.warn('start2222')


		let list = this.getSpecialTaskItemModelList();
		// console.warn('start999999')
		if (list) {
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				if (element) {
					if (index == list.length - 1) {
						element.setState(ItemState.NOT_GET, false)
					} else {
						element.setState(ItemState.NOT_GET, true)
					}

				} else {
					console.warn('element is null ')
				}
			}
			// console.warn('start7777')
		} else {
			console.warn('  array is null ')
		}

		let curModel = this.getCurModel();
		if (curModel) {
			curModel.setState(ItemState.ON_GOING)
		}

		// console.warn('start3333')
		this.timer.setTime(this.getEndTime())
		// console.warn('start55555')

		this.state.setValue(ItemState.ON_GOING)
		GEvent.instance().emit(EventName.CHANGE_SPECIAL_TASK_STATE)

		RedTipMgr.instance().addRedTip(RedTipType.SPECIAL_TASK)
		console.warn('start end ')
	}
	private finish() {
		console.warn('finish begin ')

		let curTime = Date.now();
		let endTime = this.getEndTime();
		if (curTime >= endTime) {
			this.startTime.setValue(Date.now() + getTime(DIS_DAY_NUM))
		} else {
			this.startTime.setValue(endTime + getTime(DIS_DAY_NUM))
		}
		// console.log(' startTime ', this.getStartTime())
		this.timer.setTime(this.getStartTime())
		this.state.setValue(ItemState.NOT_GET)
		GEvent.instance().emit(EventName.CHANGE_SPECIAL_TASK_STATE)
		RedTipMgr.instance().removeRedTip(RedTipType.SPECIAL_TASK)
		console.warn('finish end ')
	}
	// getTime(n: number) {
	// 	return n * 24 * 60 * 60 * 1000
	// }

	/**
	 * 获得当前进行的模型，总是可以返回正确的模型。
	 */
	getCurModel() {
		let list = this.getSpecialTaskItemModelList();
		let index = this.getStep();
		if (list && list.length > index) {
			console.log(' index ', index, list.length)
			return list[index]
		} else {
			return null;
		}

	}

	getGoldNum() {
		return this.goldNum.getInt();
	}

	getState() {
		return this.state.getInt();
	}

	isOpen() {
		return this.getState() == ItemState.ON_GOING;
	}

	getStep() {
		return this.step.getInt();
	}


	private isMax() {
		let list = this.getSpecialTaskItemModelList();
		return this.getStep() == list.length - 1;
	}

	private isTimeStart() {
		let startTime = this.getStartTime();
		// console.log('isTimeStart startTime ', new Date(startTime))
		let curTime = Date.now();
		// console.log('isTimeStart curTime ', new Date(curTime))
		let disTime = curTime - startTime;
		// console.log('isTimeStart  ', disTime >= 0, curTime, startTime)
		if (disTime >= 0) {
			return true
		}
		return false;
	}

	getEndTime() {
		let startTime = this.startTime.getInt();
		// console.log('getEndTime startTime ', new Date(startTime))
		let dayTime = getTime(DAY_NUM)
		let endTime = startTime + dayTime;
		// console.log('getEndTime endTime ', new Date(endTime))
		// console.log('getEndTime  ', endTime, startTime)
		return endTime;
	}

	private isTimeOver() {
		// let startTime = this.startTime.getInt();
		// let dayTime = getTime(DAY_NUM)
		let endTime = this.getEndTime();
		let curTime = Date.now();
		// console.log('isTimeOver curTime ', new Date(curTime))
		let disTime = curTime - endTime;
		// console.log('isTimeOver endTime ', new Date(endTime))
		// console.log('isTimeOver  ', disTime > dayTime, endTime, curTime, 'disTime', disTime)
		if (disTime > 0) {
			return true
		}
		return false;
	}



	addGold(n: number) {
		if (!SPECIAL_TASK_OK) {
			return
		}
		if (this.isOpen()) {
			this.goldNum.updateValue(n)
			let curModel = this.getCurModel();
			if (this.goldNum.getInt() >= curModel.getGold()) {
				this.goldNum.updateValue(-curModel.getGold())
				curModel.setState(ItemState.CAN_GET)
				let items = curModel.getItemList();
				for (let index = 0; index < items.length; index++) {
					const itemID = items[index];
					BagManager.instance().updateItemNum(itemID, 1)
				}
				CMgr.helper.trackEvent(UmengEventID.specialtask_level, { id: curModel.getID() })
				//展示获得道具
				if (this.isMax()) {
					this.finish();
					//魔女消失
				} else {
					this.step.updateValue(1)
					let curModel = this.getCurModel()
					curModel.setState(ItemState.ON_GOING)
					GEvent.instance().emit(EventName.UPDATE_SPECIAL_TASK_STEP)
				}
				this.openView()

			} else {
				GEvent.instance().emit(EventName.UPDATE_SPECIAL_GOLD_NUM)
			}

		}
	}

	getSpecialTaskItemModel(id) { return this.specialTaskItemModelMgr.getByID(id) }

	getSpecialTaskItemModelList() { return this.specialTaskItemModelMgr.getList() }

	getPerson() {
		return PersonMgr.instance().getPersonItemModel(this.getPersonID())
	}

	getPersonID() {
		return 9;
	}

	getSize() {
		return this.specialTaskItemModelMgr.size();
	}


}