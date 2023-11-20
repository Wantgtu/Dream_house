// import BaseView from "../../cfw/mvc/BaseView";
// import GlobalEvent from "../../cfw/event/GlobalEvent";
// import SDKManager from "../../sdk/SDKManager";
// import BagManager from "../bag/BagManager";
// import { BannerDir, BattleID } from "../../sdk/SDKConfig";
import CrazyClickC, { SPECIAL_COUNT } from "./CrazyClickC";
// import { InitValue } from "../../public/Config";
// import RandomHelper from "../../cfw/tools/RandomHelper";
import { MOVE_DIR } from "../../cfw/tools/Define";
import { BaseView } from "../../cfw/view";
import { GEvent } from "../../cfw/event";
import Utils from "../../cfw/tools/Utils";
import CMgr from "../../sdk/channel-ts/CMgr";
import SDKManager from "../../sdk/sdk/SDKManager";
import BagManager from "../public/bag/BagManager";
import { ModuleID } from "../../config/ModuleConfig";
import { SDKDir } from "../../sdk/sdk/SDKConfig";
import { BaseItemModel } from "../../cfw/model";
import FoodItemModel from "../game/model/FoodItemModel";
import TweenMgr from "../../cocos/TweenMgr";
import { ItemID, FREE_EGG_COUNT } from "../../config/Config";
import UIText from "../../cocos/lang/UIText";
// import ModuleManager, { ModuleID } from "../../cfw/module/ModuleManager";
let add: number = 15
let sub: number = 12;
let DIRX = 'dirX';
let DIRY = 'dirY'
let SPEED = 'speedX'
let SPEEDY = 'speedY'
enum EggState {
	INIT,
	ROLLING,
	// ROLL_FINISH,
	SHOW_EGG,
	EGG_BREAK,
	SHOW_GOLD,
	SHOW_GOLD_FINISH,
	EGG_STAND,
	// UP,
	DOWN,
	DROP_EGG,



}
const { ccclass, property } = cc._decorator;

@ccclass
/**
 * 1.选择高级还是低级砸蛋
 * 2.开始旋转
 * 3.落下一个蛋
 * 4.蛋升上来
 * 5.砸蛋
 * 6.蛋碎
 * 7.展示道具
 * 8.显示再砸一次按钮。
 * 9.但落下去，蛋框落下来。
 * 10.重置到初始状态。
 */
export default class CrazyClickView extends BaseView {

	@property({ type: cc.Sprite, displayName: "giftBox$VSprite" })
	giftBox$VSprite: cc.Sprite = null;

	@property(cc.ProgressBar)
	progressBar: cc.ProgressBar = null;

	@property({ type: cc.Button, displayName: "click$VButton" })
	click$VButton: cc.Button = null;

	@property({ type: cc.Button, displayName: "back$VButton" })
	back$VButton: cc.Button = null;

	@property(cc.Node)
	box: cc.Node = null;

	@property(cc.Node)
	chuizi: cc.Node = null;

	@property(cc.Node)
	shells: cc.Node = null;

	@property(cc.Node)
	eggshell: cc.Node = null;

	@property(cc.Node)
	CustomNode: cc.Node = null;

	@property(cc.Node)
	eggNode: cc.Node = null;

	@property(cc.Node)
	boxNode: cc.Node = null;

	@property(cc.Sprite)
	egg: cc.Sprite = null;

	@property(cc.Node)
	replayBtn: cc.Node = null;

	@property(cc.Sprite)
	itemIcon: cc.Sprite = null;

	@property(cc.Label)
	freeLabel: cc.Label = null;


	@property(cc.Label)
	tip: cc.Label = null;

	protected isClick: boolean = false;

	protected process: number = 0;

	protected duration: number = 0;

	protected reduce: number = 1;

	// protected isJump: boolean = false;



	protected controller: CrazyClickC;

	// protected ballRollCount: number = 0;

	// protected step: number = 0;

	protected isOk: boolean = true;//正在弹出广告时不让点击

	protected hasAd: boolean = false;//在此页面是否产生了广告


	protected state: EggState = EggState.INIT;

	protected witchEgg: number = 0;

	protected item: FoodItemModel;

	protected temp: number = 0;
	protected temp2: number = 0;

	protected tempPos: cc.Vec2[] = []

