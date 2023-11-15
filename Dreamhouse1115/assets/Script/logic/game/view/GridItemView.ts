


import { BaseItemView } from '../../../cfw/view';

// import FoodItemModel from '../model/FoodItemModel';
import GridItemModel from '../model/GridItemModel';
import FoodItemView from './FoodItemView';
import { ItemState, BaseItemModel } from '../../../cfw/model';
import { FoodHasState } from '../../../config/Config';
import Utils from '../../../cfw/tools/Utils';
import { ModuleID } from '../../../config/ModuleConfig';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = GridItemView
 * DateTime = Mon Nov 29 2021 20:09:25 GMT+0800 (中国标准时间)
 * Author = cgw0827
 * FileBasename = GridItemView.ts
 * FileBasenameNoExtension = GridItemView
 * URL = db://assets/Script/logic/game/view/GridItemView.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass
export class GridItemView extends BaseItemView {
	// [1]
	// dummy = '';

	// [2]
	// @property
	// serializableDummy = 0;
	@property(cc.Node)
	lockBg: cc.Node = null;



	@property(cc.Node)
	icon: cc.Node = null;

	@property(cc.Node)
	stone: cc.Node = null;


	@property(cc.Node)
	diertyBg: cc.Node = null;

	// @property(cc.Sprite)
	// dierty: cc.Sprite = null;


	// @property({ type: cc.Prefab })
	// foodPrefab: cc.Prefab = null;


	@property(cc.Label)
	idLabel: cc.Label = null;

	isSelect: boolean = false;


	@property(cc.Node)
	green1: cc.Node = null;

	@property(cc.Node)
	green2: cc.Node = null;


	protected model: GridItemModel;

	protected food: FoodItemView;
	protected pos: cc.Vec2 = cc.v2()


	getPos() {
		return this.pos;
	}

	setFoodHasState(s: FoodHasState) {
		switch (s) {
			case FoodHasState.NONE:
				this.green1.opacity = 0;
				this.green2.opacity = 0;
				break;
			case FoodHasState.HAS:
				this.green1.opacity = 255;
				this.green2.opacity = 0;
				break;
			case FoodHasState.FULL:
				this.green1.opacity = 0;
				this.green2.opacity = 255;
				break;
		}
	}
	setOpen() {
		if (this.model.getState() == ItemState.CAN_GET) {
			this.model.setState(ItemState.GOT)
			this.updateState()
		}

	}

	// isOpen() {
	// 	return this.model.getState() == ItemState.GOT;
	// }

	isNotOpen() {
		return this.model.getState() == ItemState.NOT_GET;
	}

	isCanOpen() {
		return this.model.getState() == ItemState.CAN_GET
	}

	setCanOpen() {
		if (this.model.getState() == ItemState.NOT_GET) {
			this.model.setState(ItemState.CAN_GET)
			this.updateState()
		}
	}

	getState() {
		return this.model.getState();
	}

	addListener() {
		// this.eventProxy.on(BaseItemModel.UPDATE_STATE, this.updateState, this)
	}



	updateState() {

		if (!this.model) {
			return;
		}
		let s = this.model.getState();
		switch (s) {
			case ItemState.GOT:
				this.stone.active = false;
				this.diertyBg.active = false
				break;
			case ItemState.CAN_GET:
				this.stone.active = true;
				this.diertyBg.active = false
				break;
			case ItemState.NOT_GET:
				this.stone.active = false;
				this.diertyBg.active = true
				break;
		}
		// if (s == ItemState.GOT) {
		// this.stone.active = false;
		// this.diertyBg.active = false
		// } else if (s == ItemState.NOT_GET) {
		// 	this.stone.active = true;
		// 	this.diertyBg.active = true
		// } else if (s == ItemState.CAN_GET) {
		// 	this.stone.active = true;
		// 	this.diertyBg.active = false
		// }

	}
	setPos(id: number) {
		let xi = Math.floor(id % 7)
		let yi = Math.floor(id / 7)
		let x = this.node.width / 2 + xi * this.node.width;
		let y = - this.node.height / 2 - yi * this.node.height
		this.pos = cc.v2(x, y)
	}
	isOpen() {
		// console.log(' this.model.getState() ',this.model.getState())
		return this.model.getState() == ItemState.GOT;
	}

	hasFood() {
		// let food = this.food.getModel();
		return this.food != undefined && this.food != null;
	}

	addFood(f: FoodItemView) {
		if (f) {
			if (f.node.parent != this.icon) {
				f.node.parent = this.icon;
				f.node.x = 0;
				f.node.y = 0;
			}

			// this.food.setModel(f)
			// this.food.content()
		} else {

		}
	}
	setFood(f: FoodItemView, isAdd: boolean = true) {
		if (f) {
			this.model.setFoodKey(f.getID())
			if (f.getState() != ItemState.CAN_GET)
				this.setFoodHasState(f.getFoodHasState())
		} else {
			this.model.setFoodKey(0)
			this.setFoodHasState(FoodHasState.NONE)
		}
		this.food = f;
		if (this.food && isAdd) {
			this.addFood(f)
		}

	}

	recoverFood() {
		if (this.food) {
			this.food.recover()
			this.food = null;
			this.setFoodHasState(FoodHasState.NONE)
		}
	}



	removeFood(recover: boolean = true) {
		this.model.setFoodKey(0)
		if (recover) {
			this.recoverFood()
		}


	}


	startShake() {
		// console.log(' ss  ')
		if (this.food) {
			this.food.shake();
		}
	}

	stopShake() {
		if (this.food) {
			this.food.unShake()
		}

	}


	// removeFood() {
	// 	// 	if (this.food) {
	// 	this.model.setFoodKey(0)
	// 	if (this.food) {
	// 		this.food = null;
	// 	}

	// 	// 		this.food.content();
	// 	// 		// this.food.node.opacity = 0;
	// 	// 		// this.model.setFood(0)
	// 	// 		//这样可以重复利用
	// 	// 	}
	// }

	getFood() {
		return this.food;
	}

	updateFoodState() {
		let model = this.model.getFood()
		if (this.food && model) {
			this.food.setModel(model)
			this.food.content();
		}

	}


	content() {
		this.setFoodHasState(FoodHasState.NONE)
		// this.eventProxy.on(EventName.UPDATE_FOOD_STATE, this.updateFoodState, this)
		this.setPos(this.model.getID())
		this.idLabel.string = this.model.getID();
		this.updateState()

		// let food: FoodItemModel = this.model.getFood();
		// let node = cc.instantiate(this.foodPrefab)
		// let node: cc.Node = CCPoolManager.instance().get('FoodItemView', () => {
		// 	return cc.instantiate(this.foodPrefab)
		// })
		// this.food = node.getComponent(FoodItemView)
		// // this.food.content()
		// this.icon.addChild(node)
		// this.updateFoodState()
	}

	recover() {
		this.recoverFood()
		// CCPoolManager.instance().put(this.node)
		this.node.destroy();
	}

	// update (deltaTime: number) {
	//     // [4]
	// }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
