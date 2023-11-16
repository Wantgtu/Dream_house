import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import BuyItemModel from "./BuyItemModel";
import { LocalList, LocalValue } from "../../../cfw/local";
import { EventName, ItemID, ItemType } from "../../../config/Config";
import LevelMgr from "../../level/model/LevelMgr";
import { GEvent } from "../../../cfw/event";
import Utils from "../../../cfw/tools/Utils";
import FoodMgr from "../../game/model/FoodMgr";
import BuyPerson from "./BuyPerson";
import FoodItemModel from "../../game/model/FoodItemModel";
import PersonMgr from "../../person/model/PersonMgr";
import TestConfig from "../../../config/TestConfig";
import Debug from "../../../cfw/tools/Debug";
let countRandom: number[] = [1, 50, 2, 40, 3, 10]
let BUY_PERSON: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 16]
/**
* %SheetName%
**/
export default class BuyMgr extends BaseModel {

	protected buyItemModelMgr: ModelManager<BuyItemModel> = new ModelManager()

	protected buyList: LocalList;
	protected buyItemList: BuyPerson[] = []
	protected personIndex: LocalValue
	initData() {

		this.buyList = new LocalList('BuyList', 0)
		this.personIndex = new LocalValue('personIndex', 1)
		this.buyItemModelMgr.initWithData(ModuleManager.dataManager.get(BuyItemModel.CLASS_NAME), BuyItemModel)
		if (!this.buyList.isHaveData()) {
			this.buyList.push(1)
			this.personIndex.updateValue(1)
		}


		// let value = this.buyList.getValue();
		for (let index = 0; index < this.buyList.size(); index++) {
			let id = this.buyList.get(index)
			this.buyItemList.push(this.getNewBuyPerson(id))
		}
		// this.updateItemsState()

		//test
		if (TestConfig.CAT_TEST) {
			cc.warn(' init 111')
			this.buyItemList.push(this.addBuyPerson(32))
			cc.warn(' init 22')
		}

		if (TestConfig.BUY_TEST) {
			let list = this.getBuyItemModelList();
			for (let index = 0; index < list.length; index++) {
				const element: BuyItemModel = list[index];
				let foods = element.getItemList();
				// Debug.log('foods count ', foods.length)
				for (let i = 0; i < foods.length; i++) {
					const food = foods[i];
					// Debug.log(' food.getType() ', food.getType(), food.getID())
					if (food.getType() != ItemType.FOOD) {
						Debug.warn(' food id ', food.getID(), element.getID())
					}
				}
			}
		}



	}

	getBuyPerson(id: string) {
		for (let index = 0; index < this.buyItemList.length; index++) {
			const element = this.buyItemList[index];
			if (element.getID() == id) {
				return element
			}
		}
		return null
	}



	hasPerson(perID: number) {
		for (let index = 0; index < this.buyItemList.length; index++) {
			const element = this.buyItemList[index];
			if (element.getPersonID() == perID) {
				return true;
			}
		}
		return false;
	}

	hasSameItem(buy: BuyItemModel) {
		let list = this.buyItemList;
		for (let index = 0; index < list.length; index++) {
			const buyPerson: BuyPerson = list[index];
			let items = buy.getItems();
			let buyItems = buyPerson.getItems();
			// if (items.length == buyItems.length) {
			let count = 0;
			for (let i = 0; i < items.length; i++) {
				const itemID = items[i];
				let j = buyItems.indexOf(itemID)
				if (j >= 0) {
					count++;
				}
			}
			// console.log(' count ', count, ' item count ', items.length)
			if (count >= items.length) {
				return true;
			}
			// }
		}
		return false;
	}

	getUnUsePersonID() {
		let temp = []
		// let list = PersonMgr.instance().getPersonItemModelList();
		// let startId = 1
		// let endId = 14
		// for (let perID = startId; perID <= endId; perID++) {
		// 	temp.push(perID)
		// }
		for (let index = 0; index < BUY_PERSON.length; index++) {
			const element = BUY_PERSON[index];
			temp.push(element)
		}
		for (let index = 0; index < temp.length; index++) {
			let r = Utils.random(0, temp.length)
			let a = temp[0]
			let b = temp[r]
			temp[r] = a;
			temp[0] = b;
		}
		for (let index = 1; index < temp.length; index++) {
			let perID = temp[index]
			let flag = this.hasPerson(perID)
			if (!flag) {
				return perID;
			}

		}
		return -1;
	}

	canCreate(buy: BuyItemModel) {
		if (!buy) {
			return false
		}
		let foods = buy.getItems();
		for (let index = 0; index < foods.length; index++) {
			const foodID = foods[index];
			let food = FoodMgr.instance().getFoodItemModel(foodID)
			if (food) {
				let beBornID = food.getBeBornInitID();
				// console.log(' beBornID ', beBornID)
				if (beBornID > 0) {
					let bornFood = FoodMgr.instance().getFoodItemModel(beBornID)
					if (bornFood) {
						// console.log(' bornFood.getFoodState() ', bornFood.getFoodState())
						if (bornFood.getFoodState() == ItemState.NOT_GET) {
							return false
						}
					}
				}
			}

		}
		return !this.hasSameItem(buy);
	}

	addBuyPerson(foodID: number) {
		let person = new BuyPerson(foodID)
		if (!person.hasData()) {
			let data: BuyItemModel = this.getBuyItemModel(foodID)
			if (data) {
				person.setPersonID(data.getPersonID())
				person.setItems(data.getItems())
				person.setItemID(data.getItemID())
				person.setItemNum(data.getItemNum())
				cc.warn(' addBuyPerson 1 ')
				let deleteID = data.getDelete()
				if (deleteID && deleteID > 0) {
					person.setDelete(data.getDelete())
				}
				cc.warn(' addBuyPerson 21 ')
			}
			person.setState(ItemState.NOT_GET)
		}
		cc.warn(' addBuyPerson 3 ')
		return person;
	}

