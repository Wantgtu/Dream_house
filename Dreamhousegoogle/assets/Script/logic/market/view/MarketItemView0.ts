import { BaseItemView } from "../../../cfw/view";
import MarketItemModel from "../model/MarketItemModel";
import { BaseItemModel } from "../../../cfw/model";
import { ModuleID } from "../../../config/ModuleConfig";
import { ResType, ResItem } from "../../../cfw/res";
import { ModuleManager } from "../../../cfw/module";
import MarketC from "../MarketC";
import { EventName } from "../../../config/Config";
import MarketItemView from "./MarketItemView";
import GameC from "../../game/GameC";
import FoodItemModel from "../../game/model/FoodItemModel";
import GuidePoint from "../../../extention/guide/GuidePoint";
import GuideMgr from "../../../extention/guide/GuideMgr";
import UIText from "../../../cocos/lang/UIText";
import RedTipPoint from "../../../extention/redtip/RedTipPoint";
import Debug from "../../../cfw/tools/Debug";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MarketItemView0 extends MarketItemView {

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

	@property({ type: cc.Sprite, displayName: "tipBtnSprite" })
	tipBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "tipBtnButton" })
	tipBtnButton: cc.Button = null;

	@property(GuidePoint)
	gPoint: GuidePoint = null;

	@property(cc.Node)
	tipPoint: cc.Node = null;

	protected model: MarketItemModel;
	protected controller: MarketC;


	addListener() {
		this.eventProxy.on(EventName.CHANGE_COUNT, this.updateCount, this)
		this.eventProxy.on(EventName.UPDATE_FOOD, this.updateFood, this)
	}



	updateFood() {
		let itemList: BaseItemModel[] = this.model.getItemList()
		let food: BaseItemModel = itemList[0]
		this.setSpriteAtlas(this.IconSprite, food.getModuleID(), food.getIcon(), food.getSpriteFrame())
		let list = this.tipPoint.getComponents(RedTipPoint)
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			element.id = food.getID();
			element.upateState();
		}
		// this.tipPoint.id = food.getID()
		// Debug.log(' updateFood id ', food.getID())

	}

	updateCount() {
		let type = this.model.getType();
		if (type == 0) {
			this.leftNumLabel.node.active = false;
			if (this.model.getID() == this.gPoint.itemID) {
				this.gPoint.init()
			}
		} else {
			this.leftNumLabel.string = UIText.instance().getText(2, { num: this.model.getCount() }) // '剩余:' +;
		}


		if (this.model.getCount() > 0) {
			this.playBtnButton.node.active = true;
			this.lockSprite.node.active = false;
		} else {
			this.playBtnButton.node.active = false;
			this.lockSprite.node.active = true;
		}


	}

	updateCost() {
		let cost: BaseItemModel = this.model.getCostItem();
		if (cost) {
			this.setSpriteAtlas(this.costIconSprite, cost.getModuleID(), cost.getIcon(), cost.getSpriteFrame())
			this.costNumLabel.string = '' + this.model.getNum()
		} else {
			// this.costIconSprite.spriteFrame = null
			this.costIconSprite.node.active = false
			this.costNumLabel.string = UIText.instance().getText(1) //'免费'
		}
	}





	onplayBtnButtonClick() {
		GuideMgr.instance().notify('onplayBtnClick')
		let pos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition())
		this.controller.buyItem(this.model, pos)
	}

	ontipBtnButtonClick() {
		let list = this.model.getItemList();
		let item = list[list.length - 1]
		GameC.instance().showFoodInfo(item as FoodItemModel)
	}



}