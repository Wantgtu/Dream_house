import { BaseView } from "../../../cfw/view";
import GridFoodItemModel from "../model/GridFoodItemModel";
import { engine } from "../../../engine/engine";
import SelectFoodItemView from "./SelectFoodItemView";
import FoodMgr from "../model/FoodMgr";
import RadioButtonMgr from "../../../cfw/widget/RadioButtonMgr";
import { EventName } from "../../../config/Config";
import FoodItemModel from "../model/FoodItemModel";
import GameC from "../GameC";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectFoodView extends BaseView {

	@property({ type: cc.Sprite, displayName: "foodIconSprite" })
	foodIconSprite: cc.Sprite = null;

	@property({ type: cc.Layout, displayName: "layoutLayout" })
	layoutLayout: cc.Layout = null;

	@property({ type: cc.Sprite, displayName: "play_smallSprite" })
	play_smallSprite: cc.Sprite = null;



	@property({ type: cc.Sprite, displayName: "backBtnSprite" })
	backBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "backBtnButton" })
	backBtnButton: cc.Button = null;

	@property(cc.Prefab)
	itemPrefab: cc.Prefab = null;


	protected model: GridFoodItemModel;
	protected radioButtonMgr: RadioButtonMgr = new RadioButtonMgr();
	onEnter() {
		this.play_smallSprite.node.active = false;
		let list = this.model.getOutput();
		for (let index = 0; index < list.length; index++) {
			const foodID = list[index];
			let node: cc.Node = engine.instantiate(this.itemPrefab)
			if (node) {
				let item = node.getComponent(SelectFoodItemView)
				if (item) {
					let model = FoodMgr.instance().getFoodItemModel(foodID)
					if (model) {
						item.setModel(model)
						this.layoutLayout.node.addChild(node)
						this.radioButtonMgr.add(item)
					}

				}
			}
		}
		this.gEventProxy.on(EventName.SELECT_FOOD, this.selectFood, this)
		this.setSpriteAtlas(this.foodIconSprite, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
	}

	selectFood(food: SelectFoodItemView) {
		this.radioButtonMgr.setRadioButtonState(food)
		if (!this.play_smallSprite.node.active) {
			this.play_smallSprite.node.active = true;
		}
	}






	onbackBtnButtonClick() {
		this.hide()
	}

	onSelectBtnClick() {
		this.hide()
		GameC.instance().clickSelectOK()
	}

}