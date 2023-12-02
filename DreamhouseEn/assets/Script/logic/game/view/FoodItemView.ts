// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { ModuleManager } from '../../../cfw/module';
import { ResItem, ResType } from '../../../cfw/res';
import { ModuleID } from '../../../config/ModuleConfig';
import { BaseItemView } from "../../../cfw/view";
import { FoodItemModelEnum } from "../model/FoodItemModel";
import { TimeObserver, CountDownTimer, TimeManager } from '../../../cfw/time';
import GridFoodItemModel from '../model/GridFoodItemModel';
import { ItemState, BaseItemModel } from '../../../cfw/model';
import { DEFAUL_GOLG, FoodOutType, FoodHasState } from '../../../config/Config';
import { CCPoolManager } from '../../../cocos/ccpool';
import UIText from '../../../cocos/lang/UIText';
import BagManager from '../../public/bag/BagManager';
const { ccclass, property } = cc._decorator;

@ccclass
export default class FoodItemView extends BaseItemView {

	@property(cc.Sprite)
	icon: cc.Sprite = null;

	@property(cc.Sprite)
	energy: cc.Sprite = null;


	@property(cc.Sprite)
	freeze: cc.Sprite = null;

	@property(cc.Node)
	time: cc.Node = null;

	@property(cc.ProgressBar)
	mask: cc.ProgressBar = null;
	// @property(cc.Node)
	// normalBg: cc.Node = null;

	@property(cc.Sprite)
	star: cc.Sprite = null;

	protected hasType: FoodHasState = FoodHasState.NONE;

	setBgVisible(flag: FoodHasState) {
		this.hasType = flag;
	}

	hasFull() {
		return this.hasType == FoodHasState.HAS || this.hasType == FoodHasState.FULL;
	}

	getSpriteFrame(){
		return this.model.getSpriteFrame()
	}

	getFoodHasState() {
		return this.hasType;
	}

	getModuleID() {
		return this.model.getModuleID();
	}
	getIcon() {
		return this.model.getIcon();
	}

	// hasBuyFood() {
	// 	return this.normalBg.opacity == 255;
	// }
	// LIFE-CYCLE CALLBACKS:

	// onLoad () {}
	protected model: GridFoodItemModel;


	protected timeObsver: TimeObserver = new CountDownTimer(this.timeUpdate.bind(this))
	getID() {
		return this.model.getID();
	}

	getOutCount() {
		return this.model.getOutCount()
	}

	getSellPrice() {
		return this.model.getSellPrice()
	}

	// setCDTime() {
	// 	this.model.setCDTime();
	// }

	getOutType() {
		return this.model.getOutType()
	}

	// clearCDTime() {
	// 	this.model.clearCDTime()
	// 	this.hideMask()
	// }

	getLevel() {
		return this.model.getLevel();
	}

	getRare(){
		return this.model.getRare();
	}

	getOpenPrice() {
		return this.model.getOpenPrice()
	}

	getSplitRandom() {
		return this.model.getSplitRandom()
	}

	getFoodName() {
		return this.model.getName();
	}

	removeSelf() {
		if (this.model) {
			this.model.removeSelf();
		}
	}

	getOldTime() {
		return this.model.getCfgValue(FoodItemModelEnum.time)
	}

	getCfgOutCount() {
		return this.model.getCfgOutCount();
	}

	hasNext() {
		// console.log(' this.model.getNextID() ',this.model.getNextID())
		return this.model.getNextID() > 0
	}

	getFoodID() {
		return this.model.getFoodID()
	}


	// getNextModel() {
	// 	return this.model.getNextModel();
	// }

	isMaxLevel() {
		return this.model.isMaxLevel()
	}

	canDelete() {
		let out: number[] = this.model.getOutput();
		return out.length <= 0
	}

	canOutput() {
		return this.model.canOutput();
	}

	getOutput() {
		return this.model.getOutput();
	}

	isTimeFraze() {
		return this.model.isTimeFraze()
	}

	updateCDTime(progress: number) {
		this.mask.progress = progress;
	}

	addListener() {
		// this.eventProxy.on(EventName.UPDATE_CD_TIME, this.updateCDTime, this)
		// this.eventProxy.on(EventName.SHOW_CD_TIME, this.showMask, this)
		// this.eventProxy.on(EventName.HIDE_CD_TIME, this.hideMask, this)
	}



	getTime() {
		return this.model.getTime();
	}

	setState(s: number) {
		this.model.setState(s)
	}

	isCostEnergy() {
		return this.model.isCostEnergy();
	}

	getState() {
		return this.model.getState();
	}

	shake() {
		cc.tween(this.icon.node).repeatForever(
			cc.tween(this.icon.node).by(0.5, { scale: 0.4 }).by(0.5, { scale: -0.4 })
		).start();
	}

