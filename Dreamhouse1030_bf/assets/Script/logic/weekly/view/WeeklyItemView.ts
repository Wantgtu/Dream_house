import { BaseView } from "../../../cfw/view";
import WeeklyItemModel from "../model/WeeklyItemModel";
import { ItemState } from "../../../cfw/model";
import { EventName } from "../../../config/Config";
import { ModuleID } from "../../../config/ModuleConfig";
import UIText from "../../../cocos/lang/UIText";
import Debug from "../../../cfw/tools/Debug";
const { ccclass, property } = cc._decorator;

@ccclass
export default class WeeklyItemView extends BaseView {

	@property(cc.Label)
	public $Vtitle: cc.Label = null;

	@property(cc.Sprite)
	public $Vicon: cc.Sprite = null;

	@property(cc.Label)
	public $Vnum: cc.Label = null;

	@property(cc.Sprite)
	public $Vmask: cc.Sprite = null;

	@property(cc.Sprite)
	public $Vright: cc.Sprite = null;

	@property([cc.Node])
	bg: cc.Node[] = []


	constructor() { super(); }
	protected model: WeeklyItemModel;
	onEnter() {
		this.content();
		this.eventProxy.on(EventName.UPDATE_WEEKLY_STATE, this.content, this)
	}

	content() {
		this.$Vtitle.string = UIText.instance().getText(32, { num: this.model.getID() })
		let item = this.model.getItem();
		if (item) {
			// this.$Vicon.skin = item.getIcon();
			this.setSpriteAtlas(this.$Vicon, item.getModuleID(), item.getIcon(),item.getSpriteFrame())
			Debug.log('item.getNum(false) ',item.getNum(false))
			this.$Vnum.string = '+' + item.getNum(false)
			this.$Vicon.node.scale = item.getScale();
		}

		let state = this.model.getState();
		if (state == ItemState.GOT) {
			this.$Vright.node.active = true;
			this.$Vmask.node.active = false;
		} else {
			this.$Vright.node.active = false;
			if (this.model.isCurDay()) {
				this.$Vmask.node.active = false;
				this.bg[0].active = true;
				this.bg[1].active = false
			} else {
				if (this.model.isPast()) {
					this.$Vmask.node.active = true;
				} else {
					this.$Vmask.node.active = false;
				}
				this.bg[0].active = false;
				this.bg[1].active = true
			}
		}



	}

	onEnable(): void {
	}

	onDisable(): void {
	}



}