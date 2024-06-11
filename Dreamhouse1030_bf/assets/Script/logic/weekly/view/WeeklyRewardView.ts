import { BaseView } from "../../../cfw/view";
import WeeklyMgr from "../model/WeeklyMgr";
import WeeklyC from "../WeeklyC";
import WeeklyItemView from "./WeeklyItemView";
import { WEEKLY_RATIO } from "../../../config/Config";
import UIText from "../../../cocos/lang/UIText";
const { ccclass, property } = cc._decorator;

@ccclass
export default class WeeklyRewardView extends BaseView {

	// @property(cc.Sprite)
	// public bg: cc.Sprite = null;

	@property(cc.Button)
	public normalBtn: cc.Button = null;

	@property(cc.Button)
	public tenBtn: cc.Button = null;


	@property(cc.Prefab)
	public itemPrefab: cc.Prefab = null;

	@property([cc.Layout])
	public box: cc.Layout[] = [];


	@property(cc.Label)
	public dayNum: cc.Label = null;

	@property(cc.Label)
	public tenBtnText: cc.Label = null;

	constructor() { super(); }

	protected model: WeeklyMgr;
	protected controller: WeeklyC;
	onEnter() {
		// this.registerButtonByNode(this.normalBtn, this.onnormalBtnClick)

		// this.registerButtonByNode(this.tenBtn, this.ontenBtnClick)

		this.content();
	}

	content() {
		let list = this.model.getWeeklyItemModelList()
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			let idx = Math.floor(index / 3)
			// console.log('WeeklyRewardView idx  ', idx)
			let node: cc.Node = cc.instantiate(this.itemPrefab)
			let comp: WeeklyItemView = node.getComponent(WeeklyItemView)
			if (comp) {
				comp.setModel(element)
				comp.setController(this.controller)
			}
			this.box[idx].node.addChild(node)
		}
		let day = this.model.getCurDay();
		this.dayNum.string = UIText.instance().getText(32, { num: day.getID() })
		this.tenBtnText.string = UIText.instance().getText(35, { num: WEEKLY_RATIO })
	}

	onEnable(): void {
	}

	onDisable(): void {
	}

	onnormalBtnClick() {
		this.controller.getReward(1)
	}

	ontenBtnClick() {
		this.controller.getReward(WEEKLY_RATIO)
	}



}