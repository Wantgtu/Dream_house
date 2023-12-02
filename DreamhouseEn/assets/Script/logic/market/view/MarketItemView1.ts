import { BaseItemView } from "../../../cfw/view";
import { ModuleManager } from "../../../cfw/module";
import { ModuleID } from "../../../config/ModuleConfig";
// import MarketItemModel from "../model/MarketItemModel";
import { ResType, ResItem } from "../../../cfw/res";
import MarketFoodItemView from "./MarketFoodItemView";
import MarketC from "../MarketC";
import { EventName, ItemID } from "../../../config/Config";
import { BaseItemModel } from "../../../cfw/model";
import MarketItemView from "./MarketItemView";
import GameC from "../../game/GameC";
import FoodItemModel from "../../game/model/FoodItemModel";
import BaseMarketItemModel, { MarketItemModelEnum } from "../model/BaseMarketItemModel";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MarketItemView1 extends MarketItemView {

	@property({ type: cc.Sprite, displayName: "iconSprite" })
	iconSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "LayoutSprite" })
	LayoutSprite: cc.Sprite = null;

	@property({ type: cc.Layout, displayName: "LayoutLayout" })
	LayoutLayout: cc.Layout = null;

	@property(cc.Prefab)
	itemPrefab: cc.Prefab = null;

	@property({ type: cc.Sprite, displayName: "lockSprite" })
	lockSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "playBtnSprite" })
	playBtnSprite: cc.Sprite = null;

	@property({ type: cc.Label, displayName: "costNumLabel" })
	costNumLabel: cc.Label = null;

	@property({ type: cc.Label, displayName: "nameLabel" })
	nameLabel: cc.Label = null;

	@property(cc.Sprite)
	costIcon: cc.Sprite = null;
	protected model: BaseMarketItemModel;
	protected controller: MarketC;

	updateFood() {
		let itemList = this.model.getItemList();
		for (let index = 0; index < itemList.length; index++) {
			const element = itemList[index];
			let node = cc.instantiate(this.itemPrefab)
			let comp = node.getComponent(MarketFoodItemView)
			if (comp) {
				comp.setModel(element)
				comp.content();
			}
			this.LayoutLayout.node.addChild(node)
		}
	}

	addListener() {
		this.eventProxy.on(EventName.CHANGE_COUNT, this.updateCount, this)
		this.eventProxy.on(EventName.CHANGE_COST_COUNT, this.updateCost, this)
	}

	content() {
		super.content();
		this.nameLabel.string = this.model.getName()
		this.setSpriteAtlas(this.iconSprite, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
		let cost = this.model.getCostItem();
		if (cost) {
			this.setSpriteAtlas(this.costIcon, cost.getModuleID(), cost.getIcon(), cost.getSpriteFrame())
		}


	}

	updateCount() {
		let count = this.model.getCount();
		if (count == 0) {
			this.lockSprite.node.active = true;
			this.playBtnSprite.node.active = false;
		} else {
			this.lockSprite.node.active = false;
			this.playBtnSprite.node.active = true;
		}
	}

	updateCost() {
		let cost: BaseItemModel = this.model.getCostItem();
		if (cost) {
			let total = this.model.getCfgValue(MarketItemModelEnum.costNum);
			if (cost.getID() == ItemID.SCRATCH_CARD) {
				this.costNumLabel.string = total
			} else {
				let now = this.model.getCostNum()
				let letf = total - now;
				this.costNumLabel.string = letf + '/' + total

			}

		}
	}





	onButtonClick() {
		let pos = null;
		if (this && this.node) {
			pos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition())
		}
		this.controller.buyItem(this.model, pos)
	}


	ontipBtnButtonClick() {
		let list = this.model.getItemList();
		let item = list[list.length - 1]
		GameC.instance().showFoodInfo(item as FoodItemModel)
	}

}