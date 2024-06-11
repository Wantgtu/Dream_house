import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import ActivityItemModel from "./ActivityItemModel";
import { TimeObserver, SheduleTimer, TimeManager, CountDownTimer } from "../../../cfw/time";
import { GEvent } from "../../../cfw/event";
import { EventName, DailyTaskID, RedTipType } from "../../../config/Config";
import DailyTaskMgr from "../../dailytask/model/DailyTaskMgr";
import TipC from "../../public/tip/TipC";
import UIText from "../../../cocos/lang/UIText";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
import ActivityC from "../ActivityC";
import GameEventAdapter from "../../../extention/gevent/GameEventAdapter";
import CMgr from "../../../sdk/channel-ts/CMgr";
/**
* %SheetName%
**/
export default class ActivityMgr extends BaseModel {

	protected activityItemModelMgr: ModelManager<ActivityItemModel> = new ModelManager()
	protected timer: TimeObserver = new CountDownTimer((t) => {

	}, 1)

	protected offlineTimeObserver: TimeObserver = new SheduleTimer(() => {
		let m = this.getActivityItemModel(1)
		if (m && m.getState() != ItemState.CAN_GET) {
			m.reset();
		}
	}, 10)

	protected onlineTimeObserver: TimeObserver = new SheduleTimer(() => {
		ActivityMgr.instance().checkState()
		DailyTaskMgr.instance().updateTaskCount(DailyTaskID.GAME_DA_REN, 5)
	}, 5)
	initData() {
		this.activityItemModelMgr.initWithData(ModuleManager.dataManager.get(ActivityItemModel.CLASS_NAME), ActivityItemModel)
		let m = this.getActivityItemModel(2)
		if (m) {
			m.reset();
		}
		TimeManager.instance().add(this.offlineTimeObserver)
		TimeManager.instance().add(this.onlineTimeObserver)

	}

	getActivityItemModel(id) { return this.activityItemModelMgr.getByID(id) }

	getActivityItemModelList() { return this.activityItemModelMgr.getList() }



	checkState() {
		if (!CMgr.helper.hasOnline()) {
			return;
		}
		let m = this.getActivityItemModel(2)
		if (m) {
			this.timer.setTime(m.getTime())
			// console.log(' this.timer.getTime() ', this.timer.getTime())
			if (m.getState() == ItemState.NOT_GET) {
				if (this.timer.getTime() <= 0) {
					m.setState(ItemState.CAN_GET)
					// RedTipManager.instance().addRedTip(9)
					GEvent.instance().emit(EventName.ONLINE_LIGHT_EFFECT, true)
					RedTipMgr.instance().addRedTip(RedTipType.ONLINE)
					TipC.instance().showToast(UIText.instance().getText('40'))
					cc.tween(this).delay(0.2).call(() => {
						if (!GameEventAdapter.instance().isOpen()) {
							ActivityC.instance().showOnlineView()
						}
					}).start();
				}
			}

		}
	}


}