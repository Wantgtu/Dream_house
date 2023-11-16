import { BaseView } from "../../../cfw/view";
import FoodMgr from "../model/FoodMgr";
import FoodItemModel from "../model/FoodItemModel";
import FoodInfoItemView from "./FoodInfoItemView";
import { FoodType } from "../../../config/Config";
import UIText from "../../../cocos/lang/UIText";
import { CCPoolManager } from "../../../cocos/ccpool";
const { ccclass, property } = cc._decorator;

@ccclass
export default class FoodInfoView extends BaseView {

	@property({ type: cc.Label, displayName: "titleLabel" })
	titleLabel: cc.Label = null;

	@property({ type: cc.Sprite, displayName: "iconSprite" })
	iconSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "backBtnButton" })
	backBtnButton: cc.Button = null;

	@property({ type: cc.Layout, displayName: "layoutLayout" })
	layoutLayout: cc.Layout = null;


	@property(cc.Prefab)
	itemPrefab: cc.Prefab = null;


	@property(cc.Node)
	content1: cc.Node = null;

	@property(cc.Node)
	content2: cc.Node = null;

	@property({ type: cc.Label, displayName: "titleLabel2" })
	titleLabel2: cc.Label = null;

	@property({ type: cc.Layout, displayName: "layoutLayout2" })
	layoutLayout2: cc.Layout = null;

	@property(cc.Node)
	content3: cc.Node = null;

	@property({ type: cc.Label, displayName: "titleLabel3" })
	titleLabel3: cc.Label = null;

	@property({ type: cc.Layout, displayName: "layoutLayout3" })
	layoutLayout3: cc.Layout = null;



	@property(cc.Node)
	content4: cc.Node = null;

	@property({ type: cc.Label, displayName: "titleLabel4" })
	titleLabel4: cc.Label = null;


	@property(cc.Node)
	market: cc.Node = null;

	protected model: FoodItemModel;

	protected items: FoodInfoItemView[] = []

	onLoad() {
		if (!this.model || typeof (this.model.getLevel) != 'function') {
			return;
		}
		this.titleLabel.string = this.model.getName() + UIText.instance().getText(19, { num: this.model.getLevel(), rare: this.model.getRare() + 1 })
		this.setSpriteAtlas(this.iconSprite, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
		this.iconSprite.node.scale = this.model.getScale() * 1.5;

		let type = this.model.getFType();
		switch (type) {
			case FoodType.shop_gift:
				this.addShopGift(type)
				break;
			default:
				this.addFood(type)
				break;
		}

	}

	addShopGift(type: number) {
		let outList = this.model.getOutput();
		if (outList && outList.length > 0) {
			let list = FoodMgr.instance().getOutFood(this.model)
			this.content2.active = false;
			this.content3.active = false;
			this.content4.active = true
			this.market.active = false
			this.titleLabel4.string = '' + this.model.getOutCount();
			this.addList(this.layoutLayout, list, false, true)
		}

	}

	addFood(type: number) {
		//加载升级路线道具
		let flist = FoodMgr.instance().getFoodIndexData(type)
		if (flist.length > 0) {
			this.addList(this.layoutLayout, flist, true)
		} else {
			this.content1.active = false;
		}

		// if (this.model.isInMarket()) {
		this.market.active = true
		// } else {
		// 	this.market.active = false
		// }

		//加载当前输出道具
		let foutList = this.model.getOutput();
		if (foutList && foutList.length > 0) {
			let slist = FoodMgr.instance().getOutFood(this.model)
			if (slist.length > 0) {
				this.addList(this.layoutLayout2, slist, false)
				let m = FoodMgr.instance().getFoodItemModel(this.model.getNextID())
				if (m) {
					//下一级产出道具
					let outList = m.getOutput();
					if (outList && outList.length > 0) {
						let tlist = FoodMgr.instance().getOutFood(m)
						if (tlist.length > 0) {
							for (let j = 0; j < slist.length; j++) {
								const element = slist[j];
								let idx = tlist.indexOf(element)
								if (idx >= 0) {
									tlist.splice(idx, 1)
								}
							}
							this.addList(this.layoutLayout3, tlist, false)
						} else {
							this.content2.active = false;
						}
					} else {
						this.content3.active = false;
					}
				} else {
					this.content3.active = false;
				}
			} else {
				this.content2.active = false;
				this.content3.active = false;
			}

		} else {
			this.content2.active = false;
			this.content3.active = false;
		}

	}


	onDestroy() {

	}

	onbackBtnButtonClick() {
		this.recover()
		this.hide();
	}

	recover() {
		for (let index = 0; index < this.items.length; index++) {
			const element = this.items[index];
			element.recover()
		}
		this.items.length = 0;
	}


	addList(layout: cc.Layout, list: FoodItemModel[], select: boolean, percent: boolean = false) {
		// if (list.length > 0) {
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			// let node = cc.instantiate(this.itemPrefab)
			let node = CCPoolManager.instance().get('FoodInfoItemView', () => {
				return cc.instantiate(this.itemPrefab)
			})
			layout.node.addChild(node)
			let comp = node.getComponent(FoodInfoItemView)
			if (comp) {
				this.items.push(comp)
				comp.setModel(element)
				comp.content();
				if (select) {
					if (element.getID() != this.model.getID()) {
						comp.selectSprite.node.active = false;
					} else {
						comp.selectSprite.node.active = true;
					}
				} else {
					comp.selectSprite.node.active = false;
				}

				if (percent) {
					comp.percent.node.active = true;
					// console.log(' element.getNum() ', element.getNum())
					comp.percent.string = '' + element.getNum() + '%'
				} else {
					comp.percent.node.active = false;
				}

			}

		}

		// }
	}


	onplay_smallButtonClick() {
		if (this.controller) {
			this.hide()
			this.controller.openStoreView()
		}
	}
}