	onLoad() {
		this.gEventProxy.on(GEvent.EVENT_SHOW, this.eventShow, this)
		this.gEventProxy.on(CrazyClickC.EGG_RESULT, this.doLogic, this)

		this.freeLabel.string = '-' + FREE_EGG_COUNT
		let max = this.box.children.length;
		for (let index = 0; index < max; index++) {
			const element = this.box.children[index];
			let ballpos = element.position;
			this.tempPos.push(cc.v2(ballpos.x, ballpos.y))
		}
		this.temp = this.eggNode.y;
		this.temp2 = this.egg.node.y;
		this.changeState(EggState.INIT)
	}

	private init() {
		this.progressBar.progress = 0;
		this.shells.active = false;
		this.giftBox$VSprite.node.active = false;
		this.eggshell.active = false;
		this.process = 0;
		this.reduce = 1;
		this.isClick = false;
		this.duration = 0;
		this.egg.node.opacity = 0;
		this.replayBtn.active = false;
		this.chuizi.opacity = 0;
		this.isOk = true;
		let list = this.shells.children;
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			element.setPosition(0, 0)
		}
		let num = CrazyClickC.instance().getCount() % SPECIAL_COUNT
		if (num == 0) {
			this.tip.string = UIText.instance().getText(56)
		} else {
			let count = SPECIAL_COUNT - num
			this.tip.string = UIText.instance().getText(55, { num: count })
		}

	}
	changeState(s: EggState) {
		// Debug.log(' changeState s ', s)
		this.state = s;
		switch (s) {
			case EggState.INIT:
				this.init();
				break;
			case EggState.ROLLING:
				this.rollStart();
				break;
			case EggState.DROP_EGG:
				this.dropEgg()
				break;
			case EggState.SHOW_EGG:
				this.showEgg();
				break;
			case EggState.EGG_BREAK:
				this.eggBreak();
				break;
			case EggState.SHOW_GOLD:
				this.showGold()
				break;
			case EggState.EGG_STAND:
				this.showChuizi(0, 0.1);
				break;
			case EggState.SHOW_GOLD_FINISH:
				this.replayBtn.active = true;
				break;
			case EggState.DOWN:
				this.down();
				break;
		}
	}
	private showRewardItem(item: BaseItemModel) {
		let scale = item.getScale() + 0.5;
		let s2 = scale + 1
		let s3 = s2 + 0.1;
		cc.tween(this.itemIcon.node).to(0.5, { scale: s2 })
			.delay(0.2)
			.to(0.2, { scale: s3 })
			.to(0.5, { scale: scale })
			.call(() => {
				// this.icon.node.active = false;
				this.changeState(EggState.SHOW_GOLD_FINISH)
			})
			.start();

	}
	private dropEgg() {
		// this.egg.node.active = true;
		this.egg.node.y = this.temp2;
		let path = 'egg' + Utils.random(0, 4)
		this.setSpriteAtlas(this.egg, ModuleID.CRAZY_CLICK, 'bg/egg', path)
		this.egg.node.opacity = 0;
		cc.tween(this.egg.node).to(0.5, { opacity: 255 }).delay(0.1)
			.to(0.5, { position: this.eggNode.position })
			.call(() => {
				this.changeState(EggState.SHOW_EGG)
			})
			.start()
	}

	private showChuizi(count: number = 1, time: number = 0.1) {
		TweenMgr.showChuizi(this.chuizi, count, time)
	}


	private rollStart() {

		for (let index = 0; index < this.box.children.length; index++) {
			const element = this.box.children[index];
			// element.setPosition(this.tempPos[index].x, this.tempPos[index].y)
			// if (element[DIRX] == undefined) {
			element[DIRX] = MOVE_DIR[Utils.random(0, MOVE_DIR.length)];
			// }
			// if (element[DIRY] == undefined) {
			element[DIRY] = MOVE_DIR[Utils.random(0, MOVE_DIR.length)];
			// }
			// if (element[SPEED] == undefined) {
			element[SPEED] = Utils.random(15, 20);
			// }
			// if (element[SPEEDY] == undefined) {
			element[SPEEDY] = element[SPEED]
			// }
		}
	}
	eventShow() {
		if (!this.hasAd) {
			return;
		}
		// console.log(' CrazyClickView eventShow',)
		// this.isJump = true;
		this.changeState(EggState.EGG_BREAK)
		CMgr.helper.hideBannerAd(0)
		SDKManager.getChannel().loadBanner()
	}

	replayButtonClick() {
		if (this.state == EggState.SHOW_GOLD_FINISH) {
			this.changeState(EggState.DOWN)
		}
	}


	onRightButtonClick() {
		if (this.state != EggState.INIT) {
			return;
		}
		this.controller.getReward(0)

	}

	private doLogic(witch: number) {
		this.witchEgg = witch;
		this.item = CrazyClickC.instance().getResult(this.witchEgg);
		if (this.item) {
			this.setSpriteAtlas(this.itemIcon, this.item.getModuleID(), this.item.getIcon(), this.item.getSpriteFrame())
			this.itemIcon.node.scale = this.item.getScale();
			this.changeState(EggState.ROLLING)
		}

	}

	onLeftButtonClick() {
		if (this.state != EggState.INIT) {
			return;
		}

		this.controller.getReward(1)
	}




	private down() {
		let time = 0.5;
		this.giftBox$VSprite.node.active = true;
		cc.tween(this.eggNode).to(time, { y: this.temp })
			.call(() => {
				this.changeState(EggState.INIT)
			})
			.start();
		cc.tween(this.boxNode).to(time, { y: 0 }).start();
	}

	private showEgg() {
		let time = 0.5;
		// this.step = 1;
		this.giftBox$VSprite.node.active = true;
		cc.tween(this.eggNode).to(time, { y: 0 })
			.call(() => {
				this.changeState(EggState.EGG_STAND)
			})
			.start();
		cc.tween(this.boxNode).by(time, { y: this.boxNode.height })
			.call(() => {
				for (let index = 0; index < this.box.children.length; index++) {
					const element = this.box.children[index];
					element.setPosition(this.tempPos[index].x, this.tempPos[index].y)
				}
			})
			.start();
		// this.showChuizi()
		// this.setTimeout(() => {
		// 	this.showChuizi()
		// }, 300);

	}

	private eggBreak() {
		this.eggshell.active = true;
		this.shells.active = true;
		this.giftBox$VSprite.node.active = false;
		let list = this.shells.children;
		let count: number = 0;
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			let tx = MOVE_DIR[Utils.random(0, MOVE_DIR.length)] * Utils.random(50, 150)
			let ty = - Utils.random(200, 250)
			cc.tween(element).to(0.5, { x: tx, y: ty }).call(() => {
				count++;
				// element.opacity = 0;
				if (count >= list.length) {

				}
			}).start()
		}

		this.setTimeout(() => {
			// this.showGold()
			this.changeState(EggState.SHOW_GOLD)
		}, 500)

	}

	/**
	 * todo
	 */
	private showGold() {
		if (this.item) {

			BagManager.instance().updateItem(this.item)
			CrazyClickC.instance().updateCount()
			this.showRewardItem(this.item)
		}

		// if (cc.isValid(this.node)) {
		// 	let pos = this.shells.parent.convertToWorldSpaceAR(this.shells.getPosition())
		// 	// BagManager.instance().updateItemNum(InitValue.CRAZY_REWARD_NUM, pos, 1)
		// } else {
		// 	// BagManager.instance().updateItemNum(InitValue.CRAZY_REWARD_NUM)
		// }
		// this.setTimeout(() => {
		// 	this.hide()
		// 	this.controller.next();
		// }, 2000)
	}

	// private clickSuccess() {
	// 	// this.step = 2;
	// 	this.eggBreak();
	// }

	onDestroy() {
		super.onDestroy();
		CrazyClickC.step++;
	}
	protected showCount: number = 0;
	onclick$VButtonClick() {
		if (this.state != EggState.EGG_STAND) {
			return;
		}
		// if (this.isJump) {
		// 	return;
		// }
		if (!this.isOk) {
			this.isOk = true;
			return;
		}
		this.showChuizi()
		if (!this.isClick) {
			this.isClick = true;
		}
		this.duration = 1;
		this.reduce = 1;
		if (this.process < 100) {
			this.process += add;
			if (this.process > 100) {
				this.process = 100;
				// this.clickSuccess()
				this.changeState(EggState.EGG_BREAK)
			}
			if (this.process >= 60) {
				let flag = CMgr.helper.isBannerErrorClick()
				// flag = true;
				if (flag) {
					if (SDKManager.getChannel().hasBanner()) {

						if (!CMgr.helper.getzs_banner_force_click()
							&& this.showCount > 0) {

							return;
						} else {

						}
						this.showCount++;
						let change = CMgr.helper.getzs_advert_change();
						console.log(' change ', change)
						change = parseInt('' + change)
						switch (change) {
							case -1:
								this.showBanner();
								break;
							case 1:
								this.showCustomAd()
								break;
							case 0:
								if (CrazyClickC.step % 2 == 0) {
									this.showBanner();
								} else {
									this.showCustomAd()
								}

								break;

						}

					}

				}

			}
			this.updateProgress()

		}



	}

	private showCustomAd() {
		this.isOk = false;
		this.hasAd = true;
		let rx = this.CustomNode.x / this.CustomNode.parent.width;
		// console.log(' this.node.y ', this.node.y, ' this.node.parent.height ', this.node.parent.height)
		let ry = (this.CustomNode.parent.height - this.CustomNode.y) / this.CustomNode.parent.height;
		console.log(' rx == ry ====== ', rx, ry)
		SDKManager.getChannel().showCustomAd(0, rx, ry)
		this.setTimeout(() => {
			this.hasAd = false;
			// if (cc.isValid(this.node)) {
			this.isOk = true;
			if (this.state != EggState.EGG_BREAK) {
				SDKManager.getChannel().hideCustomAd()
			}
			// }
		}, 2000);
	}

	private showBanner() {
		SDKManager.getChannel().showBanner(0, SDKDir.MID)
		this.isOk = false;
		this.hasAd = true;
		this.setTimeout(() => {
			this.hasAd = false;
			// if (cc.isValid(this.node)) {
			this.isOk = true;
			if (this.state != EggState.EGG_BREAK) {
				SDKManager.getChannel().hideBanner()
			}
			// }
		}, 2000);
	}

	updateProgress() {
		this.progressBar.progress = this.process / 100;
	}

	onback$VButtonClick() {
		this.hide()
		this.controller.next();
	}

	private clickEgg(dt: number) {
		if (this.isClick) {
			if (this.duration > 0) {
				this.duration -= dt;
				if (this.duration < 0) {
					this.duration = 0;
					this.isClick = false;
				}
			}
		} else {
			if (this.reduce > 0) {
				this.reduce -= dt;
				if (this.reduce < 0) {
					this.reduce = 1;
					if (this.process > 0) {
						this.process -= sub;
						if (this.process < 0) {
							this.process = 0;
						}
						this.updateProgress()
					}

				}
			}
		}
	}

	update(dt: number) {

		switch (this.state) {
			case EggState.ROLLING:
				this.updateBalls()
				break;
			case EggState.EGG_STAND:
				this.clickEgg(dt)
				break;
		}


	}



	private updateBalls() {
		let count: number = 0;
		let max = this.box.children.length;
		for (let index = 0; index < max; index++) {
			const element = this.box.children[index];
			// if (element[SPEED] < 0) {
			// 	continue;
			// }
			let ballpos = element.position;
			let hw = element.width / 2;
			let hh = element.height / 2;




			if (element[SPEED] > 0) {
				if (ballpos.x - hw <= 0 || ballpos.x + hw >= this.box.width) {
					element[DIRX] = -element[DIRX]
					element[SPEED] -= 1;
				}
				element.x += element[DIRX] * element[SPEED]
				if (element.y - hh <= 0) {
					element[SPEED] -= 0.1;
				}


			}

			if (element[SPEEDY] > 0) {
				if (ballpos.y - hh <= 0 || ballpos.y + hh >= this.box.height) {
					element[DIRY] = -element[DIRY]
					element[SPEEDY] -= 1;
				}
				element.y += element[DIRY] * element[SPEEDY]
			} else {
				element.y += element[SPEEDY]
			}

			element[SPEEDY] -= 0.1;
			if (element[SPEEDY] < 0) {
				if (element.y - hh <= 0) {
					element.y = hh;
					count++;
				}
			}


			// this.updateSpeed(element)

			// this.rollAction(element, pos)
		}
		if (count >= max) {
			// this.showEgg()
			// this.changeState(EggState.SHOW_EGG)
			this.changeState(EggState.DROP_EGG)
		}
	}

	// updateSpeed(element) {
	// 	// if (element.y < this.box.height / 3) {
	// 	if (element[SPEED] > 0) {
	// 		element[SPEED] -= 1;
	// 		if (element[SPEED] < 0) {
	// 			element[SPEED] = 0;
	// 		}
	// 	}
	// 	// }
	// }

}