	unShake() {
		this.icon.node.scale = this.model.getScale();
		cc.Tween.stopAllByTarget(this.icon.node)
	}
	content() {
		this.setBgVisible(FoodHasState.NONE)
		if (this.model) {
			this.setSpriteAtlas(this.icon, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
			// console.log('15151515151515')
			let list = this.model.getOutput();
			this.icon.node.scale = this.model.getScale()
			// console.log(' list ', list)
			// console.log(' list.length ', list.length)
			if (list && list.length > 0 && this.getOutType() != FoodOutType.OUT_COST_ITEM) {
				this.energy.node.opacity = 255;
			} else {
				this.energy.node.opacity = 0;
			}
			// console.log('161616161616161')
			if (!this.model.getNextID()) {
				this.star.node.active = true;
			} else {
				this.star.node.active = false;
			}
			// console.log('1414141414141414')
			// console.log('this.isTimeFraze() ', this.isTimeFraze())
			// if (this.isTimeFraze()) {
			// 	this.showMask()
			// } else {
			// 	this.hideMask()
			// }
			this.updateState()
		} else {
			this.icon.spriteFrame = null;
			// console.log(' model is null ')
			this.energy.node.opacity = 0;
			this.time.active = false;
			this.freeze.node.active = false;
			this.star.node.active = false
		}


	}

	getPrice() {
		return this.model.getPrice();
	}

	// hasFood() {

	// }

	click() {
		cc.Tween.stopAllByTarget(this.icon.node)
		this.icon.node.scale = this.model.getScale();
		cc.tween(this.icon.node).by(0.1, { scale: -0.2 }).by(0.1, { scale: 0.2 }).start();
	}

	setOutCount(n: number) {
		this.model.setOutCount(n)
	}

	getFType() {
		return this.model.getFType()
	}

	setTime() {
		let total = this.getOldTime();
		let num = Date.now() + total * 1000;
		this.model.setTime(num)
	}

	showFreeze() {
		this.freeze.node.active = true;

	}

	hideFreeze() {
		this.freeze.node.active = false;
	}


	updateFoodState() {
		this.model.updateFoodState();
	}


	updateState() {
		// console.log('this.getState() ', this.getState(), this.model.getName())
		switch (this.getState()) {
			case ItemState.GOT:
			case ItemState.NOT_GET:
				this.hideMask();
				break;
			case ItemState.CAN_GET:
				this.showMask()
				break;
		}
	}

	resetCount() {
		this.model.resetOutCount()
	}

	private timeUpdate(t: number) {
		let total = this.getOldTime();
		if (total <= 0) {
			return;
		}
		this.mask.progress = (total - t) / total;
		// console.log(' progress ', this.mask.progress, total, t, this.model.getName(), this.model.getFoodID())
		// 
		// this.emit(EventName.UPDATE_CD_TIME, t / total)
		if (t == 0) {
			// console.log('t  ', t, ' total ', total)

			this.model.setState(ItemState.GOT)

			if (this.getOutType() == FoodOutType.NO_OUT) {
				this.model.setFoodID(DEFAUL_GOLG)
				this.model.setFood()
				this.content();
			} else {
				this.resetCount();
				this.updateState()
			}
			this.popAnim();

		}
	}

	private showMask() {
		let total = this.getOldTime();
		if (total <= 0) {
			return;
		}
		// this.setState(ItemState.CAN_GET)
		this.energy.node.active = false;
		this.time.active = true;

		let time = this.model.getTime();
		// console.log('time ', time)
		this.timeObsver.setTime(time, true)
		// console.log(' add timeoberver ', time, this.timeObsver.getTime(), this.model.getName(), this.model.getFoodID())
		TimeManager.instance().add(this.timeObsver)
		let random: number = this.getSplitRandom()
		if (random > 0) {
			this.showFreeze();
		} else {
			this.hideFreeze();
		}

	}

	private hideMask() {
		TimeManager.instance().remove(this.timeObsver)
		this.energy.node.active = true;
		this.time.active = false;
		this.hideFreeze();
	}

	onDestroy() {
		super.onDestroy();
		TimeManager.instance().remove(this.timeObsver)
	}

	timeupdate(time: number) {

	}

	recover() {
		CCPoolManager.instance().put(this.node)
		TimeManager.instance().remove(this.timeObsver)
		// this.node.scale = this.model.getScale();
		cc.Tween.stopAllByTarget(this.icon.node)
		// this.node.destroy();
	}

	popAnim() {
		cc.tween(this.icon.node).by(0.2, { scale: 0.4 }).by(0.2, { scale: -0.4 }).start();
	}


	getText() {
		let text = ''
		if (this.isMaxLevel()) {
			text = UIText.instance().getText(37)
		} else {
			text = UIText.instance().getText(38)
		}


		let type = this.getOutType();
		let item: BaseItemModel = null;
		// console.log(' type == ', type)
		switch (type) {
			case FoodOutType.OUT_COST_ITEM:
				let clickList = this.getOutput();
				item = BagManager.instance().getNewItemModel(clickList[0], clickList[1])
				if (item) {
					text += ',Click to get' + item.getNum(false) + ' Num ' + item.getName()
				}
				break;
			case FoodOutType.NO_OUT:
				break;
			default:
				text += ',Double click produce item'
				break;
		}
		return text;
	}





	// update (dt) {}
}
