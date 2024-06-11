import { BaseItemView } from "../../../cfw/view";
import StorageItemModel from "../model/StorageItemModel";
import { ItemState, BaseItemModel } from "../../../cfw/model";
import GridFoodItemModel from "../../game/model/GridFoodItemModel";
import { ModuleID } from "../../../config/ModuleConfig";
import { ModuleManager } from "../../../cfw/module";
import { ResType, ResItem } from "../../../cfw/res";
import StorageC from "../StorageC";
import { GEvent } from "../../../cfw/event";
import { EventName } from "../../../config/Config";


const { ccclass, property } = cc._decorator;

@ccclass
export default class StorageItemView extends BaseItemView {

	@property({ type: cc.Sprite, displayName: "iconSprite" })
	iconSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "LockSprite" })
	LockSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "buyBtnSprite" })
	buyBtnSprite: cc.Sprite = null;

	@property({ type: cc.Label, displayName: "numLabel" })
	numLabel: cc.Label = null;



	@property({ type: cc.Button, displayName: "iconButton" })
	iconButton: cc.Button = null;

	@property({ type: cc.Button, displayName: "buyBtnButton" })
	buyBtnButton: cc.Button = null;
	protected model: StorageItemModel;
	protected controller: StorageC;
	onLoad() {

	}

	addListener() {
		this.eventProxy.on(BaseItemModel.UPDATE_STATE, this.content, this)
	}

	content() {
		if (this.model) {
			this.node.active = true;
			let state = this.model.getState();
			this.iconSprite.node.scale = this.model.getScale() * 1.2
			switch (state) {
				case ItemState.GOT:
					this.buyBtnButton.node.active = false;
					this.LockSprite.node.active = false;
					let food: GridFoodItemModel = this.model.getFood()
					if (food) {
						this.setSpriteAtlas(this.iconSprite, food.getModuleID(), food.getIcon(), food.getSpriteFrame())
					} else {
						this.iconSprite.spriteFrame = null;
					}
					break;
				case ItemState.NOT_GET:
					let token = this.model.getToken();
					this.numLabel.string = token;
					this.iconSprite.node.active = false;
					this.LockSprite.node.active = true
					this.buyBtnButton.node.active = true;
					break;
				case ItemState.CAN_GET:
					this.LockSprite.node.active = true;
					this.buyBtnButton.node.active = false;
					this.iconSprite.node.active = false;


					break;
			}
		} else {
			this.node.active = false;
		}

	}



	oniconButtonClick() {
		let food = this.model.getFood();
		if (food) {
			GEvent.instance().emit(EventName.DELETE_STORAGE_ITEM, food, (r: boolean) => {
				if (r) {
					this.model.setFoodID(0)
					this.iconSprite.node.active = false;
				}
			})
		} else {

		}

	}

	onbuyBtnButtonClick() {
		if (this.controller) {
			if (this.model.getState() == ItemState.NOT_GET) {
				this.controller.buyBox(this.model)
			}

		}

	}

}