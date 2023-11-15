import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import DialogItemModel, { DialogItemModelEnum } from "./DialogItemModel";
import OperateObserver from "../../gevent/operate/OperateObserver";
/**
* %SheetName%
**/
export default class DialogMgr extends OperateObserver {
	static DIALOG_START: string = 'DIALOG_START'
	protected dialogItemModelMgr: ModelManager<DialogItemModel> = new ModelManager()


	initData() {
		this.dialogItemModelMgr.initWithData(ModuleManager.dataManager.get(DialogItemModel.CLASS_NAME), DialogItemModel)

	}

	getDialogItemModel(id) { return this.dialogItemModelMgr.getByID(id) }

	getDialogItemModelList() { return this.dialogItemModelMgr.getList() }


	getDialogIndexData(id: number) {
		return this.dialogItemModelMgr.getIndexData(DialogItemModelEnum.dialogID, id)
	}


	start(id) {
		this.emit(DialogMgr.DIALOG_START, id)
	}


}