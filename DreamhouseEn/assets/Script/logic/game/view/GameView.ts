

// import FoodMgr from '../model/FoodMgr';
import GridItemModel from '../model/GridItemModel';
import FoodItemView from './FoodItemView';
import { GridItemView } from './GridItemView';
// import FoodItemModel from '../model/FoodItemModel';
import Utils from '../../../cfw/tools/Utils';
import ItemMgr from '../../item/model/ItemMgr';
import GameC from '../GameC';
import { ItemID, EventName, FoodOutType, FoodHasState, SoundID, DailyTaskID, PersonState, FRAME_DURATION } from '../../../config/Config';
import BuyView from '../../buy/view/BuyView';
import { CCPoolManager } from '../../../cocos/ccpool';
import GridFoodItemModel from '../model/GridFoodItemModel';
import BuyItemView from '../../buy/view/BuyItemView';
import BuyFoodItemView from '../../buy/view/BuyFoodItemView';
import BagManager from '../../public/bag/BagManager';
import { ItemState } from '../../../cfw/model';
import TipC from '../../public/tip/TipC';
import GuideMgr from '../../../extention/guide/GuideMgr';
import GuideEventLogic from '../../../extention/guide/GuideEventLogic';
import GameEventAdapter from '../../../extention/gevent/GameEventAdapter';
import { EventCheckType } from '../../../extention/gevent/GameEventConfig';
import SoundMgr from '../../sound/model/SoundMgr';
import DailyTaskMgr from '../../dailytask/model/DailyTaskMgr';
import { GEvent } from '../../../cfw/event';
import GameBottomView from './GameBottomView';
import GameManager from '../model/GameManager';
import ScaleForever from '../../../cocos/comp/ScaleForever';
import SpecialtaskMgr from '../../specialtask/model/SpecialtaskMgr';
import { LocalValue } from '../../../cfw/local';
import CMgr from '../../../sdk/channel-ts/CMgr';
import UmengEventID from '../../../config/UmengEventID';
import { SplitFrameLoader, TimeManager } from '../../../cfw/time';
const { ccclass, property } = cc._decorator;
let DIS: number = 50;
/**
 * Predefined variables
 * Name = GameView
 * DateTime = Mon Nov 29 2021 19:17:35 GMT+0800 (中国标准时间)
 * Author = cgw0827
 * FileBasename = GameView.ts
 * FileBasenameNoExtension = GameView
 * URL = db://assets/Script/logic/game/view/GameView.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass
export class GameView extends GuideEventLogic {
	// [1]
	// dummy = '';

	// [2]
	@property({ type: cc.Node })
	itemView: cc.Node = null;

	@property({ type: cc.Prefab })
	itemPrefab: cc.Prefab = null;

	@property({ type: cc.Node })
	gridView: cc.Node = null;


	@property({ type: cc.Node })
	frameNode: cc.Node = null;

	protected buyView: BuyView = null;

	@property({ type: cc.Prefab })
	foodPrefab: cc.Prefab = null;

	@property(cc.Node)
	finger: cc.Node = null;

	@property()

	protected temp: cc.Vec3 = new cc.Vec3()
	protected out: cc.Vec3 = new cc.Vec3()
	protected pos: cc.Vec2 = new cc.Vec2()
	protected touchIndex: number = -1;
	protected touchID: number = -1;
	protected gridList: GridItemView[] = []

	protected controller: GameC;
	protected selectIndex: number = -1;
	protected timeoutID: number = 0;
	protected shakeList: GridItemView[] = null;

	protected bottom: GameBottomView;
	protected model: GameManager;

	protected isLoadFinish: boolean = true;
	protected frameLoader: SplitFrameLoader = new SplitFrameLoader(this.splitFrameInit.bind(this), FRAME_DURATION, 1)

	onLoad() {
		super.onLoad();
		this.controller.setLoading(false)
		this.controller.addBottom(this.node, this.model, (comp: GameBottomView) => {
			this.bottom = comp
			this.bottom.gameView = this
		})
		TimeManager.instance().add(this.frameLoader)
		this.finger.addComponent(ScaleForever)
		this.finger.active = false;
		GEvent.instance().emit(EventName.VIEW_SHOW, true, this.getName())

		this.buyView = this.node.getComponent(BuyView)
		// this.boxPos = this.itemView.convertToNodeSpaceAR(this.box.getPosition())
		// this.initGrid()

		this.controller.init();
		cc.game.on(cc.game.EVENT_SHOW, this.eventShow, this)
		CMgr.helper.intoGame();

	}

	eventShow() {
		console.log('GameView  EventShow ')
		this.model.init();
		for (let index = 0; index < this.gridList.length; index++) {
			const element = this.gridList[index];
			element.updateFoodState();
		}
		let grid = this.getCurGrid()
		if (grid) {
			// grid.updateFoodState();
			this.setFoodInfo(grid)
		}

	}
	start() {
		// [3]
		// console.log("GameView start")
		this.select(false)
		this.findMatch()
		this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
		this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
		this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this)
		this.gEventProxy.on(EventName.DELETE_BUY_ITEM, this.deleteItem, this)
		this.gEventProxy.on(EventName.DELETE_STORAGE_ITEM, this.addFoodByStorage, this)
		this.gEventProxy.on(EventName.DELETE_GRID_FOOD, this.deleteGridFood, this)

	}

	deleteGridFoodByFoodID(foodType: number) {
		let list = this.gridList;
		for (let index = 0; index < list.length; index++) {
			const grid = list[index];
			let food = grid.getFood();
			if (food) {
				if (food.getFType() == foodType) {
					food.removeSelf();
					grid.removeFood(true)
					// break;
				}
			}
		}
	}

	deleteGridFood(gridID: number) {
		let grid = this.gridList[gridID]
		if (grid) {
			let food = grid.getFood();
			if (food) {
				food.removeSelf();
				grid.removeFood(true)
			}
			this.setFramePos(grid)

		}
	}

	deleteItem(item: BuyItemView) {
		if (this.buyView)
			this.buyView.remove(item)
		this.buyFood(item)
	}

	getGridList() {
		return this.gridList
	}

	hasFood(foodID: number) {
		let list: GridItemView[] = this.gridList;
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			let food = element.getFood()
			if (food) {
				let f = food.getFoodID();
				// console.log(' ffffffffffffffffff ', f)
				if (f == foodID) {
					return true;
				}
			}

		}
		return false;
	}

	touchStart(e: cc.Touch) {
		// console.log(' e ', e)
		if (this.touchID >= 0 || !this.isLoadFinish) {
			return
		}
		this.touchID = e.getID()
		let pos = e.getLocation()
		this.pos.x = pos.x;
		this.pos.y = pos.y;
		this.temp.x = pos.x
		this.temp.y = pos.y;
		this.gridView.convertToNodeSpaceAR(this.temp, this.out)
		let tempIndex = this.getTouchIndex(this.out.x, -this.out.y)
		this.touchIndex = tempIndex;
		// console.log(' touchIndex ', tempIndex)
		if (tempIndex >= 0) {
			if (this.gridList[tempIndex]) {

				let grid = this.gridList[tempIndex];
				// if(grid.isOpen()){

				// }else{

				// }
				if (grid.hasFood()) {
					// this.curGrid = this.gridList[this.touchIndex]
					if (grid.isOpen()) {
						let food = grid.getFood()
						this.setFoodPos(food, grid)
					}

					this.select(false)
					this.stopMatch()
					this.stopFoodShake()

				}

			}

		}
	}

	stopFoodShake() {
		if (this.shakeList && this.shakeList.length > 0) {
			for (let index = 0; index < this.shakeList.length; index++) {
				const element = this.shakeList[index];
				element.stopShake()
			}
			this.shakeList = null;
		} else {
			if (this.finger.active) {
				this.finger.active = false
			}
			if (this.bottom)
				this.bottom.stopBoxAnim()
		}

	}

	setFoodPos(food: FoodItemView, grid: GridItemView) {
		if (food.node) {
			food.node.parent = this.itemView;
			let p = grid.getPos()
			food.node.x = p.x;
			food.node.y = p.y;
		}

	}

	// getPos(id: number) {
	// 	let xi = Math.floor(id % 7)
	// 	let yi = Math.floor(id / 7)
	// 	let x = this.curGrid.node.width / 2 + xi * this.curGrid.node.width;
	// 	let y = - this.curGrid.node.height / 2 - yi * this.curGrid.node.height
	// 	return cc.v2(x, y)
	// }

	getTouchIndex(x: number, y: number) {

		// let ui = this.itemView.getComponent(UITransform);

		// console.log(' pos 1 ', pos)
		// console.log(' this.itemView.position v3 ', v3)
		// let x = this.out.x
		// let y = -this.out.y
		let row = 9;
		let line = 7;
		// console.log(' pos x ', x, ' y ', y)
		let g = this.gridList[0]
		if (!g) {
			return -1;
		}
		let w = g.node.width;
		let xi = Math.floor(x / w)
		let yi = Math.floor(y / w)
		if (x < 0 || y < 0) {
			return -1;
		}
		if (xi >= line) {
			return -1;
		}
		if (yi >= row) {
			return -1;
		}

		let id = xi + yi * line;
		// console.log(' xi ', xi, ' yi ', yi, ' id ', id)

		return id;
		// console.log(' xi ', xi, ' yi ', yi)
		// this.touchIndex.x = xi;
		// this.touchIndex.y = yi;

	}


	protected isMove: boolean = false;

	touchMove(e: cc.Touch) {
		if (!this.isLoadFinish) {
			return;
		}
		// console.log(' e ', e)
		if (this.touchID == e.getID()) {
			let curGrid = this.gridList[this.touchIndex]
			if (!curGrid) {
				return;
			}
			if (curGrid.isOpen() && curGrid.hasFood()) {
				let pos = e.getLocation()
				if (!this.isMove) {
					if (Math.abs(pos.x - this.pos.x) > DIS || Math.abs(pos.y - this.pos.y) > DIS) {
						this.isMove = true;
					}
				}
				if (!this.isMove) {
					return;
				}
				this.temp.x = pos.x
				this.temp.y = pos.y;
				this.gridView.convertToNodeSpaceAR(this.temp, this.out)
				let food: FoodItemView = curGrid.getFood()
				// food.node.parent = this.itemView;
				food.node.x = this.out.x;
				food.node.y = this.out.y;
				// }

			}
		}
	}

	select(f: boolean) {
		this.frameNode.opacity = f ? 255 : 0
	}

	// hideFrame() {
	// 	this.select(false)
	// }

	setFramePos(grid: GridItemView) {
		let pos = grid.getPos()
		this.frameNode.x = pos.x;
		this.frameNode.y = pos.y;
		if (this.selectIndex != grid.getID()) {
			let oldGrid = this.gridList[this.selectIndex]
			if (oldGrid) {
				oldGrid.isSelect = false;
			}
			this.selectIndex = grid.getID();
		}

		this.setFoodInfo(grid)
	}

	// showFrame(grid: GridItemView) {
	// 	this.setFramePos(grid)
	// 	this.select(true)
	// }

	updateFoodInfo(index: number) {
		let grid = this.gridList[index]
		if (grid) {
			this.setFoodInfo(grid)
		}
	}

	getCurGrid() {
		let grid = this.gridList[this.selectIndex]
		return grid;
	}


	getGridByFoodID(foodID: number) {
		for (let index = 0; index < this.gridList.length; index++) {
			const element = this.gridList[index];
			let food = element.getFood();
			if (food) {
				if (foodID == food.getFoodID()) {
					return element
				}
			}
		}
		return null;
	}

	setFoodInfo(grid: GridItemView) {
		if (!this.bottom) {
			return;
		}
		this.bottom.setFoodInfo(grid)
	}

	hasOtherFood(food: FoodItemView) {
		let type = food.getFType();
		for (let index = 0; index < this.gridList.length; index++) {
			const element = this.gridList[index];
			let other = element.getFood();
			if (other && other != food) {
				let otherType = other.getFType();
				if (type == otherType && food.getLevel() <= other.getLevel()) {
					return true;
				}
			}
		}
		return false;
	}

	updateGridAndBuyState() {
		if (this.buyView) {
			this.buyView.updateBuyItemList()
		}

	}

	// updateGridState() {

	// }

	exchangeFood(grid1: GridItemView, grid2: GridItemView) {
		let food1 = grid1.getFood();
		let food2 = grid2.getFood();
		grid1.setFood(food2)
		grid2.setFood(food1)
	}

	touchEnd(e: cc.Touch) {
		if (!e) {
			return;
		}
		if (!this.isLoadFinish) {
			return;
		}
		if (this.touchID == e.getID()) {
			this.touchID = -1;
			if (this.touchIndex < 0) {

				return;
			}
			let curGrid = this.gridList[this.touchIndex]
			if (!curGrid) {
				return;
			}
			this.isMove = false;
			let food: FoodItemView = curGrid.getFood()
			if (!food) {
				// console.log(' food is null ')
				return;
			}
			let pos = e.getLocation()
			this.findMatch()
			if (!curGrid.isOpen()) {
				//未开放，放回原处，并不会移动
				curGrid.setFood(food)
				if (Math.abs(pos.x - this.pos.x) <= DIS && Math.abs(pos.y - this.pos.y) <= DIS) {
					// this.select(true)
					if (curGrid.getState() == ItemState.CAN_GET) {
						this.setFramePos(curGrid)
					}

				} else {

				}
			} else {
				//拖拽
				if (Math.abs(pos.x - this.pos.x) > DIS || Math.abs(pos.y - this.pos.y) > DIS) {
					this.temp.x = pos.x
					this.temp.y = pos.y;
					this.gridView.convertToNodeSpaceAR(this.temp, this.out)
					let touchIndex = this.getTouchIndex(this.out.x, -this.out.y)
					// console.log('拖拽 touchIndex ', touchIndex)

					if (touchIndex >= 0) {
						let grid = this.gridList[touchIndex]
						if (grid) {
							if (grid.isOpen()) {
								let newFood: FoodItemView = grid.getFood();
								if (newFood) {//位置上有道具
									// console.log(' 位置上有道具 ')
									if (newFood == food) {
										// console.log(' 是自己 ')
										curGrid.setFood(food)
										// this.select(true)
										this.setFramePos(curGrid)
									} else {

										if (newFood.getFoodID() == food.getFoodID()) {
											if (newFood.isTimeFraze() || food.isTimeFraze()) {
												this.exchangeFood(grid, curGrid)
												// this.select(true)
												this.setFramePos(grid)
											} else {
												let next = this.model.getNextModel(food.getModel())
												if (next) {//产生新道具
													// grid.addFood(next)
													food.removeSelf()
													newFood.removeSelf();
													newFood.setModel(next)
													newFood.content()
													newFood.popAnim();
													newFood.updateFoodState();
													grid.setFood(newFood)
													curGrid.removeFood()
													this.setOtherCanOpen(grid)
													// this.select(true)
													this.setFramePos(grid)
													this.updateGridAndBuyState()
													this.addSplitFood(grid, newFood)
													GuideMgr.instance().notify('GameView_touchEnd')
													SoundMgr.instance().playSound(SoundID.sfx_collectItem)
													GEvent.instance().emit(EventName.MERGE_NEW_FOOD, newFood.getFoodID())
													// GameEventAdapter.instance().checkEvent(EventCheckType.MERGE_NEW_FOOD, newFood.getFoodID())
													return true
												} else {
													curGrid.setFood(food)//放回原处
													// this.select(true)
													this.setFramePos(curGrid)
												}

											}
										} else {//交换位置
											// grid.setFood(food)
											// curGrid.setFood(newFood)
											this.exchangeFood(grid, curGrid)
											// this.select(true)
											this.setFramePos(grid)
										}
										// console.log(' newFood.getID() == food.getID() ', newFood.getFoodID() == food.getFoodID())

									}

								} else {//放到一个空置的位置上
									// grid.setFood(food)
									// curGrid.setFood(null)
									this.exchangeFood(grid, curGrid)
									// this.select(true)
									this.setFramePos(grid)
								}
							} else if (grid.isCanOpen()) {
								//拖拽到的位置没开启
								let newFood: FoodItemView = grid.getFood()
								if (newFood) {//未开启的位置上有道具

									if (newFood.getFoodID() == food.getFoodID()) {//两个道具相同
										if (food.isTimeFraze()) {
											curGrid.setFood(food)
											// this.select(true)
											this.setFramePos(curGrid)
										} else {
											// let next = food.getNextModel();
											let next = this.model.getNextModel(food.getModel())
											if (next) {
												// grid.addFood(next)
												food.removeSelf()
												newFood.removeSelf();
												newFood.setModel(next)
												// grid.setFood(next)
												newFood.content();
												newFood.popAnim();
												newFood.updateFoodState();
												grid.setFood(newFood)
												grid.setOpen()
												this.setOtherCanOpen(grid)
												curGrid.removeFood()
												// this.select(true)
												this.setFramePos(grid)
												this.updateGridAndBuyState()
												GuideMgr.instance().notify('GameView_touchEnd2')
												SoundMgr.instance().playSound(SoundID.sfx_collectItem)
												GEvent.instance().emit(EventName.MERGE_NEW_FOOD, newFood.getFoodID())
												// GameEventAdapter.instance().checkEvent(EventCheckType.MERGE_NEW_FOOD, newFood.getFoodID())
											} else {
												curGrid.setFood(food)
												// this.select(true)
												this.setFramePos(curGrid)
											}

										}

									} else {//不是同一个 放回原处
										curGrid.setFood(food)
										// this.select(true)
										this.setFramePos(curGrid)
									}
								} else {
									//还原
									curGrid.setFood(food)
									// this.select(true)
									this.setFramePos(curGrid)
								}
							} else {
								curGrid.setFood(food)
								// this.select(true)
								this.setFramePos(curGrid)
							}
						} else {
							curGrid.setFood(food)
							// this.select(true)
							this.setFramePos(curGrid)
						}
						// if (grid && grid.isOpen()) {

						// } else {




						// }
					} else {

						if (this.bottom && this.bottom.collideWithBox(food)) {

							this.addToStorage(curGrid)
						} else {
							//多拽的位置不存在 还原
							curGrid.setFood(food)
							// this.select(true)
							this.setFramePos(curGrid)
						}

					}

				} else { //点击 
					if (curGrid.getState() != ItemState.NOT_GET) {
						curGrid.setFood(food)
						if (food) {
							// console.log('this.curGrid.isSelect ', curGrid.isSelect)
							if (curGrid.isSelect) {
								this.clickGrid(curGrid)
							} else {

								curGrid.isSelect = true;
								GuideMgr.instance().notify('clickFood')
								// this.setFoodInfo(curGrid)
							}
							// this.select(true)
							this.setFramePos(curGrid)
						}
					}


				}

			}
			this.touchIndex = -1;
		}
		return false;
	}

	private getCanOpenGridByFood(grid: GridItemView) {
		// if (!grid.isNotOpen()) {
		// 	return -1;
		// }
		let food = grid.getFood();
		if (!food) {
			return -1;
		}
		// let type = food.getOutType();
		// console.log(' type == ', type)
		if (!food.isCostEnergy()) {
			return -1;
		}

		let list = this.gridList;
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (grid != element && element.isNotOpen()) {
				let f = element.getFood();
				if (f) {
					// console.log(' foodid i', f.getFoodID(), food.getFoodID())
					if (f.getFoodID() == food.getFoodID()) {
						return element.getID();
					}
				}
			}
		}
		return -1;

	}

	setOtherCanOpen(grid: GridItemView) {
		// if (!grid.isNotOpen()) {
		// 	return;
		// }
		let id = parseInt(grid.getID());
		let temp = []
		let L = 7;
		let R = 9;
		let C = L * R;
		// console.log(' id ', id)
		let row = Math.floor(id / L)
		let line = id % L;
		let left = id - 1;
		let right = id + 1;
		let up = id - L;
		let down = id + L;
		if (Math.floor(left / L) == row) {
			temp.push(left)
		}
		if (Math.floor(right / L) == row) {
			temp.push(right)
		}

		if (up % L == line) {
			temp.push(up)
		}
		if (down % L == line) {
			temp.push(down)
		}

		let gid = this.getCanOpenGridByFood(grid)
		if (gid >= 0) {
			temp.push(gid)
		}
		// console.log(' temp ', temp)
		for (let index = 0; index < temp.length; index++) {
			const element = temp[index];
			if (element >= 0 && element <= C) {
				let g = this.gridList[element]
				if (g) {
					g.setCanOpen()
				}
			}
		}
	}


	clickGrid(curGrid: GridItemView) {
		// if (curGrid.getState() == ItemState.NOT_GET) {
		// 	return;
		// }
		let food = curGrid.getFood()
		// if (!food) {
		// 	return;
		// }

		if (food.isCostEnergy()) {
			if (ItemMgr.instance().isEnough(ItemID.ENERGY, 1)) {

				if (this.addFoodByGrid(curGrid)) {
					ItemMgr.instance().updateCount(ItemID.ENERGY, -1)
					DailyTaskMgr.instance().updateTaskCount(DailyTaskID.ENERGY, 1)
					SoundMgr.instance().playSound(SoundID.sfx_screenTap)
				}
				// }
			} else {
				//购买能量提示
				this.controller.showBuyEnergyView();
			}
		} else {
			if (this.addFoodByGrid(curGrid)) {
				SoundMgr.instance().playSound(SoundID.sfx_screenTap)
				// ItemMgr.instance().updateCount(ItemID.ENERGY, -1)
			}
		}





	}

	stopMatch() {
		if (this.timeoutID > 0) {
			clearTimeout(this.timeoutID)
			this.timeoutID = 0;
		}
	}

	onDestroy() {
		super.onDestroy();
		cc.game.off(cc.game.EVENT_SHOW, this.eventShow, this)
		GEvent.instance().emit(EventName.VIEW_SHOW, false, this.getName())
		this.stopMatch()
		TimeManager.instance().remove(this.frameLoader)
		CMgr.helper.leaveGame();
	}

	//找匹配的物品
	findMatch() {

		this.timeoutID = setTimeout(() => {
			let list = this.getMatchFood();
			if (list && list.length >= 2) {
				for (let index = 0; index < list.length; index++) {
					const element: GridItemView = list[index];
					element.startShake();
				}
				this.shakeList = list;
			} else {
				let g = this.getUnUseGrid()
				if (g) {
					let list = this.getClickFood();
					if (list.length > 0) {
						let r = Utils.random(0, list.length)
						console.log('findMath r ', r, list.length)
						let grid: GridItemView = list[r]
						this.finger.active = true;
						let pos = grid.getPos();
						this.finger.x = pos.x + 30;
						this.finger.y = pos.y - 30;
					}
				} else {
					if (this.bottom)
						this.bottom.startBoxAnim();
				}

			}

		}, 3000);


	}

	getClickFood() {
		let temp = []
		for (let index = 0; index < this.gridList.length; index++) {
			const element = this.gridList[index];
			if (element.getState() == ItemState.GOT) {
				let food: FoodItemView = element.getFood();
				if (food && food.canOutput() && !food.isTimeFraze()) {
					if (food.getOutType() == FoodOutType.OUT_COST_ITEM) {
						if (food.isMaxLevel()) {
							temp.push(element)
						}
					} else {
						temp.push(element)
					}

				}
			}

		}
		return temp;
	}

	getMatchFood() {
		let temp = {}
		for (let index = 0; index < this.gridList.length; index++) {
			const element = this.gridList[index];
			if (!element.isNotOpen()) {
				let food: FoodItemView = element.getFood();
				if (food && food.hasNext() && food.getState() != ItemState.CAN_GET && !food.hasFull()) {
					let foodID = food.getFoodID();
					if (!temp[foodID]) {
						temp[foodID] = []
					}
					if (temp[foodID].length == 0) {
						temp[foodID].push(element)
					} else if (temp[foodID].length == 1) {
						let g = temp[foodID][0]
						if (g.isCanOpen()) {
							if (element.isOpen()) {
								temp[foodID].push(element)
								return temp[foodID];
							}
						} else {
							temp[foodID].push(element)
							return temp[foodID];
						}
					}
				}
			}

		}
		return null;
	}

	addFoodByStorage(foodModel: GridFoodItemModel, func: Function) {
		let g = this.getUnUseGrid();
		if (g) {
			let food = this.getFood(foodModel);
			g.setFood(food)
			this.updateGridAndBuyState()
			func(true)
		} else {
			func(false)
			TipC.instance().showToast('Grid full')
		}
		// let foodModel = element.getFood();

	}

	addFoodByGift(fm: FoodItemView, pos: cc.Vec2) {
		let g: GridItemView = this.getUnUseGrid();
		if (g) {
			let p = this.gridView.convertToNodeSpaceAR(pos)
			fm.updateFoodState();
			this.addFood(g, fm, p)
			GEvent.instance().emit(EventName.ADD_FOOD_BY_GITF)
			return true;
		} else {
			TipC.instance().showToast('Grid full')
			return false;
		}


	}
	addRecoverFood(g: GridItemView, f: FoodItemView) {
		let m = f.getModel();
		if (m) {
			let food = this.getFood(m);
			g.setFood(food, true)
			this.updateGridAndBuyState()
		}

	}

	addFood(g: GridItemView, f: FoodItemView, pos: cc.Vec2) {
		if (g != null) {
			f.node.parent = this.itemView;
			g.setFood(f, false)
			// let pos = grid.getPos();
			f.node.x = pos.x
			f.node.y = pos.y;
			let target = g.getPos();
			// console.log(' id ', g.getID(), target, pos)
			cc.tween(f.node).to(0.2, { x: target.x, y: target.y }).call(() => {
				g.addFood(f)
				this.updateGridAndBuyState()
				// console.log(' id 222 ', g.getID())
			}).start();
			return true;
		} else {
			//格子满了
			// console.log('格子满了')
			return false;
		}
	}

	getFoodModel(food: FoodItemView) {
		let list: number[] = food.getOutput();
		let count = food.getOutCount();
		if (count > 0) {
			let type = food.getOutType();
			let outIndex: number = 0;
			// console.log(' getFoodModel type ', type)
			switch (parseInt(type)) {
				case FoodOutType.NO_OUT:
					let foodID = food.getFoodID();
					let fm = this.model.addNewFood(foodID)
					return fm;
				case FoodOutType.OUT_RANDOM_AND_CD:
					if (list && list.length > 0) {
						let foodID = Utils.getRandomValueByList(list)
						// let ran: number = 0;
						// for (let i = 0; i < list.length / 2; i++) {
						// 	let foodID = list[i * 2];
						// 	let random = list[i * 2 + 1]
						// 	ran += random
						// 	if (Utils.random(0, 100) <= ran) {
						// 		let fm = this.model.addNewFood(foodID)
						// 		return fm;
						// 	}
						// }
						let fm = this.model.addNewFood(foodID)
						return fm;
					}
					break;
				case FoodOutType.OUT_ITEM_WITH_OPEN_CD:
					outIndex = list.length - count;
					if (outIndex >= 0 && outIndex <= list.length - 1) {
						let foodID = list[outIndex];
						let fm = this.model.addNewFood(foodID)
						return fm;
					}
					break;
				case FoodOutType.OUT_RANDOM_COUNT_DESTROY:
					if (list && list.length > 0) {
						let foodID = Utils.getRandomValueByList(list)
						// let ran: number = 0;
						// for (let i = 0; i < list.length / 2; i++) {
						// 	let foodID = list[i * 2];
						// 	let random = list[i * 2 + 1]
						// 	ran += random
						// 	if (Utils.random(0, 100) <= ran) {
						// 		let fm = this.model.addNewFood(foodID)
						// 		return fm;
						// 	}
						// }
						let fm = this.model.addNewFood(foodID)
						return fm;
					}
					break;
				case FoodOutType.OUT_ITEM_DESTORY:
					outIndex = list.length - count;
					if (outIndex >= 0 && outIndex <= list.length - 1) {
						let foodID = list[outIndex];
						let fm = this.model.addNewFood(foodID)
						return fm;
					}
					break;
			}
		}





		return null;
	}

	addSplitFood(grid: GridItemView, food: FoodItemView) {
		let g: GridItemView = this.getUnUseGrid();
		if (g) {
			let random: number = food.getSplitRandom();
			if (random > 0) {
				let r = Utils.random(0, 100)
				if (r <= random) {
					let fm = this.model.addNewFood(food.getFoodID())
					if (fm) {
						let f: FoodItemView = this.getFood(fm)
						f.setTime()
						f.setState(ItemState.CAN_GET)
						f.updateState()
						this.addFood(g, f, grid.getPos())
					} else {

					}

				}
			}

		} else {
			TipC.instance().showToast('Grid full')
		}

	}

	addFoodByGrid(grid: GridItemView) {
		let food: FoodItemView = grid.getFood()
		let count = food.getOutCount();
		// console.log('addFoodByGrid count ', count)
		if (count > 0) {
			let gridID = -1;
			let g: GridItemView = null
			// if (g) {
			let fm = null;
			let type = food.getOutType();
			// console.log('addFoodByGrid type ', type)
			switch (parseInt(type)) {
				case FoodOutType.NO_OUT:
					break;
				case FoodOutType.OUT_RANDOM_AND_CD:
					food.click();
					gridID = this.getUnUseGridID(parseInt(grid.getID()), {});
					g = this.gridList[gridID]
					if (g) {
						fm = this.getFoodModel(food)
						if (fm) {
							let f: FoodItemView = this.getFood(fm)
							f.setState(ItemState.GOT)
							this.addFood(g, f, grid.getPos())
							food.setOutCount(count - 1)
							if (food.getOutCount() <= 0) {
								food.setState(ItemState.CAN_GET)
								food.setTime()
								food.updateState()
								GEvent.instance().emit(EventName.FOOD_FRAZE, food.getFoodID())
							}
							GuideMgr.instance().notify('GameView_addFoodByGrid')
						}
					} else {
						TipC.instance().showToast('Grid full')
					}


					break;
				case FoodOutType.OUT_ITEM_WITH_OPEN_CD:
					food.click();
					// console.log('addFoodByGrid food.getState() ', food.getState())
					switch (food.getState()) {
						case ItemState.NOT_GET:
							food.setState(ItemState.CAN_GET)
							food.setTime()
							food.updateState()
							GuideMgr.instance().notify('startCDTime')
							break;
						case ItemState.CAN_GET:
							// if (food.getTime() == 0) {
							// 	food.setState(ItemState.GOT)
							// }
							TipC.instance().showToastByLang('REFRESH')
							break;
						case ItemState.GOT:
							gridID = this.getUnUseGridID(parseInt(grid.getID()), {});
							g = this.gridList[gridID]
							if (g) {
								fm = this.getFoodModel(food)
								if (fm) {
									let f: FoodItemView = this.getFood(fm)
									f.updateFoodState();
									this.addFood(g, f, grid.getPos())
									food.setOutCount(count - 1)
									if (food.getOutCount() <= 0) {
										food.removeSelf();
										grid.removeFood()
										this.setFramePos(grid)
									}
								}
							} else {
								TipC.instance().showToast('Grid full')
							}

							break;
					}



					break;
				case FoodOutType.OUT_RANDOM_COUNT_DESTROY:
					food.click();
					gridID = this.getUnUseGridID(parseInt(grid.getID()), {});
					g = this.gridList[gridID]
					if (g) {
						if (food.getState() != ItemState.CAN_GET) {
							fm = this.getFoodModel(food)
							if (fm) {
								let f: FoodItemView = this.getFood(fm)
								f.updateFoodState();
								this.addFood(g, f, grid.getPos())
								food.setOutCount(count - 1)
								if (food.getOutCount() <= 0) {
									food.removeSelf();
									grid.removeFood()
									this.setFramePos(grid)
								}
							}
						}

					} else {
						TipC.instance().showToast('Grid full')
					}

					break;
				case FoodOutType.OUT_ITEM_DESTORY:
					food.click();
					gridID = this.getUnUseGridID(parseInt(grid.getID()), {});
					g = this.gridList[gridID]
					if (g) {
						fm = this.getFoodModel(food)
						if (fm) {
							let f: FoodItemView = this.getFood(fm)
							f.updateFoodState();
							this.addFood(g, f, grid.getPos())
							food.setOutCount(count - 1)
							if (food.getOutCount() <= 0) {
								food.removeSelf();
								grid.removeFood()
								this.setFramePos(grid)
							}
						}
					} else {
						TipC.instance().showToast('Grid full')
					}

					break;
				case FoodOutType.CHOICE_ITEM:
					this.controller.showSelectFoodView(food.getModel(), grid.getID())
					break;
				case FoodOutType.OUT_COST_ITEM:
					// food.click();
					let clickList = food.getOutput();
					// console.log(' clickList ', clickList)
					let pos = food.node.convertToWorldSpaceAR(food.node.getPosition())
					BagManager.instance().updateItemNum(clickList[0], clickList[1], pos, food.icon)
					if (clickList[0] == ItemID.GOLD) {
						SpecialtaskMgr.instance().addGold(clickList[1])
					}
					food.removeSelf();
					grid.removeFood();
					this.setFramePos(grid)
					break;
			}


			// }
			return true;
			// }
			// }
		} else {
			//
			if (food.canOutput()) {
				TipC.instance().showToastByLang('REFRESH')
			}
		}
		return false;
	}

	getUnUseGridID(id: number, map: any) {
		// let id = parseInt(grid.getID());
		map[id] = 1
		let temp = []
		// console.log(' id ', id)
		let row = Math.floor(id / 7)
		let line = id % 7;
		let left = id - 1;
		let right = id + 1;
		let up = id - 7;
		let down = id + 7;
		if (Math.floor(left / 7) == row) {
			temp.push(left)
		}
		if (Math.floor(right / 7) == row) {
			temp.push(right)
		}

		if (up % 7 == line) {
			temp.push(up)
		}
		if (down % 7 == line) {
			temp.push(down)
		}
		// console.log(' temp ', temp)
		for (let index = 0; index < temp.length; index++) {
			const element = temp[index];
			if (element >= 0 && element <= 63) {
				let g = this.gridList[element]
				if (g && g.getState() == ItemState.GOT && !g.hasFood()) {
					return g.getID();
				}
			}
		}
		if (temp.length > 0) {
			for (let index = 0; index < temp.length; index++) {
				const element = temp[index];
				if (element >= 0 && element <= 63 && !map[element]) {
					let result = this.getUnUseGridID(parseInt(element), map)
					if (result >= 0) {
						return result;
					}
				}

			}
		}
		return -1;
	}

	getUnUseGrid(): GridItemView {
		// let temp = []
		for (let i = 0; i < this.gridList.length; i++) {
			let vaule = this.gridList[i];
			if (!vaule.isOpen() || vaule.hasFood()) {
				continue;
			}
			// temp.push(vaule)
			return vaule
		}
		return null;
	}



	touchCancel(e: cc.Touch) {
		this.touchEnd(e)
	}

	getFood(fm: GridFoodItemModel) {
		// let node: cc.Node = cc.instantiate(this.foodPrefab)
		let node: cc.Node = CCPoolManager.instance().get('FoodItemView', () => {
			return cc.instantiate(this.foodPrefab)
		})
		if (node) {
			// console.log('888')
			let food = node.getComponent(FoodItemView)
			if (food) {
				// console.log('89999')
				food.setModel(fm)
				// console.log('10010101010')
				food.content()
				// console.log('1212121212')
				return food;
			}

		}
		return null;


	}

	splitFrameInit(index: number) {
		let list = this.model.getGridItemModelList()
		if (list.length <= 0 || index < 0 || index >= list.length) {
			TimeManager.instance().remove(this.frameLoader)
			this.updateGridAndBuyState()
			this.isLoadFinish = true;
			return;
		}
		const element: GridItemModel = list[index];
		let node: cc.Node = cc.instantiate(this.itemPrefab)
		// let node: cc.Node = CCPoolManager.instance().get('GridItemView', () => {
		// 	return cc.instantiate(this.itemPrefab)
		// })
		let comp: GridItemView = node.getComponent(GridItemView)
		comp.setModel(element)
		let foodModel = element.getFood();
		if (foodModel) {
			let food = this.getFood(foodModel);
			comp.setFood(food)

		}
		this.gridView.addChild(node)
		comp.content()
		let x = node.width / 2 + node.width * (index % 7);
		let y = -node.height / 2 - node.height * Math.floor(index / 7)
		node.setPosition(x, y)
		this.gridList.push(comp)
	}

	initGrid() {
		let list = this.model.getGridItemModelList()
		for (let index = 0; index < list.length; index++) {
			this.splitFrameInit(index)
		}
	}

	boxBtnClick() {

	}



	recover() {
		if (this.buyView)
			this.buyView.recover()
		for (let index = 0; index < this.gridList.length; index++) {
			const element = this.gridList[index];
			element.recover()
		}
		this.hide()
	}

	buyFood(buy: BuyItemView) {
		let pos = buy.node.parent.convertToWorldSpaceAR(buy.node.getPosition())
		let pos2 = this.itemView.convertToNodeSpaceAR(pos)
		let list = buy.getFoods();
		let count = 0;
		for (let index = 0; index < list.length; index++) {
			const element: BuyFoodItemView = list[index];
			this.gridDelete(element.getID(), pos2, () => {
				count++;
				if (count >= list.length) {
					this.foodMoveFinish(buy, pos)
				}
			})
		}

	}

	private foodMoveFinish(buyItem: BuyItemView, pos) {
		SoundMgr.instance().playSound(SoundID.sfx_winCashTillClose)
		let item = buyItem.getRewardItem();

		// console.log(' item.getID(), item.getNum() ', item.getID(), item.getNum(false))
		// console.log(' item ', item)
		buyItem.removeSelf();
		BagManager.instance().updateItem(item, pos)
		if (item.getID() == ItemID.GOLD) {
			SpecialtaskMgr.instance().addGold(item.getNum(false))
		}
		// cc.tween(buy.node).delay(0.1).call(() => {

		// buy.recover()
		buyItem.changePersonState(PersonState.OUT)
		cc.tween(this.node)
			.delay(buyItem.getDuration())
			.call(() => {
				buyItem.recover();
				if (this.buyView) {
					this.buyView.addPerson()
				}

				this.updateGridAndBuyState()
			})
			.start();
		// buyItem.back(() => {


		// });

		// }).start();

	}

	getFoodType() {
		let list: GridItemView[] = this.gridList;
		let temp = []
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			let food = element.getFood();
			if (food) {
				let type = food.getOutType();
				if (type == FoodOutType.OUT_RANDOM_AND_CD) {
					let price = food.getPrice()
					if (price && price.length > 0) {
						for (let j = 0; j < price.length; j++) {
							const foodType = price[j];
							temp.push(foodType)
						}
					}
				}
			}
		}
		return temp;
	}

	gridDelete(foodID: number, pos: cc.Vec2, func: Function) {
		let list: GridItemView[] = this.gridList;
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.getState() == ItemState.GOT) {
				let food = element.getFood();
				// console.log(' element.hasFood() ', element.hasFood())
				if (food && food.getState() != ItemState.CAN_GET) {
					let f = food.getFoodID();
					// console.log('gridDelete f  ', f, foodID, f == foodID)
					if (f == foodID) {
						// element.setFood(null)
						this.setFoodPos(food, element)
						food.setBgVisible(FoodHasState.NONE)
						// element.removeFood(false)
						element.setFood(null)
						if (element.isSelect) {
							this.setFoodInfo(element)
						}
						cc.tween(food.node).to(0.3, { x: pos.x, y: pos.y })
							.call(() => {
								// element.recoverFood()
								food.recover()

								func();
							})
							.start()


						break;
					}

				} else {
					// console.log('food is null  gridDelete foodID ', foodID)
				}
			}


			// console.log(' ffffffffffffffffff ', f)

		}
	}



	addToStorage(grid: GridItemView) {
		let food: FoodItemView = grid.getFood();
		if (food) {
			let flag = this.model.addToStorage(food.getModel())
			if (flag) {
				if (this.bottom)
					this.bottom.openAnim()
				// food.removeSelf();
				grid.removeFood()
				this.setFoodInfo(grid)
			} else {
				//多拽的位置不存在 还原
				grid.setFood(food)
				// this.select(true)
				this.setFramePos(grid)
			}
		}

	}

	// collideWithBox(food: FoodItemView) {
	// 	let rect: cc.Rect = food.node.getBoundingBoxToWorld()
	// 	let rect2: cc.Rect = this.box.getBoundingBoxToWorld()
	// 	let flag = Utils.isRectCollideAnchor(rect.x, rect.y, rect.width, rect.height, 0.5, 0.5,
	// 		rect2.x, rect2.y, rect2.width, rect2.height, 0.5, 0.5)
	// 	return flag;
	// }
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
