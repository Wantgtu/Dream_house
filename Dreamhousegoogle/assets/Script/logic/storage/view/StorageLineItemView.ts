import StorageItemView from "./StorageItemView";
import { BaseItemView } from "../../../cfw/view";
import StorageItemModel from "../model/StorageItemModel";
import StorageC from "../StorageC";


const { ccclass, property } = cc._decorator;

@ccclass
export default class StorageLineItemView extends BaseItemView {




	@property({ type: [StorageItemView], displayName: "StorageItemViewStorageItemView" })
	StorageItemViewStorageItemView: StorageItemView[] = [];

	onLoad() {
	}


	init(idx: number, model: StorageItemModel, controller: StorageC) {
		// let idx = index % 3;
		this.StorageItemViewStorageItemView[idx].setModel(model)
		this.StorageItemViewStorageItemView[idx].setController(controller)
		this.StorageItemViewStorageItemView[idx].content();
	}




	onDestroy() {

	}



}