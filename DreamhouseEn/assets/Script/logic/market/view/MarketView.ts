import { BaseView } from "../../../cfw/view";
import { GEvent } from "../../../cfw/event";
import { EventName } from "../../../config/Config";
import MarketMgr from "../model/MarketMgr";
import MarketC from "../MarketC";
import { TimeObserver, SheduleTimer, TimeHelper, TimeDisplay, TimeManager } from "../../../cfw/time";
import MarketTypeView from "./MarketTypeView";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MarketView extends BaseView {

	@property({ type: cc.Label, displayName: "refreshTokenNumLabel" })
	refreshTokenNumLabel: cc.Label = null;

	@property({ type: cc.Sprite, displayName: "backBtnSprite" })
	backBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "backBtnButton" })
	backBtnButton: cc.Button = null;

	// @property([cc.Prefab])
	// prefabs: cc.Prefab[] = []

	@property([MarketTypeView])
	typeList: MarketTypeView[] = []
	protected model: MarketMgr;
	protected controller: MarketC;
	protected timeObsevers: TimeObserver = new SheduleTimer((t: number) => {
		this.updateTime();
	}, 1)

	updateTime() {
		// let list = this.model.getMarketTypeModelList()
		for (let index = 0; index < this.typeList.length; index++) {
			const element = this.typeList[index];
			if (element.node.active) {
				element.updateTime();
			}



		}
	}

	onLoad() {
		GEvent.instance().emit(EventName.OPEN_MAKET, false)
		TimeManager.instance().add(this.timeObsevers)


	}




	onDestroy() {
		super.onDestroy();
		TimeManager.instance().remove(this.timeObsevers)
		GEvent.instance().emit(EventName.OPEN_MAKET, true)
	}

	onbackBtnButtonClick() {
		this.hide()
		this.controller.back()
	}

	onRefreshButtonClick() {
		this.controller.refreshItem()
	}



}