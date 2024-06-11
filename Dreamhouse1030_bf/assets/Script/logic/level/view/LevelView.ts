import { BaseView } from "../../../cfw/view";
import TaskPropItemView from "../../task/view/TaskPropItemView";
import { CCPoolManager } from "../../../cocos/ccpool";
import LevelItemModel from "../model/LevelItemModel";
import LevelC from "../LevelC";


const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelView extends BaseView {





	@property({ type: cc.Sprite, displayName: "LayoutSprite" })
	LayoutSprite: cc.Sprite = null;

	@property({ type: cc.Layout, displayName: "LayoutLayout" })
	LayoutLayout: cc.Layout = null;

	@property({ type: cc.Sprite, displayName: "play_smallSprite" })
	play_smallSprite: cc.Sprite = null;

	// @property({ type: cc.Label, displayName: "costNumLabel" })
	// costNumLabel: cc.Label = null;

	@property({ type: cc.Label, displayName: "levelLabel" })
	levelLabel: cc.Label = null;

	@property(cc.Prefab)
	propItemPrefab: cc.Prefab = null;
	protected items: TaskPropItemView[] = []
	protected model: LevelItemModel;
	protected controller: LevelC;
	onLoad() {

		this.levelLabel.string = this.model.getID();

		let items = this.model.getItemList()
		for (let index = 0; index < items.length; index++) {
			const element = items[index];
			let node = CCPoolManager.instance().get('TaskPropItemView', () => {
				return cc.instantiate(this.propItemPrefab)
			})
			let comp = node.getComponent(TaskPropItemView)
			if (comp) {
				comp.setModel(element)
				comp.content()
				this.items.push(comp)
			}
			this.LayoutLayout.node.addChild(node)

		}
	}




	recover() {
		for (let index = 0; index < this.items.length; index++) {
			const element = this.items[index];
			element.recover()
		}
	}


	onDestroy() {

	}


	onplay_smallButtonClick() {
		this.recover()
		this.hide()
		this.controller.getReward(this.model, 2)
	}

	onNormalButtonClick() {
		this.recover()
		this.hide()
		this.controller.getReward(this.model, 1)
	}


}