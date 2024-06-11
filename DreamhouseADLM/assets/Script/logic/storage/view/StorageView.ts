import { BaseView } from "../../../cfw/view";
import StorageMgr from "../model/StorageMgr";
import StorageC from "../StorageC";
import StorageLineItemView from "./StorageLineItemView";


const { ccclass, property } = cc._decorator;

@ccclass
export default class StorageView extends BaseView {

	@property({ type: cc.Sprite, displayName: "scrollViewSprite" })
	scrollViewSprite: cc.Sprite = null;

	@property({ type: cc.ScrollView, displayName: "scrollViewScrollView" })
	scrollViewScrollView: cc.ScrollView = null;

	@property({ type: cc.Sprite, displayName: "backBtnSprite" })
	backBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "backBtnButton" })
	backBtnButton: cc.Button = null;

	@property(cc.Prefab)
	linePrefab: cc.Prefab = null;

	protected model: StorageMgr;
	protected controller: StorageC;
	onLoad() {
		let list = this.model.getStorageItemModelList();
		let count = Math.ceil(list.length / 3)
		for (let index = 0; index < count; index++) {
			let node = cc.instantiate(this.linePrefab)
			let comp = node.getComponent(StorageLineItemView)
			if (comp) {
				for (let j = 0; j < 3; j++) {
					let idx = index * 3 + j;
					comp.init(j, list[idx], this.controller)
				}

			}
			this.scrollViewScrollView.content.addChild(node)
		}
	}




	onDestroy() {

	}

	onbackBtnButtonClick() {
		this.hide()
	}



}