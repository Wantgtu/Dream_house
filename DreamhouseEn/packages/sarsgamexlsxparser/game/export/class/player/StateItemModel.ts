import { DataModel } from "../../../cfw/cfw";


export enum StateItemModelEnum{
	animName,// 动画名称
	ai,// AI
	finish,// 结束条件
	param,// 结束参数
	soundID,// 音效ID
	break,// 是否可以被打断
	jumpAction,// 跳转动作
	exp,// 经验
	needJudge,// 可以转操作
	guideID,// 结束教学ID
	
}

/**
* 行为表
**/
export default class StateItemModel extends DataModel {

	static CLASS_NAME:string = 'StateItemModel'
	constructor() {
		super(StateItemModel.CLASS_NAME)
	}
	// 动画名称
	getAnimName() {
		return this.getValue(StateItemModelEnum.animName)
	}
	// AI
	getAi() {
		return this.getValue(StateItemModelEnum.ai)
	}
	// 结束条件
	getFinish() {
		return this.getValue(StateItemModelEnum.finish)
	}
	// 结束参数
	getParam() {
		return this.getValue(StateItemModelEnum.param)
	}
	// 音效ID
	getSoundID() {
		return this.getValue(StateItemModelEnum.soundID)
	}
	// 是否可以被打断
	getBreak() {
		return this.getValue(StateItemModelEnum.break)
	}
	// 跳转动作
	getJumpAction() {
		return this.getValue(StateItemModelEnum.jumpAction)
	}
	// 经验
	getExp() {
		return this.getValue(StateItemModelEnum.exp)
	}
	// 可以转操作
	getNeedJudge() {
		return this.getValue(StateItemModelEnum.needJudge)
	}
	// 结束教学ID
	getGuideID() {
		return this.getValue(StateItemModelEnum.guideID)
	}
	


}