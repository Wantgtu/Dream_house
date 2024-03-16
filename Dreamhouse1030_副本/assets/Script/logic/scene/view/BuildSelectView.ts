import { BaseView } from "../../../cfw/view";
import BuildItemModel from "../model/BuildItemModel";
import { GEvent } from "../../../cfw/event";
import { EventName, SoundID } from "../../../config/Config";
import SoundMgr from "../../sound/model/SoundMgr";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildSelectView extends BaseView {

	@property({ type: cc.Sprite, displayName: "ButtonCancelSprite" })
	ButtonCancelSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "ButtonCancelButton" })
	ButtonCancelButton: cc.Button = null;

	@property({ type: cc.Sprite, displayName: "ButtonSelectSprite" })
	ButtonSelectSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "ButtonSelectButton" })
	ButtonSelectButton: cc.Button = null;

	@property({ type: cc.Label, displayName: "selectLabelLabel" })
	selectLabelLabel: cc.Label = null;

	@property({ type: cc.Sprite, displayName: "adSprite" })
	adSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "RoomWindowArrow_LSprite" })
	RoomWindowArrow_LSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "RoomWindowArrow_LButton" })
	RoomWindowArrow_LButton: cc.Button = null;

	@property({ type: cc.Sprite, displayName: "RoomWindowArrow_RSprite" })
	RoomWindowArrow_RSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "RoomWindowArrow_RButton" })
	RoomWindowArrow_RButton: cc.Button = null;


	protected model: BuildItemModel;
	protected index: number = 0;
	onLoad() {
		// this.node['_hitTest'] = this.hitTest.bind(this)
		this.index = this.model.getItem();
		this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseDown, this)
		// this.onRoomWindowArrow_RButtonClick();
	}
    hitTest(pos: cc.Vec2) {
		this.hide();
        return false;
    }


	onMouseDown(e: cc.Touch) {

		// let pos = e.getLocation();
		// // console.log(' onMouseDown pos ',pos)
		// let size = cc.view.getVisibleSize()
		// if (pos.x > size.width / 2) {
		// 	this.onRoomWindowArrow_RButtonClick();

		// } else {
		// 	this.onRoomWindowArrow_LButtonClick();
		// }
		this.hide();
	}




	onDestroy() {

	}

	onButtonCancelButtonClick() {
		this.hide()
		GEvent.instance().emit(EventName.CHANGE_BUILD_IMG, this.model, this.model.getItem())
	}

	onButtonSelectButtonClick() {
		this.hide()
		// this.model.setItem(this.index)
		// GEvent.instance().emit(EventName.CHANGE_BUILD_IMG, this.model, this.model.getItem())
	}

	onRoomWindowArrow_LButtonClick() {
		this.index = this.index + 1
		if (this.index > 3) {
			this.index = 0;
		}
		this.model.setItem(this.index)
		GEvent.instance().emit(EventName.CHANGE_BUILD_IMG, this.model, this.index)
		SoundMgr.instance().playSound(SoundID.sfx_buttonPress)
	}

	onRoomWindowArrow_RButtonClick() {
		this.index = this.index - 1
		if (this.index < 0) {
			this.index = 3;
		}
		this.model.setItem(this.index)
		GEvent.instance().emit(EventName.CHANGE_BUILD_IMG, this.model, this.index)
		SoundMgr.instance().playSound(SoundID.sfx_buttonPress)
	}



}