	getNewBuyPerson(id: number, foodTypeList?: number[]) {
		// console.log('getNewBuyPerson  id ', id, 'foodTypeList', foodTypeList)
		let person = new BuyPerson(id)
		//如果有配置表中有id就直接读取配置表中的数据，
		//如果没有就需要自己处理了
		if (!person.hasData()) {
			let data: BuyItemModel = this.getUnUseData();
			if (data) {
				// console.log('getNewBuyPerson 11111111111111111 ')
				person.setPersonID(data.getPersonID())
				person.setItems(data.getItems())
				person.setItemID(data.getItemID())
				person.setItemNum(data.getItemNum())
				let deleteID = data.getDelete()
				if (deleteID > 0) {
					person.setDelete(data.getDelete())
				}

			} else {
				let count = this.buyItemModelMgr.size();
				if (id <= count) {
					//表中的数据没有用完直接返回，不产生
					return null;
				}
				if (foodTypeList && foodTypeList.length > 0) {
					let perID = this.getUnUsePersonID();
					person.setPersonID(perID)

					let itemList = []
					let gold: number = 0;
					//需求个数
					let count = Utils.getRandomValueByList(countRandom)
					// console.log('getNewBuyPerson 2222222222222222 count ', count)
					for (let i = 0; i < count; i++) {
						let type = foodTypeList[Utils.random(0, foodTypeList.length)]
						let foodList: FoodItemModel[] = FoodMgr.instance().getFoodIndexData(type)
						let r: number = 0;
						for (let j = 0; j < foodList.length; j++) {
							const food: FoodItemModel = foodList[j];
							let price = food.getPrice()
							if (price && price.length > 0) {
								let num = price[0]
								let ran = price[1]
								r += ran;
								let random = Utils.random(0, 100)
								if (random <= r) {
									itemList.push(food.getID())
									gold += num;
									break;
								}
							}
						}
					}

					person.setItems(itemList)
					person.setItemID(ItemID.GOLD)
					person.setItemNum(gold)

				} else {
					// console.log('getNewBuyPerson 22222222222222222 ')
					return null;
				}
			}
			person.setState(ItemState.NOT_GET)
		}
		return person
	}

	getUnUseData() {
		let count = this.buyItemModelMgr.size();
		let i = 0;
		let person = null;
		for (let index = 0; index < count; index++) {
			const element = this.buyItemModelMgr.getByIndex(index);
			if (element.getState() == ItemState.NOT_GET) {
				if (this.canCreate(element)) {
					if (element.getID() > 3) {
						let perID = this.getUnUsePersonID();
						element.setPersonID(perID)
						person = element
						element.setState(ItemState.GOT)
						break;
					} else {
						let perID = element.getPersonID();
						if (!this.hasPerson(perID)) {
							element.setPersonID(perID)
							person = element
							element.setState(ItemState.GOT)
							break;
						}
					}
				} else {
					// console.warn(' canCreate false')
				}
				i++
				if (i > 5) {
					break;
				}
				// break;
			}

		}
		return person;
	}

	getPerson(foodTypeList: number[]) {
		let id = this.personIndex.getInt()
		let person = this.getNewBuyPerson(id, foodTypeList)
		if (person)
			this.personIndex.updateValue(1)
		return person;

	}

	private getCount() {
		let count = 0
		let len = this.buyItemList.length;
		// for (let index = 0; index < this.buyItemList.length; index++) {
		// 	const element = this.buyItemList[index];
		// 	if (element.getItemID() == ItemID.GOLD) {
		// 		count++;
		// 	}
		// }
		return len;
	}

	audoAddPerson(typeList: number[]) {
		let lv = LevelMgr.instance().getPersonNum();
		let len = this.getCount();
		if (len < lv) {
			let sub = lv - len;
			console.log('audoAddPerson sub =========== ', sub)
			for (let index = 0; index < sub; index++) {

				let person = this.getPerson(typeList);
				if (person) {
					person.setState(ItemState.ON_GOING)
					this.add(person)
					GEvent.instance().emit(EventName.ADD_BUY_ITEM, person)
				}
				// this.curID.updateValue(1)
				// if (this.curID.getInt() < this.buyItemModelMgr.size()) {
				// 	let id = this.curID.getInt();
				// 	let m = this.getBuyItemModel(id);
				// 	this.add(m)

				// }
			}
		}
	}



	private getBuyItemModel(id) { return this.buyItemModelMgr.getByID(id) }

	getBuyItemModelList() { return this.buyItemModelMgr.getList() }

	getBuyList() {
		return this.buyItemList;
	}

	remove(model: BuyPerson) {
		let index = this.buyItemList.indexOf(model)
		if (index >= 0) {
			model.setState(ItemState.GOT)
			this.buyItemList.splice(index, 1)
			this.buyList.delete(model.getID())
		}
	}

	add(model: BuyPerson) {
		this.buyList.push(model.getID())
		this.buyItemList.push(model)
	}


	// updateItemsState() {
	// 	// console.log(' this.buyItemList.length ', this.buyItemList.length)
	// 	for (let index = 0; index < this.buyItemList.length; index++) {
	// 		const element = this.buyItemList[index];
	// 		element.updateState()
	// 	}
	// }


}