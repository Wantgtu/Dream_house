import { BaseItemView } from "../../../cfw/view";
import { ModuleID } from "../../../config/ModuleConfig";
import { ResItem, ResType } from "../../../cfw/res";
import { ModuleManager } from "../../../cfw/module";
// import MarketItemModel, { MarketItemModelEnum } from "../model/MarketItemModel";
import MarketC from "../MarketC";
import { EventName, ItemID } from "../../../config/Config";
import { BaseItemModel, ItemState } from "../../../cfw/model";
import MarketItemView from "./MarketItemView";
import SDKManager from "../../../sdk/sdk/SDKManager";
import BaseMarketItemModel, { MarketItemModelEnum } from "../model/BaseMarketItemModel";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MarketItemView2 extends MarketItemView {

	@property({ type: cc.Sprite, displayName: "IconSprite" })
	IconSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "lockSprite" })
	lockSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "playBtnSprite" })
	playBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "playBtnButton" })
	playBtnButton: cc.Button = null;

	@property({ type: cc.Sprite, displayName: "costIconSprite" })
	costIconSprite: cc.Sprite = null;

	@property({ type: cc.Label, displayName: "costNumLabel" })
	costNumLabel: cc.Label = null;

	@property({ type: cc.Label, displayName: "leftNumLabel" })
	leftNumLabel: cc.Label = null;

	protected model: BaseMarketItemModel;
	protected controller: MarketC;


	addListener() {
		this.eventProxy.on(EventName.CHANGE_COST_COUNT, this.updateCost, this)
	}

	updateFood() {
		let itemList: BaseItemModel[] = this.model.getItemList()
		let food: BaseItemModel = itemList[0]
		this.leftNumLabel.string = '' + food.getNum(false)
	}




	content() {
		super.content();
		this.setSpriteAtlas(this.IconSprite, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
	}

	updateCount() {

	}

	updateCost() {

		let cost: BaseItemModel = this.model.getCostItem();
		if (cost) {

			// if (cost.getID() == ItemID.SHARE && !SDKManager.getChannel().hasShare()) {
			// 	this.node.active = false
			// 	return
			// }
			let total = this.model.getCfgValue(MarketItemModelEnum.costNum);

			if (cost.getID() == ItemID.SCRATCH_CARD) {
				this.costNumLabel.string = total
			} else {
				let now = this.model.getCostNum()
				let letf = total - now;
				this.costNumLabel.string = letf + '/' + total
			}

			this.setSpriteAtlas(this.costIconSprite, cost.getModuleID(), cost.getIcon(), cost.getSpriteFrame())
		}


	}




	onplayBtnButtonClick() {
		let pos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition())
		this.controller.buyItem(this.model, pos)
	}



}